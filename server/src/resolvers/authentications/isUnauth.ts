import { MyContext } from './../../types/MyContext';
import { MiddlewareFn } from "type-graphql";


export const isUnauth: MiddlewareFn<MyContext> = async({ context }, next) => {
    if(context.req.session.userId){
        throw new Error('Authenticated!');
    }
    return next();
}