"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sprintf_js_1 = require("sprintf-js");
var style = require('ansi-styles');
var LoggerBase = (function () {
    function LoggerBase(levels) {
        this.levels = levels || { error: 100, warn: 80, info: 50, debug: 20 };
    }
    LoggerBase.prototype.log = function (level, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var meta = null;
        var msg = message;
        if (typeof message == 'object') {
            meta = message;
            msg = args.shift();
        }
        this._log.apply(this, [level, meta, msg].concat(args));
    };
    LoggerBase.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, ['debug', message].concat(args));
    };
    LoggerBase.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, ['info', message].concat(args));
    };
    LoggerBase.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, ['warn', message].concat(args));
    };
    LoggerBase.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.log.apply(this, ['error', message].concat(args));
    };
    return LoggerBase;
}());
exports.LoggerBase = LoggerBase;
var ConsoleLogger = (function (_super) {
    __extends(ConsoleLogger, _super);
    function ConsoleLogger(colorize, levels) {
        if (colorize === void 0) { colorize = false; }
        var _this = _super.call(this, levels) || this;
        _this.colors = {
            'error': { level: { open: style.bgRed.open, close: style.bgRed.close }, message: style.redBright },
            'warn': { level: style.yellow, message: style.whiteBright },
            'info': { level: style.green },
            'debug': { level: style.cyan, message: style.grey },
            '*': { meta: style.grey }
        };
        _this.colorize = colorize;
        return _this;
    }
    ConsoleLogger.prototype._log = function (level, meta, message) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        if (this.colorize) {
            var levelColor = this.colors[level].level || this.colors['*'].level || { open: "", close: "" };
            var messageColor = this.colors[level].message || this.colors['*'].message || { open: "", close: "" };
            var metaColor = this.colors[level].meta || this.colors['*'].meta || { open: "", close: "" };
            if (args.length == 0)
                console.log(sprintf_js_1.sprintf("[%s%-5s%s] %s%s%s", levelColor.open, level, levelColor.close, messageColor.open, message, messageColor.close));
            else
                console.log(sprintf_js_1.sprintf.apply(void 0, ["[%s%-5s%s] %s" + message, levelColor.open, level, levelColor.close, messageColor.open].concat(args)) + messageColor.close);
            if (meta != null)
                console.log(sprintf_js_1.sprintf("  %s%j%s", metaColor.open, meta, metaColor.close));
        }
        else {
            if (args.length == 0)
                console.log(sprintf_js_1.sprintf("[%-5s] %s", level, message));
            else
                console.log(sprintf_js_1.sprintf.apply(void 0, ["[%-5s] " + message, level].concat(args)));
            if (meta != null)
                console.log(sprintf_js_1.sprintf("  %j", meta));
        }
    };
    return ConsoleLogger;
}(LoggerBase));
exports.ConsoleLogger = ConsoleLogger;
var NullLogger = (function (_super) {
    __extends(NullLogger, _super);
    function NullLogger(levels) {
        return _super.call(this, levels) || this;
    }
    NullLogger.prototype._log = function (level, meta, message) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
    };
    return NullLogger;
}(LoggerBase));
exports.NullLogger = NullLogger;
var PrefixedLogger = (function (_super) {
    __extends(PrefixedLogger, _super);
    function PrefixedLogger(prefix, output) {
        var _this = _super.call(this) || this;
        _this.prefix = prefix;
        _this.output = output;
        return _this;
    }
    PrefixedLogger.prototype._log = function (level, meta, message) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        (_a = this.output).log.apply(_a, [level, meta, (message == null) ? this.prefix : this.prefix + message].concat(args));
        var _a;
    };
    return PrefixedLogger;
}(LoggerBase));
exports.PrefixedLogger = PrefixedLogger;
//# sourceMappingURL=index.js.map