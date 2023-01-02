var http = require('http');
const fs = require('fs');
const Libxml = require('node-libxml');

let libxml = new Libxml();
let xmlIsWellformed = libxml.loadXml('poema.xml');
libxml.loadDtds(['poema.dtd']);
let xmsIsValid = libxml.validateAgainstDtds();

http.createServer(function (req, res) {
    console.log(xmsIsValid);
    console.log(libxml.validationDtdErrors);
}).listen(8080);

