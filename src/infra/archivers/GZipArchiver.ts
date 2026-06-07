import path from 'path'
import zlib from 'zlib'
import { Archiver } from '../../core/protocols/Archiver'
import { FileService } from '../../core/protocols/FileService'
import { ArchiverError } from '../../core/errors/ArchiverError'

export class GzipArchiver implements Archiver {

    constructor(private readonly fileService: FileService) {}

    async extract(input: string, output: string): Promise<void> {
        try {
            const read = this.fileService.createReadStream(input)
            const write = this.fileService.createWriteStream(
                path.join(output, this.outputFilename(input))
            )

            await this.pipe(read, zlib.createGunzip(), write)

        } catch (err) {
            throw new ArchiverError('GZIP', 'extract', input, err)
        }
    }

    async compress(input: string, output: string): Promise<void> {
        try {
            const read = this.fileService.createReadStream(input)
            const write = this.fileService.createWriteStream(output)

            await this.pipe(read, zlib.createGzip(), write)

        } catch (err) {
            throw new ArchiverError('GZIP', 'compress', input, err)
        }
    }

    async seeInside(input: string): Promise<string[]> {
        return [this.outputFilename(input)]
    }

    private outputFilename(input: string): string {
        const filename = path.basename(input)

        return filename.endsWith('.gz')
            ? filename.slice(0, -3)
            : `${filename}.out`
    }

    private pipe(
        input: NodeJS.ReadableStream,
        transform: NodeJS.ReadWriteStream,
        output: NodeJS.WritableStream
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            input.pipe(transform).pipe(output)
                .on('finish', resolve)
                .on('error', reject)
        })
    }
}
