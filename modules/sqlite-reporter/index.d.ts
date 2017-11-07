/// <reference types="node" />
import EventEmitter = NodeJS.EventEmitter;
import { IRet } from 'suman-types/dts/reporters';
declare const _default: (s: EventEmitter, sqlite3: Object) => IRet | {
    reporterName: string;
    count: number;
    cb: () => void;
};
export default _default;
