import { InvalidArchiverType } from "../errors/InvalidArchiverType";

export enum ArchiverType {
    ZIP = 'zip',
    RAR = 'rar',
    GZIP = 'gz',
    TAR = 'tar',
    SEVEN_ZIP = '7z'
}

export function fromString(type: string): ArchiverType {
    const normalizedType = type.trim().toLowerCase();

    const values = Object.values(ArchiverType) as string[]

    if (!values.includes(normalizedType)) {
        throw new InvalidArchiverType(normalizedType);
    }

    return normalizedType as ArchiverType
}