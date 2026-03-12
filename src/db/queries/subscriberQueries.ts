import { d_base } from "../../index.js";
import { subscribers } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createSubscriber(name: string, pipeline_id: string, url: string) {


    const result = await d_base.insert(subscribers).values({
        name: name,
        pipeline_id: pipeline_id,
        url: url
    }).returning();

    return (result[0]);
}
export async function getSubscribers(name?: string) {
    if (name) {
        const result = await d_base.select().from(subscribers).where(eq(subscribers.name, name));
        if (result.length === 0) {
            throw new Error("Subscriber not found");
        }
        return result;
    }
    else {
        const result = await d_base.select().from(subscribers);
        return result;
    }
}

export async function deleteSubscriber(name: string) {

    const result = await d_base.delete(subscribers).where(eq(subscribers.name, name)).returning();;
    return result;

}
