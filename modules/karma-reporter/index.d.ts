import { ISumanOpts } from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
declare const _default: (s: EventEmitter, sumanOpts: ISumanOpts, expectations: Object) => {
    reporterName: string;
    count: number;
    cb: () => void;
    completionHook: () => void;
};
export default _default;
