import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { createClient, Row } from '@clickhouse/client' // or '@clickhouse/client-web'
import * as z from "zod";
import { isStringObject } from 'util/types';
import { ParsedUrlQuery } from 'querystring';
// import { isArray } from 'util';
// import type { ResultJSONType } from '@clickhouse/client-common' // or '@clickhouse/client-web'

const client = createClient({
  url: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? '',
}); // adjust config



type labelKeyString = "deployment.environment" | "host.name" | "k8s.cluster.name" | "k8s.container.name" | "k8s.deployment.name" | "k8s.node.name" | "k8s.daemonset.name"




type queryParm =  string | string[] | undefined
let distinctEnv: Array<string>
let distinctHost: Array<string>
let distinctDeploy: Array<string>
let distinctDaemon: Array<string>
let distinctCluster: Array<string>

interface RowJson {
  labels: string; // JSON string of Labels
}

let allRows: RowJson[]

const dateSchema = z.coerce.date();

// Usage example
// const result = dateSchema.safeParse("2025-12-04"); // true if valid date string



async function getDistinctResources() {
  try {
    const resultSet = await client.query({
      query: `SELECT DISTINCT labels
      FROM signoz_logs.logs_v2_resource
      Limit 10000; `,

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
    // console.log(`distinct envs are ${ distinctEnv } `); // allRows is an array of row objects
    // console.log(`distinct Hosts are ${ distinctHost } `); // allRows is an array of row objects
    // console.log(`distinct Deployments are ${ distinctDeploy } `); // allRows is an array of row objects
    // console.log(`distinct Daemonsets are ${ distinctDaemon } `); // allRows is an array of row objects
    // console.log(`distinct Clusters are ${ distinctCluster } `); // allRows is an array of row objects

    getDaemonSets(["trg-env"], allRows)
    getDeployments(["trg-env"], allRows)

  } catch (err) {
    console.error('Query error:', err);
  }
}

function getDaemonSets(selectedClusters: Array<string> | string | undefined, allResources: RowJson[]): Array<string> {
  if (Array.isArray(selectedClusters) || (typeof (selectedClusters) === 'string')) {
    const filteredResources = allResources.filter((resource) => selectedClusters.includes(JSON.parse(resource.labels)["k8s.cluster.name"]))
    const filteredDaemon = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["k8s.daemonset.name"]))];
    console.log('Filtered daemonsets are' + filteredDaemon);
    return filteredDaemon;
  } else {
    console.log(typeof (selectedClusters))
    return []
  }
  ;
};

function getDeployments(selectedClusters: Array<string> | string | undefined, allResources: RowJson[]): Array<string> {
  if (Array.isArray(selectedClusters) || (typeof (selectedClusters) === 'string')) {

    const filteredResources = allResources.filter((resource) => selectedClusters.includes(JSON.parse(resource.labels)["k8s.cluster.name"]))
    const filteredDeployments = [...new Set(filteredResources.map(obj => JSON.parse(obj.labels)["k8s.deployment.name"]))];
    console.log('Filtered deployments are' + filteredDeployments);

    return filteredDeployments;
  } else {
    console.log(typeof (selectedClusters))
    return []
  }
};

