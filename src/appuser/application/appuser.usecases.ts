import { createToken } from "../../_context/security/auth";
import Appuser from "../domain/Appuser";
import AppuserRepository from "../domain/Appuser.repository";
import Auth from "../domain/Auth";
import LoginResponse from './../domain/LoginResponse';

export default class AppuserUsecases {
    appuserRepository: AppuserRepository;
    constructor(appuserRepository: AppuserRepository) {
        this.appuserRepository = appuserRepository;
    }
    async signup(appuser: Appuser): Promise<Appuser> {
        return await this.appuserRepository.signup(appuser);
    }
    async login(appuser: Appuser): Promise<LoginResponse> {
        return await this.appuserRepository.login(appuser);
    }
    async update(appuser: Appuser): Promise<Appuser> {
        return await this.appuserRepository.update(appuser);
    }
    async delete(appuser: Appuser): Promise<Appuser> {
        return await this.appuserRepository.delete(appuser);
    }
    async getAppuserById(id: number): Promise<Appuser> {
        return await this.appuserRepository.getAppuserById(id);
    }
    async getAllAppusers(): Promise<Appuser[]> {
        return await this.appuserRepository.getAllAppusers();
    }

    async usernameExists(username: string): Promise<boolean | null> {
        return await this.appuserRepository.usernameExists(username)
    }

    async emailExists(email: string): Promise<boolean | null> {
        return await this.appuserRepository.emailExists(email);
    }

    generateToken(appuser: Appuser): Auth {
        const auth: Auth = {
            appuser: {
                username: appuser.username,
                id: appuser.id,
            },
            token: createToken(appuser)
        }
        return auth
    }
}