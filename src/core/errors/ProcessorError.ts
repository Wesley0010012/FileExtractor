import { AppError } from './AppError'

export class ProcessorError extends AppError {
    static inputNotFound(path: string): ProcessorError {
        return new ProcessorError(
            'INPUT_NOT_FOUND',
            `Input path not found: ${path}. Check the path and try again.`
        )
    }

    static inputPermissionDenied(path: string): ProcessorError {
        return new ProcessorError(
            'INPUT_PERMISSION_DENIED',
            `Cannot access input path: ${path}. Check read/write permissions.`
        )
    }

    static outputCreateFailed(path: string): ProcessorError {
        return new ProcessorError(
            'OUTPUT_CREATE_FAILED',
            `Cannot prepare output path: ${path}. Check the parent directory and permissions.`
        )
    }

    static outputMustBeFile(path: string): ProcessorError {
        return new ProcessorError(
            'OUTPUT_MUST_BE_FILE',
            `Compression output must be a file path, but this path is a directory: ${path}. Choose a filename like archive.zip.`
        )
    }

    static uniqueOutputFailed(path: string): ProcessorError {
        return new ProcessorError(
            'UNIQUE_OUTPUT_FAILED',
            `Cannot generate a unique extraction directory for: ${path}. Try a different output path.`
        )
    }
}
