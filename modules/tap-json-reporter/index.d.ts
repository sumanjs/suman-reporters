/// <reference types="node" />
import { ISumanOpts } from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import { IRet } from 'suman-types/dts/reporters';
declare const _default: (s: EventEmitter, opts: ISumanOpts) => Partial<IRet>;
export default _default;