function getClusters(allResources: RowJson[]): Array<string> {
  const filteredEnvs = [...new Set(allResources.map(obj => JSON.parse(obj.labels)["k8s.cluster.name"]))];
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

function makeSqlArray(a: string | string[] | undefined) {
  if (Array.isArray(a) || (typeof (a) === 'string')) {
    try {
      let labelValueSQL: string[] | string
      if (Array.isArray(a)) {
        labelValueSQL = `${a.join("','")}`
      } else {
        labelValueSQL = `${a}`;
      }
      return labelValueSQL; 
    } catch(err) {
      console.log(`Error in converting to SQL Array: ${err}`)
    }
  }
}

async function getLogs(labelValueString: queryParm, labelKeyString: labelKeyString, fromDate: queryParm, toDate: queryParm, logLevel: queryParm, statusCode: queryParm) {

  // schema validation for dates
  const parsedFromDate = dateSchema.safeParse(fromDate);
  const parsedToDate = dateSchema.safeParse(toDate);
  if (!parsedFromDate.success) {
    throw new Error(`Invalid fromDate: ${parsedFromDate.error.message}`);
  }
  if (!parsedToDate.success) {
    throw new Error(`Invalid toDate: ${parsedToDate.error.message}`);
  }
  
  let logLevelSQL = makeSqlArray(logLevel)
  let statusCodeSQL = `${makeSqlArray(statusCode)}`
  let labelValueSQL = makeSqlArray(labelValueString);
  let labelKeySQL = makeSqlArray(labelKeyString)

  const first4logs = await client.query({
        query: `SELECT * FROM signoz_logs.logs_v2
                WHERE
                     resource_fingerprint IN (
                          SELECT fingerprint
                          FROM signoz_logs.logs_v2_resource
                          WHERE simpleJSONExtractString(labels, '${labelKeySQL}') in ('${labelValueSQL}')
                       )
                AND ts_bucket_start <= ${parsedToDate.data.getTime()/1000} --current date in epoch seconds
                AND ts_bucket_start >= ${parsedFromDate.data.getTime()/1000} --current date
                ${logLevel ? `AND attributes_string['level'] in (${logLevelSQL})` : ''}
                ${statusCode ? `AND attributes_number['status'] in (${statusCodeSQL})` : ''}
                ORDER BY timestamp ASC
                LIMIT 4`,
        format: 'JSONEachRow',
      });
      const last4logs = await client.query({
        query: `SELECT * FROM signoz_logs.logs_v2
                WHERE
                     resource_fingerprint IN (
                          SELECT fingerprint
                          FROM signoz_logs.logs_v2_resource
                          WHERE simpleJSONExtractString(labels, '${labelKeySQL}') in ('${labelValueSQL}')
                       )
                AND ts_bucket_start <= ${parsedToDate.data.getTime()/1000} --current date
                AND ts_bucket_start >= ${parsedFromDate.data.getTime()/1000} --current date
                ${logLevel ? `AND attributes_string['level'] in (${logLevelSQL})` : ''}
                ${statusCode ? `AND attributes_number['status'] in (${statusCodeSQL})` : ''}
                ORDER BY timestamp DESC
                LIMIT 4`,
        format: 'JSONEachRow',
      });

      // fetch all results as JSON array
      const parsedfirst4logs = await first4logs.json();
      const parsedlast4logs = await last4logs.json();

      return { parsedfirst4logs, parsedlast4logs };

    };
const server = http.createServer()

server.on('request', (req, res) => {
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
        console.log(JSON.stringify(query));
        res.write(`${query.fromDate}`)
        res.end();
      }
      if (req.url.startsWith('/api/clusters')) {
        res.write((JSON.stringify(getClusters(allRows))))
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
      if (req.url.startsWith('/api/hostlogs')) {
        console.log(`The list of hosts recived ${query.host} `);
        console.log('calling getHostLogs function');

        getLogs(query.host, "host.name", query.fromDate, query.toDate, query.level, query.status).then((e) => {
          res.write((JSON.stringify(e)))
          res.end();
        })

      }
      if (req.url.startsWith('/api/daemonlogs')) {
        console.log(`The list of daemonsets recived ${query.daemonsets} `);
        console.log('calling getLogs function');

        getLogs(query.daemonsets, "k8s.daemonset.name", query.fromDate, query.toDate, query.level, query.status).then((e) => {
          res.write((JSON.stringify(e)))
          res.end();
        })

      }
      if (req.url.startsWith('/api/deploylogs')) {
        console.log(`The list of deployments recived ${query.deployments} `);
        console.log('calling getLogs function');

        getLogs(query.deployments, "k8s.deployment.name", query.fromDate, query.toDate, query.level, query.status).then((e) => {
          res.write((JSON.stringify(e)))
          res.end();
        })

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

      const contentType: string = mimeTypes[extname] || 'application/octet-stream';


      fs.readFile(path.join(__dirname, "../../frontend/dist", filePath), (error, content) => {
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

getDistinctResources().catch(console.error);
server.listen(3000);
console.log('Listening on Port 3000');
