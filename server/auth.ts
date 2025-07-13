import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import { storage } from "./storage"; // Adjust path as needed
import { User, InsertUser, adminSessions, InsertAdminSession, users, sessions } from "@shared/schema"; // Adjust path as needed
import connectPg from "connect-pg-simple";
import { pool } from "@db"; // Adjust path as needed
import { eq, and, gt } from "drizzle-orm";
import { db } from '@db'; // Adjust path as needed
import { v4 as uuidv4 } from 'uuid';
import { emailService } from './email';

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'niddik-jwt-secret';

// Function to generate JWT token for a user
const generateToken = (user: User | AdminUser) => { // Updated type
    const { password, ...userWithoutPassword } = user;
    return jwt.sign(
        { user: userWithoutPassword },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// JWT validation middleware removed - using session-based auth only

const PostgresSessionStore = connectPg(session);

declare global {
    namespace Express {
        interface User extends User { }
    }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    try {
        console.log('Comparing passwords - supplied length:', supplied.length, 'stored format:', stored.includes('.') ? 'valid' : 'invalid');
        
        if (!stored || !stored.includes('.')) {
            console.log('Invalid stored password format');
            return false;
        }

        const [hashed, salt] = stored.split(".");
        if (!hashed || !salt) {
            console.log('Unable to extract hash and salt');
            return false;
        }

        console.log('Hash length:', hashed.length, 'Salt length:', salt.length);
        
        const hashedBuf = Buffer.from(hashed, "hex");
        const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
        const result = timingSafeEqual(hashedBuf, suppliedBuf);
        
        console.log('Password comparison result:', result);
        return result;
    } catch (error) {
        console.error('Error in comparePasswords:', error);
        return false;
    }
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || 'niddik-secret-key',
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
        store: new PostgresSessionStore({
            pool,
            tableName: 'session',
            createTableIfMissing: true,
            pruneSessionInterval: 60,
            // Add better error handling for session store
            errorLog: (error) => {
                console.error('Session store error:', error.message);
            },
            // Retry configuration
            conString: process.env.DATABASE_URL,
            ttl: 30 * 24 * 60 * 60, // 30 days in seconds
            schemaName: 'public',
            // Connection timeout settings
            connectTimeout: 10000,
            queryTimeout: 10000
        }),
        name: 'connect.sid',
        cookie: {
            secure: false, // Set to false for development
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            path: '/',
            sameSite: 'lax'
            // Remove domain setting for development
        },
        rolling: true,
        unset: 'destroy'
        // Remove custom genid to use default behavior
    };

    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                console.log('Login attempt for username/email:', username);
                
                // Find user in the users table by username or email
                const user = await db.query.users.findFirst({
                    where: (fields, { eq, or }) => or(
                        eq(fields.username, username),
                        eq(fields.email, username)
                    )
                });

                if (!user) {
                    console.log('User not found:', username);
                    return done(null, false, { message: 'Invalid credentials' });
                }

                console.log('User found:', user.username, 'Password hash format check:', user.password ? user.password.substring(0, 20) + '...' : 'NO PASSWORD');
                
                // Check if password exists and is properly formatted
                if (!user.password || !user.password.includes('.')) {
                    console.log('Invalid password format for user:', username);
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const passwordMatch = await comparePasswords(password, user.password);
                console.log('Password match result:', passwordMatch);

                if (!passwordMatch) {
                    console.log('Password mismatch for user:', username);
                    return done(null, false, { message: 'Invalid credentials' });
                } else {
                    console.log('Login successful for user:', username);
                    return done(null, user);
                }
            } catch (error) {
                console.error('Login error:', error);
                return done(error);
            }
        }),
    );

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            // Find user in the users table
            const user = await db.query.users.findFirst({
                where: (fields, { eq }) => eq(fields.id, id)
            });

            if (!user) {
                console.log('User not found during deserialization:', id);
                return done(null, false);
            }

            // For admin users, verify session less frequently (every 5 minutes)
            if (user.role === 'admin') {
                // const now = new Date();
                // const adminSession = await db.query.adminSessions.findFirst({
                //     where: and(
                //         eq(adminSessions.userId, user.id),
                //         eq(adminSessions.isActive, true),
                //         gt(adminSessions.expiresAt, now)
                //     )
                // });

                // if (!adminSession) {
                //     console.log('No valid admin session found for user:', user.id);
                //     // Clear invalid session
                //     await db.update(adminSessions)
                //         .set({ isActive: false })
                //         .where(eq(adminSessions.userId, user.id));
                //     return done(null, false);
                // }

                // // Only update session if last activity was more than 5 minutes ago
                // const fiveMinutesAgo = new Date(now.getTime() - (5 * 60 * 1000));
                // if (adminSession.lastActivity < fiveMinutesAgo) {
                //     const newExpiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
                //     await db.update(adminSessions)
                //         .set({ 
                //             lastActivity: now,
                //             expiresAt: newExpiresAt,
                //             isActive: true
                //         })
                //         .where(eq(adminSessions.id, adminSession.id));
                // }
            }

            // Remove password before sending to client
            const { password, ...userWithoutPassword } = user;
            done(null, userWithoutPassword);
        } catch (error) {
            console.error('Error during user deserialization:', error);
            done(error);
        }
    });

    // Register API route
    app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('Registration attempt for username:', req.body.username);
            
            // Check if user already exists
            const existingByUsername = await storage.getUserByUsername(req.body.username);
            if (existingByUsername) {
                return res.status(400).json({ error: "Username already exists" });
            }

            const existingByEmail = await storage.getUserByEmail(req.body.email);
            if (existingByEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }

            // Hash the password
            const hashedPassword = await hashPassword(req.body.password);
            console.log('Password hashed successfully for user:', req.body.username, 'Hash format:', hashedPassword.substring(0, 20) + '...');

            // Create user with hashed password
            const user = await storage.createUser({
                ...req.body,
                password: hashedPassword,
            });

            // Log the user in after registration
            req.login(user, async (err) => {
                if (err) return next(err);

                // Generate JWT token
                const token = generateToken(user);

                // Send welcome email to user
                try {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    await emailService.sendWelcomeEmail(user.email, user.fullName || user.username, baseUrl);
                } catch (emailError) {
                    console.error('Failed to send welcome email:', emailError);
                    // Don't fail registration if email fails
                }

                // Send admin notification
                try {
                    const baseUrl = `${req.protocol}://${req.get('host')}`;
                    await emailService.sendAdminRegistrationNotification(
                        user.fullName || user.username,
                        user.email,
                        user.phone,
                        user.location || user.city,
                        user.skills,
                        baseUrl
                    );
                } catch (emailError) {
                    console.error('Failed to send admin registration notification:', emailError);
                    // Don't fail registration if email fails
                }

                // Return user without password, and include token
                const { password, ...userWithoutPassword } = user;
                res.status(201).json({
                    ...userWithoutPassword,
                    token
                });
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: info.message || "Invalid credentials" });

            req.login(user, async (err) => {
                if (err) return next(err);

                console.log("Logged-in user:", user);

                if (user.role === "admin") {
                    console.log("Admin login - Session ID:", req.sessionID);
                    
                    // Store essential session data for admin
                    req.session.adminAuth = {
                        userId: user.id,
                        role: user.role,
                        authenticatedAt: new Date()
                    };

                    // Save session immediately
                    await new Promise<void>((resolve, reject) => {
                        req.session.save((err) => {
                            if (err) {
                                console.error("Session save error:", err);
                                reject(err);
                            } else {
                                console.log("Admin session saved successfully");
                                resolve();
                            }
                        });
                    });

                        // Update session store immediately
                        // await db.update(adminSessions)
                        //     .set({ 
                        //         lastActivity: new Date(),
                        //         sessionData: JSON.stringify({
                        //             ...sessionData,
                        //             authenticated: true
                        //         })
                        //     })
                        //     .where(eq(adminSessions.id, session.id));

                        // console.log("Admin session established:", session.id);
                    // } catch (error: any) {
                    //     console.error("Error creating admin session:", error);
                    //     return res.status(500).json({ error: `Failed to create admin session: ${error.message}` });
                    // }
                }

                // Send login notification email for regular users (not admins)
                if (user.role !== 'admin') {
                    try {
                        const baseUrl = `${req.protocol}://${req.get('host')}`;
                        const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
                        await emailService.sendLoginNotification(
                            user.email,
                            user.fullName || user.username,
                            new Date(),
                            ipAddress,
                            baseUrl
                        );
                    } catch (emailError) {
                        console.error('Failed to send login notification:', emailError);
                        // Don't fail login if email fails
                    }
                }

                // Generate JWT token
                const token = generateToken(user);

                // Return user without password, and include token
                const { password, ...userWithoutPassword } = user;
                res.status(200).json({
                    ...userWithoutPassword,
                    token
                });
            });
        })(req, res, next);
    });

    // Logout API route
    app.post("/api/logout", async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Update last logout time if user is authenticated
            if (req.isAuthenticated() && req.user && req.user.id) {
                await storage.updateLastLogout(req.user.id);
            }

            req.logout((err) => {
                if (err) return next(err);
                res.sendStatus(200);
            });
        } catch (error) {
            console.error("Logout error:", error);
            req.logout((err) => {
                if (err) return next(err);
                res.sendStatus(200);
            });
        }
    });


     app.delete('/api/remove-resume', async (req: Request, res: Response) => {
        try {
          // Check session authentication only
          if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: "Not authenticated" });
          }

          const userId = (req.user as User).id;

          // Update user in the database
          await db.update(users)
            .set({ resumeUrl: null })
            .where(eq(users.id, userId));

          return res.status(200).json({ success: true, message: "Resume URL deleted successfully" });
        } catch (error) {
          console.error('Error removing resume URL:', error);
          return res.status(500).json({ error: "Internal server error" });
        }
      });

    // Current user API route (session authentication only)
