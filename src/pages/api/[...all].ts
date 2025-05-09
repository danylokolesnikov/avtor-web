import { IncomingMessage, ServerResponse } from 'http';
import httpProxy from 'http-proxy';
import { parse } from 'url';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default (req: IncomingMessage, res: ServerResponse<IncomingMessage>) =>
  new Promise((resolve, reject) => {
    const proxy = httpProxy.createProxy();

    const parsedUrl = parse(req.url || '', true);
    if (parsedUrl.pathname?.startsWith('/api')) {
      parsedUrl.pathname = parsedUrl.pathname.replace(/^\/api/, '');
      req.url = parsedUrl.pathname + (parsedUrl.search || '');
    }

    proxy
      // @ts-ignore
      .once('proxyRes', (proxyRes) => {
        const cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
          const currentHost = req.headers.host?.split(':')[0];
          proxyRes.headers['set-cookie'] = cookies.map((cookie: string) =>
            cookie.replace(
              /Domain=[^;]+/i,
              `Domain=.${currentHost || 'localhost'}`,
            ),
          );
        }
        resolve(proxyRes);
      })
      // @ts-ignore
      .once('error', (err) => {
        console.error('Proxy error:', err);
        reject(err);
      })
      .web(req, res, {
        changeOrigin: true,
        target: process.env.NEXT_PUBLIC_API_URL,
      });
  });
