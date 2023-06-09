import Appuser from "../../domain/Appuser";
import AppuserRepository from "../../domain/Appuser.repository";
import executeQuery from './../../../_context/db/postgres.connector';
import Message from "../../../_context/response/Message";
import { compare, hash } from '../../../_context/security/encrypter';
import LoginResponse from '../../domain/LoginResponse';


export default class AppuserRepositoryPostgreSQL implements AppuserRepository {

    async signup(appuser: Appuser): Promise<Appuser> {
        if (appuser.email && appuser.username && appuser.name && appuser.last_name && appuser.password) {
            try {

                const sql = `INSERT INTO appusers (email, username, name, last_name, password) VALUES ('${appuser.email}', '${appuser.username}', '${appuser.name}','${appuser.last_name}' ,'${hash(appuser.password)}') RETURNING *;`
                const appUserDB: any[] = await executeQuery(sql)
                appuser.id = appUserDB[0].id;
                appuser.role = appUserDB[0].role;
                appuser.password = "";
                return appuser
            } catch (error) {

                console.error(error)
            }
        }
        const message: Message = {
            text: "information is missing to create a new user",
        }
        console.error(message)

        return {} as Appuser
    }
    async login(appuser: Appuser): Promise<LoginResponse> {

        if (appuser.username && appuser.password) {
            try {
                const sql = `SELECT * FROM appusers WHERE username = '${appuser.username}'`;
                const appUserDB: any[] = await executeQuery(sql)

                if (appUserDB.length >= 1 && compare(appuser.password, appUserDB[0].password)) {

                    appuser.id = appUserDB[0].id;
                    appuser.username = appUserDB[0].username;
                    appuser.email = appUserDB[0].email;
                    appuser.role = appUserDB[0].role;
                    appuser.password = "";
                    return {
                        status: 200,
                        appuser: appuser
                    }
                } else {
                    const message: Message = {
                        text: "password or username is incorrect",
                    }
                    console.log(message);
                    return {
                        status: 404
                    }
                }

            } catch (err) {
                console.error(err)
            }
        }
        const message: Message = {
            text: "information is missing to login_repository",
        }
        console.error(message)
        return {
            status: 400,
        }
    }
    async update(appuser: Appuser): Promise<Appuser> {
        if (appuser.id && appuser.email && appuser.username && appuser.password) {
            try {
                const sql = `UPDATE appusers SET email = '${appuser.email}', username = '${appuser.username}' WHERE id = ${appuser.id} RETURNING *;`
                const appUserDB: any[] = await executeQuery(sql)
                appuser.email = appUserDB[0].email;
                appuser.username = appUserDB[0].username;
                appuser.password = "";

                return appuser
            } catch (error) {
                console.error(error)
            }
        } else {
            const message: Message = {
                text: "information is missing to update a user",
            }
            console.error(message)
        }
        return {} as Appuser;
    }
    async delete(appuser: Appuser): Promise<Appuser> {
        if (appuser.id) {
            try {
                const sql = `DELETE FROM appusers WHERE id = ${appuser.id} RETURNING *;`
                const appUserDB: any[] = await executeQuery(sql)
                appuser.id = appUserDB[0].id;
                return appuser
            } catch (error) {
                console.error(error)
            }
        } else {
            const message: Message = {
                text: "information is missing to delete a user",
            }
            console.error(message)
        }
        return {} as Appuser;


    }
    async getAppuserById(id: number): Promise<Appuser> {
        if (id) {
            try {
                const sql = `SELECT * FROM appusers WHERE id = ${id}`;
                const appuserDB: any[] = await executeQuery(sql)
                if (appuserDB[0]) {
                    const appuser: Appuser = {
                        id: appuserDB[0].id,
                        email: appuserDB[0].email,
                        username: appuserDB[0].username,
                        password: appuserDB[0].password,
                        name: appuserDB[0].name,
                        last_name: appuserDB[0].last_name,
                        created_at: appuserDB[0].created_at,
                        description: appuserDB[0].description || "No description",
                    }
                    return appuser
                }
                else {
                    const message: Message = {
                        text: "user not found",
                    }
                    console.error(message)
                }
            } catch (error) {
                console.error(error)
            }
        }
        const message: Message = {
            text: "information is missing to get a user",
        }
        console.error(message)
        return {} as Appuser;

    }
    async getAllAppusers(): Promise<Appuser[]> {
        try {
            const sql = `SELECT id, username, email, name, last_name,role, created_at FROM appusers`;
            const appusersDB: any[] = await executeQuery(sql)
            const appusers: Appuser[] = []
            appusersDB.forEach(appuserDB => {
                const appuser: Appuser = {
                    id: appuserDB.id,
                    email: appuserDB.email,
                    username: appuserDB.username,
                    name: appuserDB.name,
                    last_name: appuserDB.last_name,
                    created_at: appuserDB.created_at,
                }
                appusers.push(appuser)
            });
            return appusers
        } catch (error) {
            console.error(error)
        }
        return [] as Appuser[];
    }

    async usernameExists(username: string): Promise<boolean | null> {
        try {
            const query = `SELECT * FROM appusers WHERE username LIKE '${username}' `
            const appusersDB: any[] = await executeQuery(query);
            if (appusersDB.length > 0) {
                return true;
            }
            else return false;

        } catch (err) {
            console.error(err);
        }
        return null;
    }
    async emailExists(email: string): Promise<boolean | null> {
        try {
            const query = `SELECT * FROM appusers WHERE  email LIKE '${email}' `
            const appusersDB: any[] = await executeQuery(query);
            if (appusersDB.length > 0) {
                return true;
            }
            else return false;

        } catch (err) {
            console.error(err);
        }
        return null;
    }
}