import { AppError } from './AppError'

export class FileSystemError extends AppError {
    static readFailed(path: string, cause?: unknown): FileSystemError {
        return new FileSystemError(
            'FILE_READ_FAILED',
            `Failed to read file: ${path}`,
            cause
        )
    }

    static writeFailed(path: string, cause?: unknown): FileSystemError {
        return new FileSystemError(
            'FILE_WRITE_FAILED',
            `Failed to write file: ${path}`,
            cause
        )
    }

    static createDirectoryFailed(path: string, cause?: unknown): FileSystemError {
        return new FileSystemError(
            'DIRECTORY_CREATE_FAILED',
            `Failed to create directory: ${path}`,
            cause
        )
    }

    static listDirectoryFailed(path: string, cause?: unknown): FileSystemError {
        return new FileSystemError(
            'DIRECTORY_LIST_FAILED',
            `Failed to list directory: ${path}`,
            cause
        )
    }

    static removeFailed(path: string, cause?: unknown): FileSystemError {
        return new FileSystemError(
            'PATH_REMOVE_FAILED',
            `Failed to remove path: ${path}`,
            cause
        )
    }
}
