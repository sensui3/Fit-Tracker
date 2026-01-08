/**
 * Proxy de Autenticação para Neon Auth - v2 (Foco em Compatibilidade)
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // URL base do serviço Neon Auth
    let neonAuthBaseUrl = (env.VITE_BETTER_AUTH_URL || 'https://epf-oldsexc-waterfall-56ds45f4.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth').trim();
    if (neonAuthBaseUrl.endsWith('/')) {
        neonAuthBaseUrl = neonAuthBaseUrl.slice(0, -1);
    }

    // Identifica o sub-caminho (ex: /sign-up/email)
    // Remove o prefixo /api/auth
    const subPath = url.pathname.substring('/api/auth'.length);

    // Constrói a URL final
    const targetUrl = new URL(neonAuthBaseUrl + subPath + url.search);

    // Clona os headers e ajusta para o proxy
    const newHeaders = new Headers(request.headers);

    // Headers essenciais para proxy
    newHeaders.delete('host');
    newHeaders.delete('content-length');

    // Informa ao Neon Auth sobre o host original (Importante para CSRF e Cookies)
    newHeaders.set('X-Forwarded-Host', url.host);
    newHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

    // Origin deve ser condizente com a requisição
    const origin = request.headers.get('origin');
    if (origin) {
        newHeaders.set('Origin', origin);
    }

    const method = request.method.toUpperCase();

    // Tratamento especial para preflight (CORS)
    if (method === 'OPTIONS') {
        const response = await fetch(targetUrl.toString(), {
            method: 'OPTIONS',
            headers: newHeaders,
            redirect: 'manual'
        });
        return response;
    }

    // Prepara a requisição de destino
    const requestInit: RequestInit = {
        method,
        headers: newHeaders,
        redirect: 'manual'
    };

    // Só anexa o corpo para métodos que o suportam
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        const body = await request.arrayBuffer();
        if (body.byteLength > 0) {
            requestInit.body = body;
        }
    }

    try {
        const response = await fetch(targetUrl.toString(), requestInit);

        // Clona a resposta para permitir modificação de headers
        const newResponse = new Response(response.body, response);

        // Proteção contra exposição de URL interna em redirecionamentos
        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (location && (location.includes('neonauth') || location.includes('neon.tech'))) {
                const newLocation = location.replace(neonAuthBaseUrl, `${url.origin}/api/auth`);
                newResponse.headers.set('location', newLocation);
            }
        }

        // Garante que o método 405 não venha do proxy em si
        newResponse.headers.set('X-Proxy-Status', 'executed');

        return newResponse;
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return new Response(JSON.stringify({
            error: 'Proxy Error',
            message: error.message,
            target: targetUrl.toString()
        }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
