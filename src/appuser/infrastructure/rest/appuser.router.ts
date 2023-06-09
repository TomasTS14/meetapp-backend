
import express, { Request, Response } from 'express';
import AppuserUsecases from './../../application/appuser.usecases';
import AppuserRepository from './../../domain/Appuser.repository';
import AppuserRepositoryPostgreSQL from './../db/appuser.repository.postgresql';
import Appuser from '../../domain/Appuser';
import Message from '../../../_context/response/Message';
import Auth from './../../domain/Auth';
import { isAdmin, isAuth } from '../../../_context/security/auth';
import { compare } from '../../../_context/security/encrypter';

const router = express.Router();
const appuserRepository: AppuserRepository = new AppuserRepositoryPostgreSQL()
const appuserUsecases: AppuserUsecases = new AppuserUsecases(appuserRepository);

router.get('/', async (req: Request, res: Response) => {
    try {
        res.send('Welcome to Appuser API');
    } catch (err) {
        res.send('Error reaching Appuser API')
    }

});

router.post('/signup', async (req: Request, res: Response) => {
    try {
        console.log("signing up user");
        const user: Appuser = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            last_name: req.body.last_name,
        }
        console.log(user);


        const appuser = await appuserUsecases.signup(user);
        const token: Auth = appuserUsecases.generateToken(appuser);
        res.json(token);
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        res.status(500).send(message);
    }
});

router.post('/login', async (req: Request, res: Response) => {
    console.log("logging in user " + req.body.username);
    try {
        const user: Appuser = {
            username: req.body.username,
            password: req.body.password,
        }
        const login = await appuserUsecases.login(user);

        if (login.status === 200 && !!login.appuser) {
            user.id = login.appuser.id;
            user.email = login.appuser.email;
            user.role = login.appuser.role;

            const token: Auth = appuserUsecases.generateToken(user);
            console.log(token)
            res.json(token);
        } else if (login.status === 404) {
            const message: Message = {
                text: String("wrong login credentials")
            }
            console.error(message)
            res.status(404).send(message);
        }
        else if (login.status === 400) {
            const message: Message = {
                text: String("missing data")
            }
            console.error(message)
            res.status(400).send(message);
        }
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        console.error(message)
        res.status(500).send(message);
    }
});

router.put('/update', isAuth, async (req: Request, res: Response) => {
    try {
        console.log("updating user " + req.body.auth.id);
        const user: Appuser = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            id: req.body.auth.id,
        }
        const provided_password: String = req.body.password;

        if (user.id) {
            const saved_password: string | undefined = await appuserUsecases.getAppuserById(user.id).then((appuser) => {
                return appuser.password;
            });
            if (saved_password && provided_password) {
                if (compare(provided_password, saved_password)) {
                    const appuser = await appuserUsecases.update(user);
                    const new_token: Auth = appuserUsecases.generateToken(appuser);
                    res.json(new_token);
                }
                else {
                    const message: Message = {
                        text: String("you are not authorized")
                    }
                    res.status(500).send(message);
                }
            }
        }
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        res.status(500).send(message);
    }
});

router.delete('/delete', isAuth, async (req: Request, res: Response) => {
    try {
        console.log("deleting user " + req.body.auth.id);
        const user: Appuser = {
            username: req.body.auth.username,
            id: req.body.auth.id,
        }
        const provided_password: String = req.body.password;

        if (user.id) {
            const saved_password: string | undefined = await appuserUsecases.getAppuserById(user.id).then((appuser) => {
                return appuser.password;
            });
            if (saved_password && provided_password) {
                if (compare(provided_password, saved_password)) {
                    const appuser = await appuserUsecases.delete(user);
                    res.json(appuser);
                }
                else {
                    const message: Message = {
                        text: String("you are not authorized")
                    }
                    res.status(500).send(message);
                }
            }
        }
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        res.status(500).send(message);
    }
});

router.get('/all', isAuth, isAdmin, async (req: Request, res: Response) => {
    try {
        const appusers = await appuserUsecases.getAllAppusers();
        res.json(appusers);
    } catch (err) {
        const message: Message = {
            text: String("you are not authorized")
        }
        res.status(500).send(message);
    }
});

router.get('/:id', isAuth, async (req: Request, res: Response) => {
    try {
        console.log('getting user ' + req.params.id + ' by id')
        if (req.params.id == req.body.auth.id) {
            const id = Number(req.params.id);
            const appuser = await appuserUsecases.getAppuserById(id);
            res.json(appuser);
        } else {
            const message: Message = {
                text: String("you are not authorized")
            }
            res.status(500).send(message);
        }
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        res.status(500).send(message);
    }
}
);

router.get('/check/params', async (req: Request, res: Response) => {
    console.log("inside check_params");

    try {
        const params = req.query;
        console.log(params);

        if (!!params.username) {
            const usernameExists = await appuserUsecases.usernameExists(String(params.username));
            if (usernameExists === null) {
                res.status(500).send("ERROR CHECKING username " + params.username)
            } else {
                res.status(200).send(usernameExists);
            }
        }
        if (!!params.email) {
            const emailExists = await appuserUsecases.emailExists(String(params.email));
            if (emailExists === null) {
                res.status(500).send("ERROR CHECKING email " + params.email)
            } else {
                res.status(200).send(emailExists);
            }
        }

    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/admin/:id', isAuth, isAdmin, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const appuser = await appuserUsecases.getAppuserById(id);
        res.json(appuser);
    } catch (err) {
        const message: Message = {
            text: String(err)
        }
        res.status(500).send(message);
    }
});



export { router as appuserRouter }