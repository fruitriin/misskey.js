import { EventEmitter } from 'eventemitter3';
import { BroadcastEvents, Channels } from './streaming.types';
export declare function urlQuery(obj: Record<string, string | number | boolean | undefined>): string;
declare type AnyOf<T extends Record<any, any>> = T[keyof T];
declare type StreamEvents = {
    _connected_: void;
    _disconnected_: void;
    _error_: void;
} & BroadcastEvents;
export default class Stream extends EventEmitter<StreamEvents> {
    private stream?;
    state: 'initializing' | 'reconnecting' | 'connected';
    private sharedConnectionPools;
    private sharedConnections;
    private nonSharedConnections;
    private idCounter;
    constructor(origin: string, user: {
        token: string;
    } | null, options?: {
        WebSocket?: any;
    });
    private genId;
    useChannel<C extends keyof Channels>(channel: C, params?: Channels[C]['params'], name?: string): Connection<Channels[C]>;
    private useSharedConnection;
    removeSharedConnection(connection: SharedConnection): void;
    removeSharedConnectionPool(pool: Pool): void;
    private connectToChannel;
    disconnectToChannel(connection: NonSharedConnection): void;
    private onOpen;
    private onClose;
    private onError;
    private onMessage;
    send(typeOrPayload: any, payload?: any): void;
    close(): void;
}
declare class Pool {
    channel: string;
    id: string;
    protected stream: Stream;
    users: number;
    private disposeTimerId;
    private isConnected;
    constructor(stream: Stream, channel: string, id: string);
    private onStreamDisconnected;
    inc(): void;
    dec(): void;
    connect(): void;
    private disconnect;
}
export declare abstract class Connection<Channel extends AnyOf<Channels> = any> extends EventEmitter<Channel['events']> {
    channel: string;
    protected stream: Stream;
    abstract id: string;
    name?: string;
    inCount: number;
    outCount: number;
    constructor(stream: Stream, channel: string, name?: string);
    send<T extends keyof Channel['receives']>(type: T, body: Channel['receives'][T]): void;
    abstract dispose(): void;
}
declare class SharedConnection<Channel extends AnyOf<Channels> = any> extends Connection<Channel> {
    private pool;
    get id(): string;
    constructor(stream: Stream, channel: string, pool: Pool, name?: string);
    dispose(): void;
}
declare class NonSharedConnection<Channel extends AnyOf<Channels> = any> extends Connection<Channel> {
    id: string;
    protected params: Channel['params'];
    constructor(stream: Stream, channel: string, id: string, params: Channel['params']);
    connect(): void;
    dispose(): void;
}
export {};
//# sourceMappingURL=streaming.d.ts.map