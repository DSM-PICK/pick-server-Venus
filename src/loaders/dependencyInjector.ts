import { Container } from "typedi";
import logger from "./logger";

export default ({ repositories }: { repositories: object }) => {
  Object.keys(repositories).forEach((key) =>
    Container.set(key, new repositories[key]())
  );
  Container.set("logger", logger);
};
