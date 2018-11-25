import * as Router from 'koa-router';
import * as admin from './admin';
import { user, login, logout, modifyNickname, modifyPassword, register } from '../controllers/user';
import { requireLogin } from '../controllers';

export const routers = new Router()
    .use('/admin', admin.router.routes(), admin.router.allowedMethods())
    .post('/register', register)
    .post('/login', login)
    .get('/logout', logout)
    .get('/', requireLogin, user)
    .put('/nickname', requireLogin, modifyNickname)
    .put('/password', requireLogin, modifyPassword)
    .get('/user/:id', requireLogin, user);