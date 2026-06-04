import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import cron from "node-cron";
import { sendEventReminders } from "./services/eventReminders.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// All feature routers live under /api (see routes/index.js).
app.use('/api', apiRouter);

cron.schedule("*/5 * * * *", async () => {
  console.log("Checking for event reminders!!!");
  await sendEventReminders();

});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