app.get("/api/user", async (req: Request, res: Response) => {
    try {
        // Check session authentication only
        if (!req.isAuthenticated() || !req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const userId = (req.user as User).id;

        // Get fresh user data from storage
        const user = await storage.getUserById(userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

    // Middleware to check if user is authenticated (supports both session and JWT)
    app.use("/api/admin", async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Skip auth check for login endpoint
            if (req.path === '/login') {
                return next();
            }

            console.log('Admin middleware - Session ID:', req.sessionID);
            console.log('Admin middleware - User authenticated:', req.isAuthenticated());
            console.log('Admin middleware - User data:', req.user);

            // First check session authentication
            if (req.isAuthenticated() && req.user) {
                const userId = (req.user as User).id;
                console.log('Admin middleware - User ID from session:', userId);

                // Get admin user
                const user = await db.query.users.findFirst({
                    where: eq(users.id, userId)
                });

                console.log('Admin middleware - Database user found:', !!user, 'Role:', user?.role);

                if (!user || user.role !== 'admin') {
                    console.log('Admin middleware - User not admin or not found');
                    return res.status(403).json({ error: "Not an admin user" });
                }

                console.log('Admin middleware - Admin authenticated successfully');
                return next();
            }

            // If session check fails, try JWT
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
                    if (decoded.user && decoded.user.role === 'admin') {
                        req.user = decoded.user;
                        console.log('Admin middleware - JWT admin authenticated');
                        return next();
                    }
                } catch (error) {
                    console.log("JWT verification failed:", error);
                }
            }

            console.log('Admin middleware - Authentication failed');
            return res.status(401).json({ error: "Not authenticated" });
        } catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    // Admin-specific user check endpoint
app.get("/api/admin/check", async (req: Request, res: Response) => {
  try {
    console.log('Admin check - Session ID:', req.sessionID);
    console.log('Admin check - Authenticated:', req.isAuthenticated());
    console.log('Admin check - User:', req.user);

    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = req.user.id;

    // Get user from users table and check admin role
    const user = await db.query.users.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId)
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Not an admin user" });
    }

    // Return user data without password
    const { password, ...userData } = user;
    return res.json(userData);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
}