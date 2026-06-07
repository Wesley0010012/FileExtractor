export interface Archiver {
    extract(input: string, output: string): Promise<void>
    compress(input: string, output: string): Promise<void>
    seeInside(input: string): Promise<string[]>
}