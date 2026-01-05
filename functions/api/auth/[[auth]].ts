// Esta rota não é mais necessária pois estamos usando Neon Auth (serviço gerenciado)
// Todas as rotas de autenticação são tratadas pelo serviço Neon Auth na URL:
// https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth

export const onRequest = async ({ request }: { request: Request }) => {
    return new Response("Authentication handled by Neon Auth service", { status: 200 });
};
