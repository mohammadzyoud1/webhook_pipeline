import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWTsecret = process.env.JWT_SECRET || "";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Toekn required" });
    }

    try {
        const decoded = jwt.verify(token, JWTsecret) as any;

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}