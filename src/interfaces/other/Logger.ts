export default interface Logger {
  info(message: string);
  error(message: string);
  emerg(message: string);
  alert(message: string);
  crit(message: string);
  warning(message: string);
  debug(message: string);
}
