import { Prisma } from "@prisma/client";
import winston from "winston";

export class Logger {
  private static instance: winston.Logger;

  private static init(): winston.Logger {
    if (!Logger.instance) {
      Logger.instance = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        transports: [
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
          }),
          new winston.transports.File({
            filename: "logs/combined.log",
            level: "info",
          }),
        ],
      });

      if (process.env.NODE_ENV !== "production") {
        Logger.instance.configure({ level: "debug" });
        Logger.instance.add(
          new winston.transports.Console({
            format: winston.format.simple(),
          })
        );
      }
    }

    return Logger.instance;
  }

  public static debug(message: any) {
    Logger.init().debug(message);
  }

  public static error(service: string, message: string, error?: any) {
    if (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        Logger.init().error(message, {
          service,
          code: error.code,
          errorMsg: error.message,
        });
        return;
      } else if (error instanceof Error) {
        Logger.init().error(message, { service, errorMsg: error.message });
        return;
      }
    }

    Logger.init().error(message, { service });
  }

  public static info(service: string, message?: any) {
    if (typeof message === "string") {
      Logger.init().info(message, { service });
    } else {
      Logger.init().info({
        service,
        ...message,
      });
    }
  }
}
