import * as winston from 'winston';

const Logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
    ),
});

export default Logger;