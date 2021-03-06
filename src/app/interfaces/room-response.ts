import {UserResponseInterface} from './auth-response';

export interface RoomResponse {
    room: RoomInterface,
    message: string,
    statusCode: number,
}

export interface RoomInterface {
    id: string,
    name: string,
    password: string,
    picture: string,
    categories: [string],
    users: [{
        user: string,
        roles: [string]
    }],
    blacklist: {
        enabled: boolean,
        [userId: number]: string
    },
    queue: Array<QueueInterface>,
    messages: Array<MessageInterface>,
    videos: Array<VideosInterface>
}

export interface QueueInterface {
    link: string,
    timestamp: Date,
    position: number,
}

export interface MessageInterface {
    _id: string,
    sender: UserResponseInterface,
    line: string,
    timestamp: Date,
}

export interface AllMessagesInterface {
    statusCode: number,
    message: string,
    messages: MessageInterface[],
}

interface VideosInterface {
    link: string,
    length: number,
    isPaused: boolean,
    videostamp: number,
    deltatime: number,
    timestamp: Date,
}
