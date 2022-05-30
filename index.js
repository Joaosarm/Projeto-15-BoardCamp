import express, {json} from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./src/routes/categoriesRouter.js";
import gamesRouter from "./src/routes/gamesRouter.js";
import customersRouter from "./src/routes/customersRouter.js";
import rentalsRouter from "./src/routes/rentalsRouter.js";

const app = express();
app.use(cors());
app.use(json());
dotenv.config();

// routes
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));