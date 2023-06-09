import Appuser from "./Appuser";
import LoginResponse from './LoginResponse';

export default interface AppuserRepository {
    signup(appuser: Appuser): Promise<Appuser>;
    login(appuser: Appuser): Promise<LoginResponse>;
    update(appuser: Appuser): Promise<Appuser>;
    delete(appuser: Appuser): Promise<Appuser>;
    getAppuserById(appuser_id: number): Promise<Appuser>;
    getAllAppusers(): Promise<Appuser[]>;
    usernameExists(username: string): Promise<boolean | null>;
    emailExists(email: string): Promise<boolean | null>;

}