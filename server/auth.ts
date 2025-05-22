import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import { storage } from "./storage"; // Adjust path as needed
import { User, InsertUser, adminSessions, InsertAdminSession, users, AdminUser, adminUsers } from "@shared/schema"; // Adjust path as needed
import connectPg from "connect-pg-simple";
import { pool } from "@db"; // Adjust path as needed
import { eq, and, gt } from "drizzle-orm";
import { db } from '@db'; // Adjust path as needed
import { v4 as uuidv4 } from 'uuid';

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

// JWT token validation middleware
const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
        return next(); // No token, proceed with session auth
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: User | AdminUser }; // Updated type
        if (decoded.user) {
            // Set user if token is valid
            req.user = decoded.user;
        }
        next();
    } catch (error) {
        // Invalid token, but we'll still proceed with session auth
        next();
    }
};

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
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || 'niddik-secret-key',
        resave: true,
        saveUninitialized: true,
        store: new PostgresSessionStore({
            pool,
            tableName: 'session',
            createTableIfMissing: true,
            pruneSessionInterval: 60
        }),
        name: 'admin.sid',
        cookie: {
            secure: false, // Set to false for development
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.replit.dev' : undefined
        },
        rolling: true,
        unset: 'destroy',
        genid: (req) => {
            const sessionId = uuidv4();
            console.log('New session ID generated:', sessionId);
            return sessionId;
        }
    };

    app.set("trust proxy", 1);
    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    // Apply JWT validation middleware
    app.use(validateJWT);

    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                // Try to find the user in the adminUsers table
                let adminUser = await db.query.adminUsers.findFirst({
                    where: (fields, { eq }) => eq(fields.username, username)
                });

                // If not found in adminUsers, try the regular users table
                if (!adminUser) {
                    adminUser = await db.query.users.findFirst({
                        where: (fields, { eq }) => eq(fields.username, username)
                    }) as any; // Type assertion to allow assignment
                }

                if (!adminUser) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const passwordMatch = await comparePasswords(password, adminUser.password);

                if (!passwordMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                } else {
                    return done(null, adminUser);
                }
            } catch (error) {
                return done(error);
            }
        }),
    );

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser(async (id: number, done) => {
        try {
            // Try to find the user in adminUsers first
            let user = await db.query.adminUsers.findFirst({
                where: (fields, { eq }) => eq(fields.id, id)
            });

            // If not found, try the regular users table
            if (!user) {
                user = await db.query.users.findFirst({
                    where: (fields, { eq }) => eq(fields.id, id)
                });
            }

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
            // Check if user already exists
            const existingByUsername = await storage.getUserByUsername(req.body.username);
            if (existingByUsername) {
                return res.status(400).json({ error: "Username already exists" });
            }

            const existingByEmail = await storage.getUserByEmail(req.body.email);
            if (existingByEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }

            // Create user with hashed password
            const user = await storage.createUser({
                ...req.body,
                password: await hashPassword(req.body.password),
            });

            // Log the user in after registration
            req.login(user, (err) => {
                if (err) return next(err);

                // Generate JWT token
                const token = generateToken(user);

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
                    const sessionId = req.sessionID;
                    console.log("Admin session ID:", sessionId);

                    const now = new Date();
                    const expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

                    // Set session data
                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        email: user.email,
                        lastActivity: now,
                        authenticated: true
                    };

                    // Save session immediately
                    await new Promise<void>((resolve, reject) => {
                        req.session.save((err) => {
                            if (err) {
                                console.error("Session save error:", err);
                                reject(err);
                            }
                            resolve();
                        });
                    });

                    // Update or insert into sessions table
                    await db.query.sessions.findFirst({
                        where: eq(sessions.sessionId, sessionId)
                    }).then(async (existingSession) => {
                        if (existingSession) {
                            await db.update(sessions)
                                .set({
                                    userId: user.id,
                                    sessionData: JSON.stringify(req.session),
                                    lastActivity: now,
                                    expiresAt: expiresAt,
                                    isActive: true
                                })
                                .where(eq(sessions.sessionId, sessionId));
                        } else {
                            await db.insert(sessions)
                                .values({
                                    userId: user.id,
                                    sessionId: sessionId,
                                    sessionData: JSON.stringify(req.session),
                                    lastActivity: now,
                                    expiresAt: expiresAt,
                                    isActive: true
                                });
                        }
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
          let userId: number | null = null;

          // First check for JWT token
          const authHeader = req.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
              const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
              userId = decoded.user.id;
            } catch (error) {
              console.log("JWT verification failed, falling back to session check");
            }
          }

          // If no valid JWT, check session authentication
          if (!userId && req.isAuthenticated()) {
            userId = (req.user as User).id;
          }

          if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
          }

          // Find the user in the database
          const user = await storage.getUserById(userId);
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          // Remove the resumeUrl
          user.resumeUrl = null; // Set resumeUrl to null or use delete operator
          await user.save(); // Save changes to the database

          return res.status(200).json({ success: true, message: "Resume URL deleted successfully" });
        } catch (error) {
          console.error('Error removing resume URL:', error);
          return res.status(500).json({ error: "Internal server error" });
        }
      });

    // Current user API route (supports both session and JWT)
// Current user API route (supports both session and JWT)
app.get("/api/user", async (req: Request, res: Response) => {
    try {
        let userId: number | null = null;

        // First check for JWT token
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
                userId = decoded.user.id;
            } catch (error) {
                console.log("JWT verification failed, falling back to session check");
            }
        }

        // If no valid JWT, check session authentication
        if (!userId && req.isAuthenticated()) {
            userId = (req.user as User).id;
        }

        if (!userId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

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
            // First check session authentication
            if (req.isAuthenticated() && req.user) {
                const userId = (req.user as User).id;

                // Get admin user
                const adminUser = await db.query.adminUsers.findFirst({
                    where: eq(adminUsers.id, userId)
                });

                if (!adminUser || adminUser.role !== 'admin') {
                    return res.status(403).json({ error: "Not an admin user" });
                }

                // Update session activity
                req.session.lastActivity = new Date();
                await new Promise<void>((resolve, reject) => {
                    req.session.save((err) => {
                        if (err) {
                            console.error("Session save error:", err);
                            reject(err);
                        }
                        resolve();
                    });
                });
                return next();
            }

            // If session check fails, try JWT
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                try {
                    const decoded = jwt.verify(token, JWT_SECRET) as { user: AdminUser };
                    req.user = decoded.user;
                    return next();
                } catch (error) {
                    console.log("JWT verification failed");
                }
            }

            return res.status(401).json({ error: "Not authenticated" });
        } catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
}