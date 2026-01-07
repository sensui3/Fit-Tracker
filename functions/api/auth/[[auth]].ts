/**
 * Proxy de Autenticação para Neon Auth
 * Esconde a URL real do serviço e evita exposição em erros/redirecionamentos.
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // URL base do serviço Neon Auth (mantida no backend)
    const neonAuthBaseUrl = env.VITE_BETTER_AUTH_URL;

    if (!neonAuthBaseUrl) {
        return new Response("Configuração de autenticação ausente", { status: 500 });
    }

    // Reconstrói a URL de destino: substitui /api/auth pela URL do Neon
    const path = url.pathname.replace(/^\/api\/auth/, '');
    // Remove barras duplas se houver
    const targetPath = (neonAuthBaseUrl + path).replace(/([^:]\/)\/+/g, "$1");
    const targetUrl = new URL(targetPath + url.search);

    // Cria a nova requisição encaminhando todos os headers, corpo e método
    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : undefined,
        redirect: 'manual'
    });

    try {
        const response = await fetch(proxyRequest);

        // Copia a resposta para poder manipular headers se necessário (ex: Set-Cookie)
        const newResponse = new Response(response.body, response);

        // Garante que o CORS ou redirecionamentos não exponham a URL interna
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (location && location.includes('neonauth.c-2.us-east-1.aws.neon.tech')) {
                const newLocation = location.replace(neonAuthBaseUrl, '/api/auth');
                newResponse.headers.set('location', newLocation);
            }
        }

        return newResponse;
    } catch (error: any) {
        console.error('Proxy Fetch Error:', error);
        return new Response(`Erro de Conexão com Servidor de Autenticação`, { status: 502 });
    }
};
