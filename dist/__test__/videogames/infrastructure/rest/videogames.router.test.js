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
const supertest_1 = __importDefault(require("supertest"));
const App_1 = require("../../../../src/App");
const videogames_router_1 = require("../../../../src/videogames/infrastructure/rest/videogames.router");
App_1.app.use("/videogames", videogames_router_1.routerVideogames);
describe("videogames routes", () => {
    test('GET /videogames', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(App_1.app).get("/videogames");
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    }));
});
