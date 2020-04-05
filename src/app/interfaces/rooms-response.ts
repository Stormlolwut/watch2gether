import {RoomInterface} from './room-response';

export interface RoomsResponse {
    rooms: Array<RoomInterface>,
    message: string,
    statusCode: number,
}
