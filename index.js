const Libxml = require('node-libxml');
let libxml = new Libxml();
libxml.loadXml('arquivo.xml');

libxml.loadDtds(['arquivo.dtd']);
let xmsIsValidBasedOfDTD = libxml.validateAgainstDtds();

libxml.loadSchemas(['arquivo.xsd']);
let xmsIsValidBasedOfXSD = libxml.validateAgainstSchemas();

// console.log(xmsIsValidBasedOfDTD);
// If the DTD validation generates errors, they are stored in the validationDtdErrors property
// console.log(libxml.validationDtdErrors);

// console.log(xmsIsValidBasedOfXSD);
// If the XSD validation generates errors, they are stored in the validationSchemaErrors property
// console.log(libxml.validationSchemaErrors);

var xpath = require('xpath'), dom = require('xmldom').DOMParser;
var fs = require('fs');
var xml = fs.readFileSync('arquivo.xml', 'utf8');
var doc = new dom().parseFromString(xml, 'text/xml');

//Get from the XML all the generos from the arquivo.xml
let nodes = xpath.select('//topicMap/topic/instanceOf/topicRef[@href="#Genero"]/parent::*/following-sibling::baseName/baseNameString', doc);

//Get the values of the baseNameString without repetition
let genres = nodes.map(node => node.firstChild.data.trim());

let generos = genres.map((genre) => {
    if(genre.includes('/')){
        genre = genre.replace(/\s\/\s/g, '/');        
    }

    return genre;
})

let array = [...new Set(generos)]

console.log(array);