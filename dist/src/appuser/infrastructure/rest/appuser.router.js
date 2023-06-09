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
exports.appuserRouter = void 0;
const express_1 = __importDefault(require("express"));
const appuser_usecases_1 = __importDefault(require("./../../application/appuser.usecases"));
const appuser_repository_postgresql_1 = __importDefault(require("./../db/appuser.repository.postgresql"));
const auth_1 = require("../../../_context/security/auth");
const encrypter_1 = require("../../../_context/security/encrypter");
const router = express_1.default.Router();
exports.appuserRouter = router;
const appuserRepository = new appuser_repository_postgresql_1.default();
const appuserUsecases = new appuser_usecases_1.default(appuserRepository);
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Welcome to Appuser API');
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("signing up user");
        const user = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            last_name: req.body.last_name,
        };
        const appuser = yield appuserUsecases.signup(user);
        const token = appuserUsecases.generateToken(appuser);
        res.json(token);
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logging in user " + req.body.username);
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
        };
        const login = yield appuserUsecases.login(user);
        if (login.username == user.username) {
            user.appuser_id = login.appuser_id;
            user.email = login.email;
            user.role = login.role;
            const token = appuserUsecases.generateToken(user);
            res.json(token);
        }
        else {
            const message = {
                text: String("login NOT successful")
            };
            res.status(500).send(message);
        }
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
router.put('/update', auth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("updating user " + req.body.auth.id);
        const user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            appuser_id: req.body.auth.id,
        };
        const provided_password = req.body.password;
        if (user.appuser_id) {
            const saved_password = yield appuserUsecases.getAppuserById(user.appuser_id).then((appuser) => {
                return appuser.password;
            });
            if (saved_password && provided_password) {
                if ((0, encrypter_1.compare)(provided_password, saved_password)) {
                    const appuser = yield appuserUsecases.update(user);
                    const new_token = appuserUsecases.generateToken(appuser);
                    res.json(new_token);
                }
                else {
                    const message = {
                        text: String("you are not authorized")
                    };
                    res.status(500).send(message);
                }
            }
        }
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
router.delete('/delete', auth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("deleting user " + req.body.auth.id);
        const user = {
            username: req.body.auth.username,
            appuser_id: req.body.auth.id,
        };
        const provided_password = req.body.password;
        if (user.appuser_id) {
            const saved_password = yield appuserUsecases.getAppuserById(user.appuser_id).then((appuser) => {
                return appuser.password;
            });
            if (saved_password && provided_password) {
                if ((0, encrypter_1.compare)(provided_password, saved_password)) {
                    const appuser = yield appuserUsecases.delete(user);
                    res.json(appuser);
                }
                else {
                    const message = {
                        text: String("you are not authorized")
                    };
                    res.status(500).send(message);
                }
            }
        }
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
router.get('/all', auth_1.isAuth, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appusers = yield appuserUsecases.getAllAppusers();
        res.json(appusers);
    }
    catch (err) {
        const message = {
            text: String("you are not authorized")
        };
        res.status(500).send(message);
    }
}));
router.get('/:appuser_id', auth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.params.appuser_id == req.body.auth.appuser_id) {
            const appuser_id = Number(req.params.appuser_id);
            const appuser = yield appuserUsecases.getAppuserById(appuser_id);
            res.json(appuser);
        }
        else {
            const message = {
                text: String("you are not authorized")
            };
            res.status(500).send(message);
        }
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
router.get('/admin/:appuser_id', auth_1.isAuth, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appuser_id = Number(req.params.appuser_id);
        const appuser = yield appuserUsecases.getAppuserById(appuser_id);
        res.json(appuser);
    }
    catch (err) {
        const message = {
            text: String(err)
        };
        res.status(500).send(message);
    }
}));
