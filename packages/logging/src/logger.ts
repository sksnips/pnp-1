import { LogLevel } from "./loglevel";
import { LogListener } from "./listeners";
import { LogEntry } from "./logentry";

/**
 * Class used to subscribe ILogListener and log messages throughout an application
 *
 */
export class Logger {

    private static _instance: LoggerImpl;

    /**
     * Gets or sets the active log level to apply for log filtering
     */
    public static get activeLogLevel(): LogLevel {
        return Logger.instance.activeLogLevel;
    }

    public static set activeLogLevel(value: LogLevel) {
        Logger.instance.activeLogLevel = value;
    }

    private static get instance(): LoggerImpl {
        if (typeof Logger._instance === "undefined" || Logger._instance === null) {
            Logger._instance = new LoggerImpl();
        }
        return Logger._instance;
    }

    /**
     * Adds ILogListener instances to the set of subscribed listeners
     *
     * @param listeners One or more listeners to subscribe to this log
     */
    public static subscribe(...listeners: LogListener[]): void {
        listeners.map(listener => Logger.instance.subscribe(listener));
    }

    /**
     * Clears the subscribers collection, returning the collection before modifiction
     */
    public static clearSubscribers(): LogListener[] {
        return Logger.instance.clearSubscribers();
    }

    /**
     * Gets the current subscriber count
     */
    public static get count(): number {
        return Logger.instance.count;
    }

    /**
     * Writes the supplied string to the subscribed listeners
     *
     * @param message The message to write
     * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
     */
    public static write(message: string, level: LogLevel = LogLevel.Verbose) {
        Logger.instance.log({ level: level, message: message });
    }

    /**
     * Writes the supplied string to the subscribed listeners
     *
     * @param json The json object to stringify and write
     * @param level [Optional] if supplied will be used as the level of the entry (Default: LogLevel.Verbose)
     */
    public static writeJSON(json: any, level: LogLevel = LogLevel.Verbose) {
        Logger.instance.log({ level: level, message: JSON.stringify(json) });
    }

    /**
     * Logs the supplied entry to the subscribed listeners
     *
     * @param entry The message to log
     */
    public static log(entry: LogEntry) {
        Logger.instance.log(entry);
    }
}

class LoggerImpl {

    constructor(public activeLogLevel: LogLevel = LogLevel.Warning, private subscribers: LogListener[] = []) { }

    public subscribe(listener: LogListener): void {
        this.subscribers.push(listener);
    }

    public clearSubscribers(): LogListener[] {
        const s = this.subscribers.slice(0);
        this.subscribers.length = 0;
        return s;
    }

    public get count(): number {
        return this.subscribers.length;
    }

    public write(message: string, level: LogLevel = LogLevel.Verbose) {
        this.log({ level: level, message: message });
    }

    public log(entry: LogEntry) {
        if (typeof entry !== "undefined" && this.activeLogLevel <= entry.level) {
            this.subscribers.map(subscriber => subscriber.log(entry));
        }
    }
}
