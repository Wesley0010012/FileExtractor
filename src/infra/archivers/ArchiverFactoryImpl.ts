import { ArchiverType } from '../../core/enums/ArchiverType'
import { UnsupportedArchiverType } from '../../core/errors/UnsupportedArchiverType'
import { Archiver } from '../../core/protocols/Archiver'
import { ArchiverFactory } from '../../core/protocols/ArchiverFactory'

import { ZipArchiver } from './ZipArchiver'
import { TarArchiver } from './TarArchiver'
import { GzipArchiver } from './GZipArchiver'
import { SevenZipArchiver } from './SevenZipArchiver'
import { RarArchiver } from './RarArchiver'

import { FileService } from '../../core/protocols/FileService'

export class ArchiverFactoryImpl implements ArchiverFactory {

    constructor(private readonly fileService: FileService) {}

    generate(type: ArchiverType): Archiver {
        switch (type) {
            case ArchiverType.ZIP:
                return new ZipArchiver(this.fileService)

            case ArchiverType.TAR:
                return new TarArchiver(this.fileService)

            case ArchiverType.GZIP:
                return new GzipArchiver(this.fileService)

            case ArchiverType.SEVEN_ZIP:
                return new SevenZipArchiver(this.fileService)

            case ArchiverType.RAR:
                return new RarArchiver()

            default:
                throw new UnsupportedArchiverType(type)
        }
    }
}
