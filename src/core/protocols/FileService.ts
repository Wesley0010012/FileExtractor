export interface FileService {
    havePermissions(path: string): Promise<boolean>
    exists(path: string): Promise<boolean>
    canCreate(path: string): Promise<boolean>
    isDirectory(path: string): Promise<boolean>

    readFile(path: string): Promise<Buffer>
    writeFile(path: string, data: Buffer): Promise<void>

    createDir(path: string): Promise<void>
    listDir(path: string): Promise<string[]>

    remove(path: string): Promise<void>

    createReadStream(path: string): NodeJS.ReadableStream
    createWriteStream(path: string): NodeJS.WritableStream
}
