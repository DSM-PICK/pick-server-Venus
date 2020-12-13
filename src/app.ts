import "reflect-metadata";
import * as express from "express";

import init from "./loaders";

const app = express();

init(app);

export default app;
