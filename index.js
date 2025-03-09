import dotenv from "dotenv";
import { startCronJobs } from "./src/utils/CRON/cron-jobs.js";
import {bootstrap} from "./app.controller.js";
import express from "express";
import {connectDB} from "./src/DB/db.connection.js";
const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT || 3000;
bootstrap(app,express)
connectDB()
startCronJobs();


app.listen(port, () => console.log(`Listening on port ${port}`));

