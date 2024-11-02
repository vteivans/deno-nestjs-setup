import { ConsoleLogger, LogLevel } from "@nestjs/common";

export class DenoConsoleLogger extends ConsoleLogger {
    // override error(...args: unknown[]): void {
    //     console.error(args);
    // }
    protected override printMessages(
        messages: unknown[],
        context: string = "",
        logLevel: LogLevel = "log",
        writeStreamType?: "stdout" | "stderr",
    ): void {
        super.printMessages(["Printing"]);
        messages.forEach((message) => {
            const pidMessage = this.formatPid(Deno.pid);
            const contextMessage = this.formatContext(context);
            const timestampDiff = this.updateAndGetTimestampDiff();
            const formattedLogLevel = logLevel.toUpperCase().padStart(7, " ");
            const formattedMessage = this.formatMessage(
                logLevel,
                message,
                pidMessage,
                formattedLogLevel,
                contextMessage,
                timestampDiff,
            );
            const encoder = new TextEncoder();
            Deno[writeStreamType ?? "stdout"].writeSync(
                encoder.encode(formattedMessage),
            );
        });
    }
}
