import { NextFunction, Request, Response } from "express";

import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import Appuser from "../../appuser/domain/Appuser";
import Message from "../response/Message";

const SECRET_KEY: Secret = "3ras3_Un4_V3z_Un4_Qu3d4ad4";

const createToken = (appuser: Appuser): string => {
    const payload = {
        appuser: {
            id: appuser.id,
            email: appuser.email,
            username: appuser.username,
            role: appuser.role
        },
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token: string | undefined = authHeader && authHeader.split(" ")[1];
        if (token) {
            console.log("context/security/isAuth()=>if(token)");
            console.log("token: " + token);
            const decoded: any = jwt.verify(token, SECRET_KEY);
            req.body.auth = decoded.appuser;
            next();
        }
    } catch (err) {
        console.error(err);
        const message: Message = {
            text: "No autorizado",
        };
        response.status(401).json(message);
    }
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.auth.role && req.body.auth.role == "admin") {
            next();
        } else {
            res.send("you arent admin")
        }
    } catch (err) {
        console.error(err);
    }
}

export { createToken, isAuth, isAdmin };
