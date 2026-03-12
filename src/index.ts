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
import { getJobByIDHandler, webhookHandler } from './webhook/webhookHandler.js'
import { registerHandler } from './auth/registerHandler.js';
import { loginHandler } from './auth/loginHandler.js';
import { adminMiddleware } from './auth/authMiddleware.js';
const conn = postgres(db.db_url);
export const d_base = drizzle(conn, { schema });
const app = express();
const PORT = 8080;

app.use(express.json());

app.post("/createpipeline", adminMiddleware, createPipelineHandler);
app.post("/createSubscriber", adminMiddleware, createSubscriberHandler);
app.post("/webhook/:source_path", webhookHandler);
app.post("/auth/register", registerHandler);
app.post("/auth/login", loginHandler);
app.get("/pipelines", getPipeLinesHandler)
app.get("/pipelines/:name", getPipeLinesHandler)
app.get("/subscribers", getSubscribersHandler)
app.get("/subscribers/:name", getSubscribersHandler)
app.get("/jobs/:id", getJobByIDHandler)



app.delete("/pipelines/:name", adminMiddleware, deletePipelineHandler);
app.delete("/subscribers/:name", adminMiddleware, deleteSubscriberHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
