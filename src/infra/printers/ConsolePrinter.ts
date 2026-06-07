import { Printer } from '../../core/protocols/Printer'

export class ConsolePrinter implements Printer {
    print(message: string): void {
        console.log(message)
    }
}
