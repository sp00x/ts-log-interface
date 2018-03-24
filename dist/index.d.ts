export interface ILogger {
    log(level: string, meta: object): void;
    log(level: string, meta: object, message: string, ...args: any[]): void;
    log(level: string, message: string, ...args: any[]): void;
    log(level: string, message: string | object, ...args: any[]): void;
    debug(meta: object): void;
    debug(meta: object, message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    debug(message: string | object, ...args: any[]): void;
    info(meta: object): void;
    info(meta: object, message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    info(message: string | object, ...args: any[]): void;
    warn(meta: object): void;
    warn(meta: object, message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    warn(message: string | object, ...args: any[]): void;
    error(meta: object): void;
    error(meta: object, message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    error(message: string | object, ...args: any[]): void;
}
export declare type LogLevelsMap = {
    [level: string]: number;
};
export declare abstract class LoggerBase implements ILogger {
    protected abstract _log(level: string, meta: object, message: string, ...args: any[]): void;
    levels: LogLevelsMap;
    constructor(levels?: LogLevelsMap);
    log(level: string, message: string | object, ...args: any[]): void;
    debug(message: string | object, ...args: any[]): void;
    info(message: string | object, ...args: any[]): void;
    warn(message: string | object, ...args: any[]): void;
    error(message: string | object, ...args: any[]): void;
}
export declare class ConsoleLogger extends LoggerBase {
    colorize: boolean;
    colors: {
        [level: string]: any;
    };
    constructor(colorize?: boolean, levels?: LogLevelsMap);
    _log(level: string, meta: object, message: string, ...args: any[]): void;
}
export declare class NullLogger extends LoggerBase {
    constructor(levels?: LogLevelsMap);
    _log(level: string, meta: object, message: string, ...args: any[]): void;
}
export declare class PrefixedLogger extends LoggerBase {
    prefix: string;
    output: ILogger;
    constructor(prefix: string, output: ILogger);
    _log(level: string, meta: object, message: string, ...args: any[]): void;
}
