import Admin from '../models/Admin';
import { jsonResp, md5 } from '../utils/stringUtil';

export const login = async (ctx: any) => {
    if (ctx.session.admin) {
        ctx.body = jsonResp('error', '已登录');
        return;
    }
    const { username, password } = ctx.request.body;
    if (!username) {
        ctx.body = jsonResp('error', '用户名不能为空');
    } else if (!password) {
        ctx.body = jsonResp('error', '密码不能为空');
    } else {
        const admin = await Admin.findOne({
            where: {
                username: username
            }
        });
        if (admin) {
            if (admin.password === md5(password)) {
                ctx.session.admin = admin;
                ctx.body = jsonResp('ok', '登录成功', {
                    user: admin
                });
            } else {
                ctx.body = jsonResp('error', '密码错误');
            }
        } else {
            ctx.body = jsonResp('error', '用户不存在');
        }
    }
};

export const logout = async (ctx: any) => {
    delete ctx.session.admin;
    ctx.body = jsonResp('ok', '登出成功');
};

export const modifyPassword = async (ctx: any) => {
    const { oldPassword, password, confirmPassword } = ctx.request.body;
    const admin = await Admin.findOne({
        where: {
            id: ctx.session.admin.id
        }
    });
    if (!oldPassword) {
        ctx.body = jsonResp('error', '原密码不能为空');
    } else if (!password) {
        ctx.body = jsonResp('error', '新密码不能为空');
    } else if (password !== confirmPassword) {
        ctx.body = jsonResp('error', '两次输入的密码不一致');
    } else if (admin.password !== md5(oldPassword)) {
        ctx.body = jsonResp('error', '原密码错误');
    } else {
        admin.password = md5(password);
        await admin.save();
        delete ctx.session.admin;
        ctx.body = jsonResp('ok', '密码修改成功, 请重新登录');
    }
};

export const admin = async (ctx: any) => {
    ctx.body = jsonResp('ok', 'success', {
        user: ctx.session.admin
    });
};
