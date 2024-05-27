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
}
