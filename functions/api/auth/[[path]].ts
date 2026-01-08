import { auth } from "../../../lib/auth";

export const onRequest = async ({ request }: { request: Request }) => {
    return auth.handler(request);
};
