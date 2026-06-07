import fs from 'fs'
import path from 'path'
import { FileSystemError } from '../../core/errors/FileSystemError'
import { FileService } from '../../core/protocols/FileService'

export class InternalFileService implements FileService {

    async havePermissions(targetPath: string): Promise<boolean> {
        try {
            await fs.promises.access(targetPath, fs.constants.R_OK | fs.constants.W_OK)
            return true
        } catch {
            return false
        }
    }

    async exists(targetPath: string): Promise<boolean> {
        try {
            await fs.promises.access(targetPath, fs.constants.F_OK)
            return true
        } catch {
            return false
        }
    }

    async canCreate(targetPath: string): Promise<boolean> {
        try {
            const dir = path.dirname(targetPath)

            await fs.promises.mkdir(dir, { recursive: true })
            await fs.promises.access(dir, fs.constants.W_OK)

            return true
        } catch {
            return false
        }
    }

    async isDirectory(targetPath: string): Promise<boolean> {
        try {
            const stat = await fs.promises.stat(targetPath)
            return stat.isDirectory()
        } catch {
            return false
        }
    }

    async readFile(targetPath: string): Promise<Buffer> {
        try {
            return await fs.promises.readFile(targetPath)
        } catch (err) {
            throw FileSystemError.readFailed(targetPath, err)
        }
    }

    async writeFile(targetPath: string, data: Buffer): Promise<void> {
        try {
            const dir = path.dirname(targetPath)
            await fs.promises.mkdir(dir, { recursive: true })

            await fs.promises.writeFile(targetPath, data)
        } catch (err) {
            throw FileSystemError.writeFailed(targetPath, err)
        }
    }

    async createDir(targetPath: string): Promise<void> {
        try {
            await fs.promises.mkdir(targetPath, { recursive: true })
        } catch (err) {
            throw FileSystemError.createDirectoryFailed(targetPath, err)
        }
    }

    async listDir(targetPath: string): Promise<string[]> {
        try {
            return await fs.promises.readdir(targetPath)
        } catch (err) {
            throw FileSystemError.listDirectoryFailed(targetPath, err)
        }
    }

    async remove(targetPath: string): Promise<void> {
        try {
            await fs.promises.rm(targetPath, { recursive: true, force: true })
        } catch (err) {
            throw FileSystemError.removeFailed(targetPath, err)
        }
    }

    createReadStream(targetPath: string): NodeJS.ReadableStream {
        try {
            return fs.createReadStream(targetPath)
        } catch (err) {
            throw FileSystemError.readFailed(targetPath, err)
        }
    }

    createWriteStream(targetPath: string): NodeJS.WritableStream {
        try {
            const dir = path.dirname(targetPath)
            fs.mkdirSync(dir, { recursive: true })

            return fs.createWriteStream(targetPath)
        } catch (err) {
            throw FileSystemError.writeFailed(targetPath, err)
        }
    }
}
