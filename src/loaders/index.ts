import * as express from "express";
import expressLoader from "./express";
import connectDatabase from "./database";

export default async (app: express.Application) => {
  await connectDatabase();
  expressLoader({ app });
};
