/**
 * Auth Proxy for Neon Auth
 * Refactored for better error surface, security headers, and robust path handling.
 */
export const onRequest = async ({ request, env }: { request: Request; env: { VITE_BETTER_AUTH_URL: string } }) => {
    const url = new URL(request.url);

    // 1. Resolve Target URL
    let targetBaseUrl = (env.VITE_BETTER_AUTH_URL || 'https://ep-young-waterfall-adzgojue.neonauth.c-2.us-east-1.aws.neon.tech/neondb/auth').trim();
    if (targetBaseUrl.endsWith('/')) targetBaseUrl = targetBaseUrl.slice(0, -1);

    const pathSuffix = url.pathname.replace(/^\/api\/auth/, '');
    const targetUrl = new URL(targetBaseUrl + pathSuffix + url.search);

    // 2. Security Headers Helper
    const applySecurityHeaders = (headers: Headers) => {
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('X-Frame-Options', 'DENY');
        headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        headers.set('Access-Control-Allow-Origin', request.headers.get('Origin') || '*');
        headers.set('Access-Control-Allow-Credentials', 'true');
        return headers;
    };

    // 3. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
        const headers = new Headers();
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization');
        headers.set('Access-Control-Max-Age', '86400');
        return new Response(null, { status: 204, headers: applySecurityHeaders(headers) });
    }

    // 4. Prepare Proxy Request
    const proxyHeaders = new Headers(request.headers);
    proxyHeaders.delete('Host');
    proxyHeaders.delete('Content-Length');
    proxyHeaders.set('X-Forwarded-Host', url.host);
    proxyHeaders.set('X-Proxy-Agent', 'FitTracker-Auth-Proxy-v4');

    const proxyInit: RequestInit = {
        method: request.method,
        headers: proxyHeaders,
        redirect: 'manual'
    };

    if (!['GET', 'HEAD'].includes(request.method)) {
        const body = await request.arrayBuffer();
        if (body.byteLength > 0) proxyInit.body = body;
    }

    try {
        const response = await fetch(targetUrl.toString(), proxyInit);

        // Clone headers to modify them
        const responseHeaders = new Headers(response.headers);
        applySecurityHeaders(responseHeaders);

        // Handle path rewriting for redirects (Set-Cookie usually handles its own domain)
        if (response.status >= 300 && response.status < 400) {
            const location = responseHeaders.get('location');
            if (location && (location.includes('neonauth') || location.includes('neon.tech'))) {
                const newLocation = location.replace(targetBaseUrl, `${url.origin}/api/auth`);
                responseHeaders.set('location', newLocation);
            }
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });

    } catch (error) {
        const err = error as Error;
        console.error('Auth Proxy Panic:', err);
        return new Response(JSON.stringify({
            error: 'Authentication Gateway Error',
            message: err.message,
            timestamp: new Date().toISOString()
        }), {
            status: 502,
            headers: applySecurityHeaders(new Headers({ 'Content-Type': 'application/json' }))
        });
    }
};
