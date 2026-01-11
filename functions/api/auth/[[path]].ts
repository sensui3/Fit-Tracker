import { getAuth } from "../../../lib/auth";

export const onRequest = async (context: any) => {
    const authInstance = getAuth(context.env);
    return authInstance.handler(context.request);
};
