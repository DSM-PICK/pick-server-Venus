import * as awsServerlessExpress from "aws-serverless-express";
import * as awsServerlessExpressMiddleware from "aws-serverless-express/middleware";
import app from "./app";

app.use(awsServerlessExpressMiddleware.eventContext());
const server = awsServerlessExpress.createServer(app, null);
export const handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
