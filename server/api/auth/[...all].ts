import { auth } from "~~/server/libs/auth"
 
export default defineEventHandler((event) => {
    return auth.handler(toWebRequest(event));
});
