"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuth = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = "3ras3_Un4_V3z_Un4_Qu3d4ad4";
const createToken = (appuser) => {
    const payload = {
        appuser: {
            id: appuser.appuser_id,
            email: appuser.email,
            username: appuser.username,
            role: appuser.role
        },
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};
exports.createToken = createToken;
const isAuth = (req, response, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            req.body.auth = decoded.appuser;
            next();
        }
    }
    catch (err) {
        console.error(err);
        const message = {
            text: "No autorizado",
        };
        response.status(401).json(message);
    }
};
exports.isAuth = isAuth;
const isAdmin = (req, res, next) => {
    try {
        if (req.body.auth.role && req.body.auth.role == "admin") {
            next();
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.isAdmin = isAdmin;
