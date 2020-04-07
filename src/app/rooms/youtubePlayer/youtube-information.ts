export interface YoutubeInformation {
    video: {
        title: string,
        description: string,
        duration: number,
        link: string,
        position: number,
        timestamp: Date,
    }
}

export interface UserListInterface {
    name: string,
    roles: Array<string>,
    joined: boolean,
    src: string,
}
