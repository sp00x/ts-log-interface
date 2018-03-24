import { sprintf } from 'sprintf-js';
const style = require('ansi-styles'); // https://github.com/chalk/ansi-styles

export interface ILogger
{
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

export type LogLevelsMap = {[level: string]: number};

export abstract class LoggerBase implements ILogger
{
    protected abstract _log(level: string, meta: object, message: string, ...args: any[]): void;
    levels: LogLevelsMap;

    constructor(levels?: LogLevelsMap)
    {
        this.levels = levels || { error: 100, warn: 80, info: 50, debug: 20 }
    }

    log(level: string, message: string | object, ...args: any[]): void
    {
        let meta: object = null;
        let msg: string = <string>message;
        if (typeof message == 'object')
        {
            meta = message;
            msg = args.shift();
        }
        this._log(level, meta, msg, ...args);
    }

    debug(message: string | object, ...args: any[]): void
    {
        this.log('debug', message, ...args);
    }

    info(message: string | object, ...args: any[]): void
    {
        this.log('info', message, ...args);
    }

    warn(message: string | object, ...args: any[]): void
    {
        this.log('warn', message, ...args);
    }

    error(message: string | object, ...args: any[]): void
    {
        this.log('error', message, ...args);
    }
}

export class ConsoleLogger extends LoggerBase
{
    colorize: boolean;

    colors: {[level: string]: any} = {
        'error': { level: { open: style.bgRed.open, close: style.bgRed.close }, message: style.redBright },
        'warn': { level: style.yellow, message: style.whiteBright },
        'info': { level: style.green },
        'debug': { level: style.cyan, message: style.grey },
        '*': { meta: style.grey } // fallback
    }

    constructor(colorize: boolean = false, levels?: LogLevelsMap)
    {
        super(levels);
        this.colorize = colorize;
    }

    _log(level: string, meta: object, message: string, ...args: any[]): void
    {
        if (this.colorize)
        {
            let levelColor: any = this.colors[level].level || this.colors['*'].level || { open: "", close: "" };
            let messageColor: any = this.colors[level].message || this.colors['*'].message || { open: "", close: "" };
            let metaColor: any = this.colors[level].meta || this.colors['*'].meta || { open: "", close: "" };
            
            if (args.length == 0) console.log(sprintf("[%s%-5s%s] %s%s%s", levelColor.open, level, levelColor.close, messageColor.open, message, messageColor.close));
            else console.log(sprintf("[%s%-5s%s] %s" + message, levelColor.open, level, levelColor.close, messageColor.open, ...args) + messageColor.close);
            if (meta != null) console.log(sprintf("  %s%j%s", metaColor.open, meta, metaColor.close));
        }
        else
        {
            if (args.length == 0) console.log(sprintf("[%-5s] %s", level, message));
            else console.log(sprintf("[%-5s] " + message, level, ...args));
            if (meta != null) console.log(sprintf("  %j", meta));            
        }
    }
}

export class NullLogger extends LoggerBase
{
    constructor(levels?: LogLevelsMap)
    {
        super(levels);
    }

    _log(level: string, meta: object, message: string, ...args: any[]): void
    {
        // nope.
    }    
}

export class PrefixedLogger extends LoggerBase
{
    prefix: string;
    output: ILogger;

    constructor(prefix: string, output: ILogger)
    {
        super(); // really not a logger but a shell around it
        this.prefix = prefix;
        this.output = output;
    }

    _log(level: string, meta: object, message: string, ...args: any[]): void
    {
        this.output.log(level, meta, (message == null) ? this.prefix : this.prefix + message, ...args);
    }
}