import { Request, Response } from "express";
import argon2 from "argon2";
import { getAdminByEmail } from "../db/auth/adminQueries.js";
import jwt from "jsonwebtoken";

export async function loginHandler(req: Request, res: Response) {
    const JWTsecret = process.env.JWT_SECRET || "";
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const admin = await getAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const passwordValidation = await argon2.verify(admin.hashed_password, password);

        if (!passwordValidation) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            JWTsecret,
            { expiresIn: "24h" }
        );
        return res.status(200).json({ token });


    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to login" });

    }
}