"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hash = (text) => {
    return bcrypt_1.default.hashSync(String(text), saltRounds);
};
exports.hash = hash;
const compare = (text, encrypted) => {
    return bcrypt_1.default.compareSync(String(text), encrypted);
};
exports.compare = compare;
