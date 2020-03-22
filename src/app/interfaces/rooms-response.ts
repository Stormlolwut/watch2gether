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
        messages: Array<MessageInterface>,
        videos: Array<VideosInterface>
    }]
}

interface MessageInterface {
    user: string,
    line: string,
    timestamp: Date,
}

interface VideosInterface {
    link: string,
    length: number,
    isPaused: boolean,
    videostamp: number,
    deltatime: number,
    timestamp: Date,
}