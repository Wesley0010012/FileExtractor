import { AppError } from './AppError'

export class CliError extends AppError {
    static unknownCommand(command: string): CliError {
        return new CliError(
            'UNKNOWN_COMMAND',
            `Unknown command: ${command}`
        )
    }
}
