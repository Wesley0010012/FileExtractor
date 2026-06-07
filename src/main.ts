import path from 'path'
import { AppError } from './core/errors/AppError'
import { CliError } from './core/errors/CliError'
import { fromString } from './core/enums/ArchiverType'
import { ArchiverFactoryImpl } from './infra/archivers/ArchiverFactoryImpl'
import { InternalFileService } from './infra/FileService/InternalFileService'
import { ConsolePrinter } from './infra/printers/ConsolePrinter'
import { UuidHashGenerator } from './infra/generators/UuidHashGenerator'
import { ArchiverProcessor } from './core/processors/ArchiverProcessor'

async function main() {
    const [, , command, typeRaw, input, output] = process.argv

    if (!command || !typeRaw || !input) {
        console.error('Usage:')
        console.error('extract|compress|inspect <type> <input> <output?>')
        process.exit(1)
    }

    const fileService = new InternalFileService()
    const printer = new ConsolePrinter()
    const hashGenerator = new UuidHashGenerator()

    const archiverFactory = new ArchiverFactoryImpl(fileService)

    const processor = new ArchiverProcessor(
        archiverFactory,
        printer,
        fileService,
        hashGenerator
    )

    try {
        const type = fromString(typeRaw)

        switch (command) {
            case 'extract':
                await processor.extract(type, input, output ?? process.cwd())
                break

            case 'compress':
                await processor.compress(
                    type,
                    input,
                    output ?? defaultCompressedOutput(input, type)
                )
                break

            case 'inspect':
                await processor.seeInside(type, input)
                break

            default:
                throw CliError.unknownCommand(command)
        }
    } catch (err: any) {
        printer.print(formatCliError(err))
        process.exit(1)
    }
}

function formatCliError(err: unknown): string {
    if (err instanceof AppError) {
        return `CLI Error [${err.code}]: ${err.message}`
    }

    if (err instanceof Error) {
        return `CLI Error [UNKNOWN_ERROR]: ${err.message}`
    }

    return `CLI Error [UNKNOWN_ERROR]: ${String(err)}`
}

function defaultCompressedOutput(input: string, type: string): string {
    const inputName = path.basename(path.resolve(input))

    return path.join(process.cwd(), `${inputName}.${type}`)
}

main()
