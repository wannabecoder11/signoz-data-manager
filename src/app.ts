import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { createClient, Row } from '@clickhouse/client' // or '@clickhouse/client-web'
import { isStringObject } from 'util/types';
// import { isArray } from 'util';
// import type { ResultJSONType } from '@clickhouse/client-common' // or '@clickhouse/client-web'

const client = createClient({
  url: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? '',
}); // adjust config
// let resultJSON

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
              AND timestamp >= 1764231850000000000
              AND timestamp <= 1764318250000000000
              ORDER BY timestamp ASC
              LIMIT 3000`,
      format: 'JSONEachRow',
    });

    const stream = resultSet.stream();
    // fetch all results as JSON array
    //const allRows = await resultSet.json();
    //resultJSON = allRows;

    // console.log(allRows); // allRows is an array of row objects
    stream.on('data', (rows: Row[]) => {
      rows.forEach((row: Row) => {
        console.log(row.json()); // 'row' is already parsed JSON object
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



// run().catch(console.error);


let distinctEnv: Array<string>
let distinctHost: Array<string>
let distinctDeploy: Array<string>
let distinctDaemon: Array<string>
let distinctCluster: Array<string>

interface RowJson {
  labels: string; // JSON string of Labels
}

let allRows: RowJson[]

async function getDistinctResources() {
  try {
    const resultSet = await client.query({
      query: `SELECT DISTINCT labels
      FROM signoz_logs.logs_v2_resource
      Limit 10000;`,

      format: 'JSONEachRow',
    });
    // fetch all results as JSON array
    allRows = await resultSet.json();

    // distinctEnv = allRows.map((row: Row) => console.log(JSON.parse(row.json().labels)["deployment.environment"]))
    //    const stream = resultSet.stream();
    //    stream.on('data', (rows: Row[]) => {
    //      distinctEnv = rows.map((row: Row) => console.log(JSON.parse(row.json().labels)["deployment.environment"]))
    //   });
    //   });

    // console.log(allRows)
    distinctEnv = [...new Set(allRows.map((obj) => JSON.parse(obj.labels)["deployment.environment"]))];
    // distinctHost = [...new Set(allRows.map(obj => JSON.parse(obj.labels)["host.name"]))];
    // distinctDeploy = [...new Set(allRows.map(obj => JSON.parse(obj.labels)["k8s.deployment.name"]))];
    // distinctDaemon = [...new Set(allRows.map(obj => JSON.parse(obj.labels)["k8s.daemonset.name"]))];
    distinctCluster = [...new Set(allRows.map(obj => JSON.parse(obj.labels)["k8s.cluster.name"]))];
    console.log('Fetching resouces complete')
    // console.log(`distinct envs are ${distinctEnv}`); // allRows is an array of row objects
    // console.log(`distinct Hosts are ${distinctHost}`); // allRows is an array of row objects
    // console.log(`distinct Deployments are ${distinctDeploy}`); // allRows is an array of row objects
    // console.log(`distinct Daemonsets are ${distinctDaemon}`); // allRows is an array of row objects
    // console.log(`distinct Clusters are ${distinctCluster}`); // allRows is an array of row objects

    getDaemonSets(["trg-env"], allRows)
    getDeployments(["trg-env"], allRows)

  } catch (err) {
    console.error('Query error:', err);
  }
}
getDistinctResources().catch(console.error);

const server = http.createServer()
server.on('request',(req, res) => {
  if (req.url) {
  const parsedURL = url.parse(req.url, true);
  const pathname = parsedURL.pathname;
  const query = parsedURL.query;
   
  if (req.url.startsWith('/api')) {
    // if (req.url === '/api/distinct') {
    //   res.write(JSON.stringify({ distinctEnv, distinctHost, distinctDeploy, distinctDaemon, distinctCluster }))
    //   res.end();
    // }
    if (req.url.startsWith('/api/fetch')) {
      console.log(query)
      res.end();
    }
    if (req.url.startsWith('/api/clusters')) {
      res.write((JSON.stringify(distinctCluster)))
      res.end();
    }
    if (req.url.startsWith('/api/daemonsets')) {
      console.log(query)
        res.write((JSON.stringify(getDaemonSets(query.clusters, allRows))))
      res.end();
    }
    if (req.url.startsWith('/api/deployments')) {
      console.log(JSON.stringify(query))
      res.write((JSON.stringify(getDeployments(query.clusters, allRows))))
      res.end();
    }
    if (req.url.startsWith('/api/hosts')) {
      console.log(query)
      res.write((JSON.stringify(getHosts(allRows))))
      res.end();
    }

  } else {     // Only serve index.html for the root path
    const filePath = req.url === '/' ? '/index.html' : req.url;

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };

    const contentType: string =  mimeTypes[extname] || 'application/octet-stream';


    fs.readFile(path.join(__dirname, "/frontend", filePath), (error, content) => {
      if (error) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  }
  }
});

server.listen(3000);
console.log('Listening on Port 3000');

function getDaemonSets(selectedClusters: Array<string>| string | undefined, allResources: RowJson[]): Array<string> {
  if (Array.isArray(selectedClusters) || isStringObject(selectedClusters)) {
      const filteredResources = allResources.filter((resource) => selectedClusters.includes(JSON.parse(resource.labels)["k8s.cluster.name"]))
      const filteredDaemon = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["k8s.daemonset.name"]))];
      console.log('Filtered daemonsets are' + filteredDaemon);
      return filteredDaemon;
  } else  {
      return [] 
  }
;}
function getDeployments(selectedClusters: Array<string>| string | undefined, allResources: RowJson[]): Array<string> {
  if (Array.isArray(selectedClusters) || isStringObject(selectedClusters)) {

  const filteredResources = allResources.filter((resource) => selectedClusters.includes(JSON.parse(resource.labels)["k8s.cluster.name"]))
  const filteredDeployments = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["k8s.deployment.name"]))];
  console.log('Filtered deployments are' + filteredDeployments);

  return filteredDeployments;
  } else  {
      return [] 
  }
};


function getClusters(selectedEnvs: Array<string>, allResources: RowJson[]): Array<string> {
  const filteredResources = allResources.filter((resource) => selectedEnvs.includes(JSON.parse(resource.labels)["deployment.environment "]))
  const filteredEnvs = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["k8s.cluster.name"]))];
  console.log('Filtered Envs are: ' + filteredEnvs);

  return filteredEnvs;
};

function getHosts(allResources: RowJson[]) {
  // removing all hosts which has k8s.cluster.name in it's string
  const filteredResources = allResources.filter((resource) => !Object.keys(JSON.parse(resource.labels)).includes("k8s.cluster.name"));
  // finding distinct values
  const filteredHosts = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["host.name"]))];
  return filteredHosts;
};
