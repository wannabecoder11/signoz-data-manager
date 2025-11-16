const http = require('http');
const { parse } = require('path');
const url = require('url');
const { createClient } = require('@clickhouse/client');



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

const client = createClient({
        url: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
        username: process.env.CLICKHOUSE_USER ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '', }); // adjust config

async function run() {
  try {
    const resultSet = await client.query({
      query: `SELECT * FROM signoz_logs.logs_v2
              WHERE
                  resource_fingerprint IN (
                      SELECT fingerprint 
                      FROM signoz_logs.logs_v2_resource 
                      WHERE simpleJSONExtractString(labels, 'k8s.cluster.name') = 'test-env'
                  )
              AND timestamp >= 1763014613000000000
              AND timestamp <= 1763015111000000000
              ORDER BY timestamp ASC
              LIMIT 10`,
      format: 'JSONEachRow',
    });

    const stream = resultSet.stream();
    stream.on('data', (rows) => {
      rows.forEach(row => {
        console.log(row); // 'row' is already parsed JSON object
      });
    });

    stream.on('end', () => {
      console.log('Completed!');
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    console.error('Query error:', err);
  }
}



run().catch(console.error);