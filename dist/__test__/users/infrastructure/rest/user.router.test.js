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
const appuser_router_1 = require("../../../../src/users/infrastructure/rest/appuser.router");
App_1.app.use("/users", appuser_router_1.appuserRouter);
/**
 * Documento para mi esto:
 * puedo tener varios test dentro de un describe,
 * en estos test puedo simular el conseguir el token con sea como sea que consiga mi token normalment,
 * en este caso es con un post a /users/login que devuelve en la respuesta el token,
 * simulo que envio los datos correctos para conseguir este token
 * despues utilizo este token en mi get correspondiente dandole el header con .set("Authorization", Bearer ${token})
 *
 * importante resalta el hecho de que el importar la parte de app solo me sirvió con namespaces,
 *  ninguna otra forma de importar parecia traerse
 * el objeto con sus metodos bien
 */
describe("User routes", () => {
    test('GET /users/all', () => __awaiter(void 0, void 0, void 0, function* () {
        const authResponse = yield (0, supertest_1.default)(App_1.app)
            .post("/users/login")
            .send({
            "username": "tomasUsername",
            "password": "tomas123"
        });
        const token = authResponse.body.token;
        const res = yield (0, supertest_1.default)(App_1.app)
            .get("/users/all")
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    }));
    test('GET /users/', () => __awaiter(void 0, void 0, void 0, function* () {
        const authResponse = yield (0, supertest_1.default)(App_1.app)
            .post("/users/login")
            .send({
            "name": "TomasUser",
            "password": "123321"
        });
        const token = authResponse.body.token;
        const res = yield (0, supertest_1.default)(App_1.app)
            .get("/users")
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    }));
});
