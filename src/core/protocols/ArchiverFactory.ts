import { ArchiverType } from "../enums/ArchiverType";
import { Archiver } from "./Archiver"

export interface ArchiverFactory {
    generate(type: ArchiverType): Archiver
}