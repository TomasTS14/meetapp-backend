import request from "supertest";

import { app } from "../../../../src/App";

import { appuserRouter } from "../../../../src/appuser/infrastructure/rest/appuser.router";

app.use("/users", appuserRouter)

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
    test('GET /users/all', async () => {
        const authResponse = await request(app)
            .post("/users/login")
            .send({
                "username": "tomasUsername",
                "password": "tomas123"
            })

        const token = authResponse.body.token;
        console.log(token);
        const res = await request(app)
            .get("/users/all")
            .set('Authorization', `Bearer ${token}`);
        console.log(res.body)
        expect(res.statusCode).toBe(200);
    });
    test('GET /users/:appuser_id', async () => {
        const authResponse = await request(app)
            .post("/users/login")
            .send({
                "username": "tomasUsername",
                "password": "tomas123"
            })

        const token = authResponse.body.token;
        console.log(authResponse.body.appuser.appuser_id);
        const res = await request(app)
            .get("/users/" + authResponse.body.appuser.appuser_id)
            .set('Authorization', `Bearer ${token}`);
        console.log(`/users/${authResponse.body.appuser.appuser_id}`)
        console.log(res.body)
        expect(res.body.username).toEqual("tomasUsername");
    });
    test('GET WRONG_DATA login /users/:appuser_id', async () => {
        const res = await request(app)
            .post("/users/login")
            .send({
                "username": "tomasUsername",
                "password": "tomas123INVALID"
            })
        expect(res.body.text).toBe("login NOT successful");
    });
    test('GET ANOTHER USER THATS NOT ME (WITHOUT ADMIN) /users/:appuser_id', async () => {
        const authResponse = await request(app)
            .post("/users/login")
            .send({
                "username": "tomasUsername",
                "password": "tomas123"
            })
        const token = authResponse.body.token;
        const res = await request(app)
            .get("/users/5")
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.text).toBe("you are not authorized");


    });
});

