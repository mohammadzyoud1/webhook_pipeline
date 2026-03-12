import { Request, Response } from "express";
import argon2 from "argon2";
import { createAdmin } from "../db/auth/adminQueries.js";

export async function registerHandler(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const hashedPassword = await argon2.hash(password);
        const user = await createAdmin(email, hashedPassword);
        return res.status(201).json({ message: "Admin created", id: user.id, email: user.email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to register" });
    }
}