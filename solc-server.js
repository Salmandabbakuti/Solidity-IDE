const solc = require('solc')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Content-Type", "application/json")
    next();
})

app.post('/compile', function (req, res) {

    const sources = {};
    for(let key in req.body) {
        sources[key] = {
            content: req.body[key]
        };
    }
    const input = {
        language: 'Solidity',
        sources: sources,
        settings: {
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    }

    const output = solc.compile(JSON.stringify(input))
    res.end(output)
})

app.get('/shutdown', function() {
    console.log('IDE closed, exiting.')
    process.exit(0)
})

app.listen(8081, function () {
    console.log('Started solc server on port 8081.')
})

setTimeout(function() {
    console.log("Starting ganache.")
    require('ganache-cli/cli')
}, 1);

if(process.argv && process.argv[2] == 'ide') {
    const url = 'file://' + __dirname + '/dist/index.html';
    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
}