export interface AuthResponse {
    message: string,
    statusCode: number,
    user: {
        role: string,
        extra: [any],
        providers: [any],
        id: number,
        name: string,
        email: string,
        token: string,
    }
}
