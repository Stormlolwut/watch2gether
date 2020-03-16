export interface AuthResponse {
    message: string,
    statusCode: number,
    user: {
        id: number,
        name: string,
        email: string,
        token: string,
        expires_in: number,
    }
}
