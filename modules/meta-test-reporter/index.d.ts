/// <reference types="node" />
import { ISumanOpts } from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import { IExpectedCounts } from "suman-types/dts/reporters";
declare const _default: (s: EventEmitter, sumanOpts: ISumanOpts, expectations: IExpectedCounts) => void;
export default _default;
