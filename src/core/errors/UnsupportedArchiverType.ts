import { AppError } from './AppError'

export class UnsupportedArchiverType extends AppError {
    constructor(type: string) {
        super('UNSUPPORTED_ARCHIVER_TYPE', `Unsupported archiver type: ${type}`)
    }
}
