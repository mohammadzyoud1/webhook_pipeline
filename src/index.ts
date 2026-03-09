import express from 'express';
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { db } from "./config.js";
import * as schema from "./db/schema.js";
import { createPipelineHandler } from './pipeLine/createPipelineHandler.js';
import { getPipeLinesHandler } from './pipeLine/getPipeLinesHandler.js';
import { deletePipelineHandler } from './pipeLine/deletepipeLineHandler.js';
import { createSubscriberHandler } from './subscriber/createSubscriberHandler.js';
import { getSubscribersHandler } from './subscriber/getSubscribersHandler.js'
import { deleteSubscriberHandler } from './subscriber/deleteSubscriberHandler.js'
import { webhookHandler } from './webhook/webhookHandler.js'
const conn = postgres(db.db_url);
export const d_base = drizzle(conn, { schema });
const app = express();
const PORT = 8080;

app.use(express.json());

app.post("/createpipeline", createPipelineHandler);
app.post("/createSubscriber", createSubscriberHandler);
app.post("/webhook/:source_path", webhookHandler);

app.get("/pipelines", getPipeLinesHandler)
app.get("/pipelines/:name", getPipeLinesHandler)
app.get("/subscribers", getSubscribersHandler)
app.get("/subscribers/:name", getSubscribersHandler)




app.delete("/pipelines/:name", deletePipelineHandler);
app.delete("/pipelines/:name", deleteSubscriberHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
