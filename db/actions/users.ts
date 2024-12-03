import { db } from "../drizze";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { withRetry } from "../utils";

export async function getOrCreateUser(email: string) {
    return withRetry(async () => {
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if (existingUser.length > 0) {
            return existingUser[0];
        }

        const newUser = await db
            .insert(users)
            .values({
                id: crypto.randomUUID(),
                email: email,
                createdAt: new Date(),
            })
            .returning();

        return newUser[0];
    });
} 