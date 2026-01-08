/**
 * Proxy de Autenticação para Neon Auth
 * Esconde a URL real do serviço e evita exposição em erros/redirecionamentos.
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // URL base do serviço Neon Auth (Tenta pegar do env, senão usa o padrão do .env.example)
    let neonAuthBaseUrl = (env.VITE_BETTER_AUTH_URL || 'https://epf-oldsexc-waterfall-56ds45f4.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth').trim();

    // Remove barra final se existir para evitar duplicação no join
    if (neonAuthBaseUrl.endsWith('/')) {
        neonAuthBaseUrl = neonAuthBaseUrl.slice(0, -1);
    }

    // Reconstrói a URL de destino: substitui /api/auth pela URL do Neon
    const path = url.pathname.replace(/^\/api\/auth/, '');

    // Garante que o path comece com barra e o join seja limpo
    const targetPath = path.startsWith('/') ? path : '/' + path;
    const targetUrl = new URL(neonAuthBaseUrl + targetPath + url.search);

    // Prepara os novos headers: removemos o 'host' e 'content-length' para o fetch recalcular
    const newHeaders = new Headers(request.headers);
    newHeaders.delete('host');
    newHeaders.delete('content-length');

    // Tenta usar o origin real da requisição para maior compatibilidade CORS
    const requestOrigin = request.headers.get('origin');
    if (requestOrigin) {
        newHeaders.set('Origin', requestOrigin);
    } else {
        newHeaders.set('Origin', 'https://fit-tracker-btx.pages.dev');
    }

    // Só lemos o corpo para métodos que permitem corpo (POST, PUT, PATCH)
    const method = request.method.toUpperCase();
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

    const proxyRequestInit: RequestInit = {
        method,
        headers: newHeaders,
        redirect: 'manual'
    };

    if (hasBody) {
        // Importante: lemos o corpo apenas uma vez
        proxyRequestInit.body = await request.arrayBuffer();
    }

    try {
        const response = await fetch(targetUrl.toString(), proxyRequestInit);

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
