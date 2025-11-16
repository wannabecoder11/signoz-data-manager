const http = require('http');
const { parse } = require('path');
const url = require('url');
const server = http.createServer((req, res) => {
    const parsedURL = url.parse(req.url, true);
    const pathname = parsedURL.pathname;
    const query = parsedURL.query;
//    if (req.url === '/') {
       res.writeHead(200, {
                'Content-Type': 'text/html',
                'X-Powered-By': 'Node.js',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Set-Cookie': 'sessionid=abc123; HttpOnly'
            });

    //    res.write(JSON.stringify(req.url));
    //    res.end();
    console.log(query);
       res.end(JSON.stringify({
        pathname,
        query,
        fullUrl: req.url
            }, null, 2));
//    }
   
});

server.listen(3000);
console.log('Listening on Port 3000');

