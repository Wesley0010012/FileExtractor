import * as tar from 'tar'
import { Archiver } from '../../core/protocols/Archiver'
import { FileService } from '../../core/protocols/FileService'
import { ArchiverError } from '../../core/errors/ArchiverError'

export class TarArchiver implements Archiver {

    constructor(private readonly fileService: FileService) {}

    async extract(input: string, output: string): Promise<void> {
        try {
            await tar.extract({
                file: input,
                cwd: output
            })
        } catch (err) {
            throw new ArchiverError('TAR', 'extract', input, err)
        }
    }

    async compress(input: string, output: string): Promise<void> {
        try {
            await tar.create({
                file: output,
                cwd: input
            }, ['.'])
        } catch (err) {
            throw new ArchiverError('TAR', 'compress', input, err)
        }
    }

    async seeInside(input: string): Promise<string[]> {
        try {
            const files: string[] = []

            await tar.t({
                file: input,
                onentry: entry => files.push(entry.path)
            })

            return files
        } catch (err) {
            throw new ArchiverError('TAR', 'inspect', input, err)
        }
    }
}
