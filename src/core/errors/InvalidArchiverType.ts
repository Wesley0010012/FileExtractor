import { AppError } from './AppError'

export class InvalidArchiverType extends AppError {
    public constructor(type: string) {
        super('INVALID_ARCHIVER_TYPE', `Invalid archiver type: ${type}`)
    }
}
