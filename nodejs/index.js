const http = require('http');

const server = http.createServer(async (req, res) => {
    if (req.url === '/hello' && req.method === 'GET') {
        res.writeHead(200);
        res.end();
    } else if (req.url === '/secret' && req.method === 'GET') {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
            return;
        }

        const timeout = 5000; // 5 seconds timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        );

        try {
            const response = await Promise.race([
                fetch(process.env.USER_FETCH_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': authHeader
                    }
                }),
                timeoutPromise
            ]);

            await response.text();
            res.writeHead(response.status, { 'Content-Type': 'text/plain' });
            res.end(process.env.SECRETS);
        } catch (error) {
            if (error.message === 'Request timed out') {
                res.writeHead(504, { 'Content-Type': 'text/plain' });
                res.end('Gateway Timeout');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
server.timeout = 5000;
