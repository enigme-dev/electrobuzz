import winston from "winston";

export class Logger {
  private static instance: winston.Logger;

  public static init(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: { service: "user-service" },
        transports: [
          new winston.transports.File({
            filename: "error.log",
            level: "error",
          }),
          new winston.transports.File({ filename: "combined.log" }),
        ],
      });

      if (process.env.NODE_ENV !== "production") {
        Logger.instance.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          })
        );
      }
    }

    return Logger.instance;
  }
}
