import { AppError } from './AppError'

export class ArchiverError extends AppError {
    constructor(
        format: string,
        operation: string,
        input: string,
        cause?: unknown,
        code = 'ARCHIVER_OPERATION_FAILED'
    ) {
        super(
            code,
            `${format} ${operation} failed for: ${input}`,
            cause
        )
    }

    static unsupportedOperation(format: string, operation: string): ArchiverError {
        return new ArchiverError(
            format,
            operation,
            'operation is not supported by the current implementation',
            undefined,
            'ARCHIVER_OPERATION_UNSUPPORTED'
        )
    }
}
