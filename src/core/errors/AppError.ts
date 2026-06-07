export class AppError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        cause?: unknown
    ) {
        super(message)
        this.name = new.target.name

        if (cause !== undefined) {
            this.cause = cause
        }
    }
}
