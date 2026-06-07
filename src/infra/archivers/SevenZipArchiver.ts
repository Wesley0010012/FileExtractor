import Seven from 'node-7z'
import { Archiver } from '../../core/protocols/Archiver'
import { FileService } from '../../core/protocols/FileService'
import { ArchiverError } from '../../core/errors/ArchiverError'

export class SevenZipArchiver implements Archiver {

    constructor(private readonly fileService: FileService) {}

    async extract(input: string, output: string): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                const stream = Seven.extractFull(input, output)

                stream.on('end', resolve)
                stream.on('error', reject)
            })
        } catch (err) {
            throw new ArchiverError('7Z', 'extract', input, err)
        }
    }

    async compress(input: string, output: string): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                const stream = Seven.add(output, input)

                stream.on('end', resolve)
                stream.on('error', reject)
            })
        } catch (err) {
            throw new ArchiverError('7Z', 'compress', input, err)
        }
    }

    async seeInside(input: string): Promise<string[]> {
        try {
            const files: string[] = []

            await new Promise<void>((resolve, reject) => {
                const stream = Seven.list(input)

                stream.on('data', (d: { file?: string }) => {
                    if (d.file) files.push(d.file)
                })
                stream.on('end', resolve)
                stream.on('error', reject)
            })

            return files
        } catch (err) {
            throw new ArchiverError('7Z', 'inspect', input, err)
        }
    }
}
