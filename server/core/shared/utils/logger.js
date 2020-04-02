const winston = require('winston');

const dateFormat = () => new Date(Date.now()).toUTCString();
class LoggerService {
  constructor(route) {
    this.log_data = null;
    this.route = route;
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `./logs/${route}.log`,
        }),
      ],
      format: winston.format.printf(info => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `;
        message = info.obj ? `${message}data:${JSON.stringify(info.obj)} | ` : message;
        message = this.log_data ? `${message}log_data:${JSON.stringify(this.log_data)} | ` : message;
        return message;
      }),
    });
    this.logger = logger;
  }

  setLogData(logData) {
    this.log_data = logData;
  }

  async info(message, obj) {
    this.logger.log('info', message, {
      obj,
    });
  }

  async debug(message, obj) {
    this.logger.log('debug', message, {
      obj,
    });
  }

  async error(message, obj) {
    this.logger.log('error', message, {
      obj,
    });
  }
}
module.exports = LoggerService;
