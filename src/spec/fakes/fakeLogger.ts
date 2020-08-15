import ILogger from "../../interfaces/loggerInterface";

const fakeLogger: ILogger = {
  info(message: string) {},
  warning(message: string) {},
  error(message: string) {},
  emerg(message: string) {},
  debug(message: string) {},
  alert(message: string) {},
  crit(message: string) {},
};

export default fakeLogger;
