/**
 * Proxy de Autenticação para Neon Auth - v3 (Debug & Fix)
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // 1. Configurar URL Base
    let neonAuthBaseUrl = (env.VITE_BETTER_AUTH_URL || 'https://epf-oldsexc-waterfall-56ds45f4.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth').trim();
    // Remover barra final para padronizar
    if (neonAuthBaseUrl.endsWith('/')) {
        neonAuthBaseUrl = neonAuthBaseUrl.slice(0, -1);
    }

    // 2. Extrair Path Relativo
    // O Cloudflare encaminha /api/auth/sign-up/email
    // Precisamos de /sign-up/email para anexar ao Neon Auth
    const relativePath = url.pathname.replace(/^\/api\/auth/, '');

    // 3. Montar URL Final
    const targetUrl = new URL(neonAuthBaseUrl + relativePath + url.search);

    // 4. CORS Preflight (OPTIONS) - Responder direto sem ir ao servidor
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
                'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            }
        });
    }

    // 5. Preparar Headers para o Proxy
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete('Host');
    proxyHeaders.delete('Content-Length');
    proxyHeaders.set('X-Forwarded-Host', url.host);
    proxyHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

    // Origem é vital para o Better Auth
    if (!proxyHeaders.has('Origin')) {
        proxyHeaders.set('Origin', url.origin);
    }

    // 6. Preparar Requisição
    const proxyRequestInit: RequestInit = {
        method: request.method,
        headers: proxyHeaders,
        redirect: 'manual'
    };

    // Anexar corpo se necessário
    if (!['GET', 'HEAD'].includes(request.method)) {
        const bodyBuffer = await request.arrayBuffer();
        if (bodyBuffer.byteLength > 0) {
            proxyRequestInit.body = bodyBuffer;
        }
    }

    try {
        const response = await fetch(targetUrl.toString(), proxyRequestInit);

        // 7. Processar Resposta
        const responseHeaders = new Headers(response.headers);

        // Debug Headers (Remover em prod se necessário, mas útil agora)
        responseHeaders.set('X-Debug-Target-URL', targetUrl.toString());
        responseHeaders.set('X-Debug-Proxy-Status', 'Success');
        responseHeaders.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
        responseHeaders.set('Access-Control-Allow-Credentials', 'true');

        // Ajustar Redirects
        if (response.status >= 300 && response.status < 400) {
            const location = responseHeaders.get('location');
            if (location && (location.includes('neonauth') || location.includes('neon.tech'))) {
                const newLocation = location.replace(neonAuthBaseUrl, `${url.origin}/api/auth`);
                responseHeaders.set('location', newLocation);
            }
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });

    } catch (error: any) {
        return new Response(JSON.stringify({
            error: 'Proxy Error',
            details: error.message,
            target: targetUrl.toString()
        }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
