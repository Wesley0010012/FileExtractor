import JSZip from 'jszip'
import path from 'path'
import { ArchiverError } from '../../core/errors/ArchiverError'
import { Archiver } from '../../core/protocols/Archiver'
import { FileService } from '../../core/protocols/FileService'

export class ZipArchiver implements Archiver {

    constructor(private readonly fileService: FileService) {}

    async extract(input: string, output: string): Promise<void> {
        try {
            const zip = new JSZip()

            const buffer = await this.fileService.readFile(input)
            const content = await zip.loadAsync(buffer)

            await this.fileService.createDir(output)

            for (const filename of Object.keys(content.files)) {
                const file = content.files[filename]

                if (!file.dir) {
                    const data = await file.async('nodebuffer')
                    const outPath = `${output}/${filename}`

                    await this.fileService.writeFile(outPath, data)
                }
            }
        } catch (err) {
            throw new ArchiverError('ZIP', 'extract', input, err)
        }
    }

    async compress(input: string, output: string): Promise<void> {
        try {
            const zip = new JSZip()

            await this.addFiles(zip, input, input)

            const buffer = await zip.generateAsync({ type: 'nodebuffer' })
            await this.fileService.writeFile(output, buffer)
        } catch (err) {
            throw new ArchiverError('ZIP', 'compress', input, err)
        }
    }

    async seeInside(input: string): Promise<string[]> {
        try {
            const zip = new JSZip()

            const buffer = await this.fileService.readFile(input)
            const content = await zip.loadAsync(buffer)

            return Object.keys(content.files)
        } catch (err) {
            throw new ArchiverError('ZIP', 'inspect', input, err)
        }
    }

    private async addFiles(
        zip: JSZip,
        rootPath: string,
        currentPath: string
    ): Promise<void> {
        const entries = await this.fileService.listDir(currentPath)

        for (const entry of entries) {
            const entryPath = path.join(currentPath, entry)
            const relativePath = path
                .relative(rootPath, entryPath)
                .split(path.sep)
                .join('/')

            if (await this.fileService.isDirectory(entryPath)) {
                zip.folder(relativePath)
                await this.addFiles(zip, rootPath, entryPath)
                continue
            }

            const data = await this.fileService.readFile(entryPath)
            zip.file(relativePath, data)
        }
    }
}
