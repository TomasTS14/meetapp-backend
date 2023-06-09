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
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbHost = process.env.POSTGRES_HOST;
const dbUser = process.env.POSTGRES_USER;
const dbPassword = process.env.POSTGRES_PASSWORD;
const dbName = process.env.POSTGRES_NAME;
const pool = new pg_1.Pool({
    max: 20,
    connectionString: `postgres://${dbUser}:${dbPassword}@${dbHost}:5432/${dbName}`,
    idleTimeoutMillis: 30000
});
const executeQuery = (sql) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    const { rows } = yield client.query(sql);
    client.release();
    return rows;
});
exports.default = executeQuery;
