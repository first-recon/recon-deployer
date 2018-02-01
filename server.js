const Express = require('express');
const fs = require('fs');
const shell = require('shelljs');
const path = require('path');
const bodyParser = require('body-parser');

const server = Express();

server.use(bodyParser.json());

const global = {
  isBuilding: false,
  lastBuildSucceeded: null
};

server.get('/build/android/beta', (req, res) => {
  try {
    res.download('../great-scoutt/build/android/great-scoutt.apk');
  } catch (e) {
    res.status(500).send('error downloading file');
  }
});

server.get('/build/status/log', (req, res) => res.send(JSON.stringify({
  log: fs.readFileSync('./server.log').toString()
})));

server.get('/build/status', (req, res) => res.send(global));

server.post('/build', (req, res) => {
  if (req.body.action === 'closed' && req.body.pull_request.merged) {
    fs.readFile('build-script.sh', (err, data) => {
      const buildScript = data.toString();
      if (err) {
        global.lastBuildSucceeded = false;
        res.send({ success: false, isBuilding: false, message: err });
      } else if (!buildScript.length) {
        global.lastBuildSucceeded = false;
        res.send({ success: false, isBuilding: false, message: 'build script is empty!!' });
      } else {
        global.isBuilding = true;
        shell.exec(buildScript, { async: true }, (code) => {
          global.lastBuildSucceeded = !code;
          global.isBuilding = false;
        });
        res.send({ success: true, isBuilding: true, message: 'build commencing, check back in about a minute' });
      }
    });
  } else {
    res.status(204).send({ success: true, isBuilding: false, message: 'no build triggered' });
  }
});

server.listen(80);
