import * as express from "express";
import expressLoader from "./express";
import dependencyInjector from "./dependencyInjector";
import databaseConnect from "./database";

export default async (app: express.Application) => {
  dependencyInjector({ repositories: require("../repositories") });
  await databaseConnect();
  expressLoader({ app });
};
