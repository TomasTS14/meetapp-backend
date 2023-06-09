"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_connector_1 = __importDefault(require("./../../../_context/db/postgres.connector"));
const encrypter_1 = require("../../../_context/security/encrypter");
class AppuserRepositoryPostgreSQL {
    signup(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (appuser.email && appuser.username && appuser.name && appuser.last_name && appuser.password) {
                try {
                    const sql = `INSERT INTO appusers (email, username, name, last_name, password) VALUES ('${appuser.email}', '${appuser.username}', '${appuser.name}','${appuser.last_name}' ,'${(0, encrypter_1.hash)(appuser.password)}') RETURNING *;`;
                    const appUserDB = yield (0, postgres_connector_1.default)(sql);
                    appuser.appuser_id = appUserDB[0].appuser_id;
                    appuser.role = appUserDB[0].role;
                    appuser.password = "";
                    return appuser;
                }
                catch (error) {
                    console.error(error);
                }
            }
            const message = {
                text: "information is missing to create a new user",
            };
            console.error(message);
            return {};
        });
    }
    login(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (appuser.username && appuser.password) {
                try {
                    const sql = `SELECT * FROM appusers WHERE username = '${appuser.username}'`;
                    const appUserDB = yield (0, postgres_connector_1.default)(sql);
                    if (appUserDB && (0, encrypter_1.compare)(appuser.password, appUserDB[0].password)) {
                        appuser.appuser_id = appUserDB[0].appuser_id;
                        appuser.username = appUserDB[0].username;
                        appuser.email = appUserDB[0].email;
                        appuser.role = appUserDB[0].role;
                        appuser.password = "";
                        return appuser;
                    }
                    else {
                        const message = {
                            text: "password or email is incorrect",
                        };
                        console.error(message);
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
            const message = {
                text: "information is missing to login",
            };
            console.error(message);
            return {};
        });
    }
    update(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (appuser.appuser_id && appuser.email && appuser.username && appuser.password) {
                try {
                    const sql = `UPDATE appusers SET email = '${appuser.email}', username = '${appuser.username}' WHERE appuser_id = ${appuser.appuser_id} RETURNING *;`;
                    const appUserDB = yield (0, postgres_connector_1.default)(sql);
                    appuser.email = appUserDB[0].email;
                    appuser.username = appUserDB[0].username;
                    appuser.password = "";
                    return appuser;
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                const message = {
                    text: "information is missing to update a user",
                };
                console.error(message);
            }
            return {};
        });
    }
    delete(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (appuser.appuser_id) {
                try {
                    const sql = `DELETE FROM appusers WHERE appuser_id = ${appuser.appuser_id} RETURNING *;`;
                    const appUserDB = yield (0, postgres_connector_1.default)(sql);
                    appuser.appuser_id = appUserDB[0].appuser_id;
                    return appuser;
                }
                catch (error) {
                    console.error(error);
                }
            }
            else {
                const message = {
                    text: "information is missing to delete a user",
                };
                console.error(message);
            }
            return {};
        });
    }
    getAppuserById(appuser_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (appuser_id) {
                try {
                    const sql = `SELECT * FROM appusers WHERE appuser_id = ${appuser_id}`;
                    const appuserDB = yield (0, postgres_connector_1.default)(sql);
                    if (appuserDB[0]) {
                        const appuser = {
                            appuser_id: appuserDB[0].appuser_id,
                            email: appuserDB[0].email,
                            username: appuserDB[0].username,
                            password: appuserDB[0].password,
                            name: appuserDB[0].name,
                            last_name: appuserDB[0].last_name,
                            created_at: appuserDB[0].created_at,
                        };
                        return appuser;
                    }
                    else {
                        const message = {
                            text: "user not found",
                        };
                        console.error(message);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            const message = {
                text: "information is missing to get a user",
            };
            console.error(message);
            return {};
        });
    }
    getAllAppusers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sql = `SELECT appuser_id, username, email, name, last_name,role, dateJoined FROM appusers`;
                const appusersDB = yield (0, postgres_connector_1.default)(sql);
                const appusers = [];
                appusersDB.forEach(appuserDB => {
                    const appuser = {
                        appuser_id: appuserDB.appuser_id,
                        email: appuserDB.email,
                        username: appuserDB.username,
                        name: appuserDB.name,
                        last_name: appuserDB.last_name,
                    };
                    appusers.push(appuser);
                });
                return appusers;
            }
            catch (error) {
                console.error(error);
            }
            return [];
        });
    }
}
exports.default = AppuserRepositoryPostgreSQL;
