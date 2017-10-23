/// <reference types="socket.io-client" />
import { ISumanOpts } from 'suman-types/dts/global';
import EventEmitter = NodeJS.EventEmitter;
declare const _default: (s: EventEmitter, opts: ISumanOpts, expectations: {}, client: SocketIOClient.Socket) => IRet;
export default _default;
