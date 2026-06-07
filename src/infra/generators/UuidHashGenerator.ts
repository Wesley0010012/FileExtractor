import { v4 as uuid } from 'uuid'
import { HashGenerator } from '../../core/protocols/HashGenerator'

export class UuidHashGenerator implements HashGenerator {
    generate(): string {
        return uuid()
    }
}
