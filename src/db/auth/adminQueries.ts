import { d_base } from "../../index.js";
import { admins } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createAdmin(email: string, hashed_password: string) {
    const result = await d_base.insert(admins).values({
        email,
        hashed_password
    }).returning().onConflictDoNothing();
    return result[0];
}

export async function getAdminByEmail(email: string) {
    const result = await d_base.select().from(admins).where(eq(admins.email, email));
    return result[0];
}