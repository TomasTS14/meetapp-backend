"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
//routers
const appuser_router_1 = require("./appuser/infrastructure/rest/appuser.router");
app.use("/users", appuser_router_1.appuserRouter);
app.use("/", (req, res, next) => {
    res.json({ message: "Allo! Catch-all route." });
});
