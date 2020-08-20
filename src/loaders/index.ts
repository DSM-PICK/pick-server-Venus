import * as express from "express";
import expressLoader from "./express";
import connectDatabase from "./connectMysql";

export default async (app: express.Application) => {
  await connectDatabase();
  expressLoader({ app });
};
