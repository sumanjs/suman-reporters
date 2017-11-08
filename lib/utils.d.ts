/// <reference types="node" />
/// <reference types="socket.io-client" />
import { IRet } from "suman-types/dts/reporters";
import EventEmitter = NodeJS.EventEmitter;
import { ISumanOpts } from "suman-types/dts/global";
import { IExpectedCounts, IReporterLoadFn } from "suman-types/dts/reporters";
export declare const getLogger: (reporterName: string) => any;
export declare const wrapReporter: (reporterName: string, fn: IReporterLoadFn) => (s: EventEmitter, sumanOpts: ISumanOpts, expectations?: IExpectedCounts, client?: SocketIOClient.Socket) => IRet;
