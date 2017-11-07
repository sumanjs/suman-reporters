/// <reference types="node" />
/// <reference types="socket.io-client" />
import { ISumanOpts } from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
import { IExpectedCounts } from 'suman-types/dts/reporters';
export declare const loadReporter: (s: EventEmitter, sumanOpts: ISumanOpts, expectations?: IExpectedCounts, client?: SocketIOClient.Socket) => any;
export default loadReporter;
