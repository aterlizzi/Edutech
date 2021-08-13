import { UserData } from '../../entity/User';
import { MyContext } from './../../types/MyContext';
import { MiddlewareFn } from "type-graphql";


export const isAuth: MiddlewareFn<MyContext> = async({ context }, next) => {
    const user = await UserData.findOne(context.req.session.userId);
    if (!user || !user.subscriber) {
        throw new Error('Not paid.');
    }

    return next();
}