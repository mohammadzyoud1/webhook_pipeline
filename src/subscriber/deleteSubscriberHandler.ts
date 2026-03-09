import { Request, Response } from "express";
import { deleteSubscriber } from "../db/queries/subscriberQueries.js";
export async function deleteSubscriberHandler(req: Request, res: Response) {
    const name = req.params.name as string
    try {
        const result = await deleteSubscriber(name);
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "subscriber not found" });
        }
        return res.status(200).json({ message: `subscriber ${name} deleted` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete subscriber" });
    }
}