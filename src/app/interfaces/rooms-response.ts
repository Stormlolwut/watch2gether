import {MessageInterface, QueueInterface} from './room-response';

export interface RoomsResponse {
    rooms: [{
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
        queue: Array<QueueInterface>
        messages: Array<MessageInterface>,
        videos: Array<VideosInterface>
    }]
}

interface VideosInterface {
    link: string,
    length: number,
    isPaused: boolean,
    videostamp: number,
    deltatime: number,
    timestamp: Date,
}
