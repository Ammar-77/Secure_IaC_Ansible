const http = require('http');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

//Enable CORS for the specified origin
app.use(
  cors({
    origin: '*', // Replace with the allowed origin
    methods: 'GET, POST, OPTIONS', // Allow the specified HTTP methods
  })
);


const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*'); // You can restrict this to specific origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'POST') {

      // Create a connection to the database
      const connection = mysql.createConnection({
        host: '91.70.121.49',
        port : '3306',
        user: 'root',
        password: 'hardtoguess1',
        database: 'TestDB',
      });
      
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to MariaDB: ' + err.stack);
          return;
        }
        console.log('Connected to MariaDB as ID ' + connection.threadId);
      });
      let data = '';

      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {

        const responseString = data.replace(/"/g, ""); // choped the quations

         const sql = 'SELECT job FROM jobs WHERE name = ?';

        connection.query(sql, [responseString], (err, results) => {
          if (err) {
            console.error('Error querying MariaDB: ' + err.stack);
            return;
          }

          // Process the query results
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
         const jss = JSON.stringify(results);

         res.end(jss);
          // Close the connection
          connection.end((err) => {
            if (err) {
              console.error('Error closing MariaDB connection: ' + err.stack);
              return;
            }
            console.log('Connection closed.');
          });
	});


      });
    } else if (req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello, world!');
    } else {
      res.statusCode = 404;
      res.end('Not Found....');
    }
  });

  const port = 3300;
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
      