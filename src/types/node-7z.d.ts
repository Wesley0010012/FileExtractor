declare module 'node-7z' {
    import { EventEmitter } from 'events'

    interface SevenZipEntry {
        file?: string
    }

    interface SevenZipStream extends EventEmitter {
        on(event: 'data', listener: (entry: SevenZipEntry) => void): this
        on(event: 'end', listener: () => void): this
        on(event: 'error', listener: (error: Error) => void): this
    }

    interface SevenZip {
        extractFull(input: string, output: string): SevenZipStream
        add(output: string, input: string): SevenZipStream
        list(input: string): SevenZipStream
    }

    const sevenZip: SevenZip
    export default sevenZip
}
