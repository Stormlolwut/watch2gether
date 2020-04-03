export interface AuthResponse {
    message: string,
    statusCode: number,
    user: UserResponseInterface
}

export interface UserResponseInterface {
    role: string,
    extra: [any],
    providers: [any],
    id: string,
    name: string,
    email: string,
    token: string,
    profile_picture: string,
}
