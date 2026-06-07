import { execFile } from 'child_process'
import path from 'path'
import { Archiver } from '../../core/protocols/Archiver'
import { ArchiverError } from '../../core/errors/ArchiverError'

export class RarArchiver implements Archiver {

    async extract(input: string, output: string): Promise<void> {
        try {
            await this.run('unrar', ['x', input, output])
        } catch (err) {
            throw new ArchiverError('RAR', 'extract', input, err)
        }
    }

    async compress(input: string, output: string): Promise<void> {
        try {
            await this.run(
                'rar',
                ['a', output, path.basename(input)],
                path.dirname(input)
            )
        } catch (err) {
            throw new ArchiverError('RAR', 'compress', input, err)
        }
    }

    async seeInside(input: string): Promise<string[]> {
        try {
            const result = await this.run('unrar', ['lb', input])
            return result.split('\n').filter(Boolean)
        } catch (err) {
            throw new ArchiverError('RAR', 'inspect', input, err)
        }
    }

    private run(command: string, args: string[], cwd?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            execFile(command, args, { cwd }, (err, stdout) => {
                if (err) return reject(err)
                resolve(stdout)
            })
        })
    }
}
