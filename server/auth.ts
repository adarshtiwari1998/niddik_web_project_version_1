import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from 'jsonwebtoken';
import { storage } from "./storage";
import { User, InsertUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

// JWT Secret key
const JWT_SECRET = process.env.JWT_SECRET || 'niddik-jwt-secret';

// Function to generate JWT token for a user
const generateToken = (user: User) => {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
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
    interface User extends User {}
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
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
        // Check if the input is an email rather than a username
        const isEmail = username.includes('@');
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: 'Invalid credentials' });
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Register API route
  app.post("/api/register", async (req, res, next) => {
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

  // Login API route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info.message || "Invalid credentials" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        
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
  app.post("/api/logout", async (req, res, next) => {
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

  // Current user API route (supports both session and JWT)
  app.get("/api/user", (req, res) => {
    // First check for JWT token
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token
      const token = authHeader.substring(7);
      
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
        
        // Return user without password
        const { password, ...userWithoutPassword } = decoded.user;
        return res.json(userWithoutPassword);
      } catch (error) {
        // If JWT verification fails, continue to session check
        console.log("JWT verification failed, falling back to session check");
      }
    }
    
    // If no token or token verification failed, check session authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Middleware to check if user is authenticated (supports both session and JWT)
  app.use("/api/admin", (req, res, next) => {
    // First check for JWT token
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract token
      const token = authHeader.substring(7);
      
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { user: User };
        
        // Check if user is admin
        if (decoded.user.role !== "admin") {
          return res.status(403).json({ error: "Not authorized" });
        }
        
        // Attach user to request
        req.user = decoded.user;
        return next();
      } catch (error) {
        // If JWT verification fails, continue to session check
        console.log("JWT verification failed, falling back to session check");
      }
    }
    
    // If no token or token verification failed, check session authentication
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = req.user as User;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    next();
  });
}