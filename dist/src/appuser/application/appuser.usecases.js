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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../_context/security/auth");
class AppuserUsecases {
    constructor(appuserRepository) {
        this.appuserRepository = appuserRepository;
    }
    signup(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.signup(appuser);
        });
    }
    login(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.login(appuser);
        });
    }
    update(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.update(appuser);
        });
    }
    delete(appuser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.delete(appuser);
        });
    }
    getAppuserById(appuser_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.getAppuserById(appuser_id);
        });
    }
    getAllAppusers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.appuserRepository.getAllAppusers();
        });
    }
    generateToken(appuser) {
        const auth = {
            appuser: {
                username: appuser.username,
            },
            token: (0, auth_1.createToken)(appuser)
        };
        return auth;
    }
}
exports.default = AppuserUsecases;
