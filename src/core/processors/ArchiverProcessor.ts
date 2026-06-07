import { ArchiverType, fromString } from '../enums/ArchiverType'
import { Archiver } from '../protocols/Archiver'
import { ArchiverFactory } from '../protocols/ArchiverFactory'
import { ProcessorError } from '../errors/ProcessorError'
import { FileService } from '../protocols/FileService'
import { HashGenerator } from '../protocols/HashGenerator'
import { Printer } from '../protocols/Printer'

export class ArchiverProcessor {
    constructor(
        private readonly archiverFactory: ArchiverFactory,
        private readonly printer: Printer,
        private readonly fileService: FileService,
        private readonly hashGenerator: HashGenerator
    ) {}

    private getArchiver(type: ArchiverType): Archiver {
        return this.archiverFactory.generate(type)
    }

    private async verifyInput(input: string): Promise<void> {
        const exists = await this.fileService.exists(input)

        if (!exists) {
            throw ProcessorError.inputNotFound(input)
        }

        const hasPermission = await this.fileService.havePermissions(input)

        if (!hasPermission) {
            throw ProcessorError.inputPermissionDenied(input)
        }
    }

    private async verifyOutput(output: string): Promise<void> {
        const canCreate = await this.fileService.canCreate(output)

        if (!canCreate) {
            throw ProcessorError.outputCreateFailed(output)
        }
    }

    private async verifyFileOutput(output: string): Promise<void> {
        await this.verifyOutput(output)

        const isDirectory = await this.fileService.isDirectory(output)

        if (isDirectory) {
            throw ProcessorError.outputMustBeFile(output)
        }
    }

    private async createExtractionOutput(output: string): Promise<string> {
        const resolvedOutput = await this.fileService.exists(output)
            ? await this.createUniqueOutputPath(output)
            : output

        if (resolvedOutput !== output) {
            this.printer.print(
                `Output path already exists. Using ${resolvedOutput} instead.`
            )
        }

        await this.verifyOutput(resolvedOutput)
        await this.fileService.createDir(resolvedOutput)

        return resolvedOutput
    }

    private async createUniqueOutputPath(output: string): Promise<string> {
        for (let attempts = 0; attempts < 10; attempts++) {
            const candidate = this.uniqueOutputCandidate(output)

            if (!(await this.fileService.exists(candidate))) {
                return candidate
            }
        }

        throw ProcessorError.uniqueOutputFailed(output)
    }

    private uniqueOutputCandidate(output: string): string {
        return `${output}-${this.hashGenerator.generate()}`
    }

    public async extract(
        type: ArchiverType | string,
        input: string,
        output: string
    ): Promise<void> {
        const archiverType = typeof type === 'string' ? fromString(type) : type

        this.printer.print(
            `Extracting ${archiverType} archive from ${input} into ${output}`
        )

        const archiver = this.getArchiver(archiverType)

        await this.verifyInput(input)
        const extractionOutput = await this.createExtractionOutput(output)

        await archiver.extract(input, extractionOutput)

        this.printer.print(`Extraction completed: ${extractionOutput}`)
    }

    public async compress(
        type: ArchiverType | string,
        input: string,
        output: string
    ): Promise<void> {
        const archiverType = typeof type === 'string' ? fromString(type) : type

        this.printer.print(
            `Compressing ${input} as ${archiverType} archive into ${output}`
        )

        const archiver = this.getArchiver(archiverType)

        await this.verifyInput(input)
        await this.verifyFileOutput(output)

        await archiver.compress(input, output)

        this.printer.print(`Compression completed: ${output}`)
    }

    public async seeInside(
        type: ArchiverType | string,
        input: string
    ): Promise<void> {
        const archiverType = typeof type === 'string' ? fromString(type) : type

        this.printer.print(`Inspecting ${archiverType} archive: ${input}`)

        const archiver = this.getArchiver(archiverType)

        await this.verifyInput(input)

        const artifactInside = await archiver.seeInside(input)

        if (artifactInside.length === 0) {
            this.printer.print('Archive is empty.')
            return
        }

        for (const item of artifactInside) {
            this.printer.print(`-> ${item}`)
        }
    }
}
