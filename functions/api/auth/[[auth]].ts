/**
 * Proxy de Autenticação para Neon Auth
 * Esconde a URL real do serviço e evita exposição em erros/redirecionamentos.
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // URL base do serviço Neon Auth (Tenta pegar do env, senão usa o padrão)
    const neonAuthBaseUrl = env.VITE_BETTER_AUTH_URL || 'https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth';

    // Reconstrói a URL de destino: substitui /api/auth pela URL do Neon
    const path = url.pathname.replace(/^\/api\/auth/, '');
    const targetUrl = new URL(neonAuthBaseUrl + path + url.search);

    // Prepara os novos headers: removemos o 'host' para o Neon não rejeitar a requisição
    const newHeaders = new Headers(request.headers);
    newHeaders.delete('host');
    newHeaders.set('Origin', 'https://fit-tracker-btx.pages.dev'); // Opcional, ajuda no CORS

    const proxyRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: newHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : undefined,
        redirect: 'manual'
    });

    try {
        const response = await fetch(proxyRequest);

        // Copia a resposta para poder manipular
        const newResponse = new Response(response.body, response);

        // Ajusta redirecionamentos para não exporem a URL interna do Neon
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (location && (location.includes('neonauth') || location.includes('neon.tech'))) {
                const newLocation = location.replace(neonAuthBaseUrl, `${url.origin}/api/auth`);
                newResponse.headers.set('location', newLocation);
            }
        }

        return newResponse;
    } catch (error: any) {
        console.error('Proxy Fetch Error:', error);
        return new Response(`Erro no Proxy de Autenticação: ${error.message}`, { status: 502 });
    }
};
