import { d_base } from "../../index.js";
import { pipelines } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createPipeline(name: string, source_path: string, action_type: string) {


    const result = await d_base.insert(pipelines).values({
        name: name,
        source_path: source_path,
        action_type: action_type
    }).returning();

    return (result[0]);
}
export async function getPipeLines(name?: string) {
    if (name) {
        const result = await d_base.select().from(pipelines).where(eq(pipelines.name, name));
        if (result.length === 0) {
            throw new Error("Pipeline not found");
        }
        return result;
    }
    else {
        const result = await d_base.select().from(pipelines);
        return result;
    }

}
export async function deletePipeline(name: string) {

    const result = await d_base.delete(pipelines).where(eq(pipelines.name, name)).returning();;
    return result;

}
export async function getPipeLineBySourcePath(source_path: string) {
    const result = await d_base.select().from(pipelines).where(eq(pipelines.source_path, source_path));
    return result;
}
