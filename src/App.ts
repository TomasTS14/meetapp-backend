import express from "express";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { NextFunction } from "express";
import cors from 'cors'

dotenv.config();

const corsOptions = {
    origin: ["http://localhost:3000"]
}

const app = express();

app.use(express.json());

app.use(cors(corsOptions))

//routers
import { appuserRouter } from "./appuser/infrastructure/rest/appuser.router";
import { eventRouter } from "./event/infrastructure/rest/event.router";


const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use("/users", appuserRouter);
app.use("/events", eventRouter)
app.use("/", (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: "Allo! Catch-all route." });
});
// import { routerUsers } from "./users/infrastructure/rest/users.router"
// import { routerVideogames } from "./videogames/infrastructure/rest/videogames.router"
// import { routerOrders } from "./orders/infrastructure/rest/orders.router";
// import { routerCart } from "./cart/infrastructure/rest/cart.router";
// app.use("/users", routerUsers);
// app.use("/videogames", routerVideogames)
// app.use("/carts", routerCart)
// app.use("/orders", routerOrders)
// app.use("/", (req: Request, res: Response, next: NextFunction): void => {
//   res.json({ message: "Allo! Catch-all route." });
// });
//portListener

export { app }