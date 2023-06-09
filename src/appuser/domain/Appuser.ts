

export default interface Appuser {
    id?: number,
    username: string,
    email?: string,
    password?: string,
    role?: 'admin' | 'user',
    name?: string,
    last_name?: string,
    created_at?: Date,
    description?: string,

}