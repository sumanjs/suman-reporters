/// <reference types="node" />
import { ISumanOpts } from 'suman';
import EventEmitter = NodeJS.EventEmitter;
export interface IExpectedCounts {
    TEST_CASE_FAIL: number;
    TEST_CASE_PASS: number;
    TEST_CASE_SKIPPED: number;
    TEST_CASE_STUBBED: number;
}
declare const _default: (s: EventEmitter, sumanOpts: ISumanOpts, expectations: IExpectedCounts) => void;
export default _default;
