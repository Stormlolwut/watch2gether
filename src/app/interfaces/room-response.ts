import {UserResponseInterface} from './auth-response';

export interface RoomResponse {
    room: {
        id: string,
        name: string,
        password: string,
        picture: string,
        categories: [string],
        users: [],
        blacklist: {
            enabled: boolean,
            [userId: number]: string
        },
        messages: Array<MessageInterface>,
        videos: Array<VideosInterface>
    }
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
