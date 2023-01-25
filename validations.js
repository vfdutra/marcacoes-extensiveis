const Libxml = require('node-libxml');
let libxml = new Libxml();
libxml.loadXml('arquivo.xml');

libxml.loadDtds(['arquivo.dtd']);
let xmsIsValidBasedOfDTD = libxml.validateAgainstDtds();

libxml.loadSchemas(['arquivo.xsd']);
let xmsIsValidBasedOfXSD = libxml.validateAgainstSchemas();

if(libxml.validationDtdErrors) {
    console.log(libxml.validationDtdErrors);
} else {
    console.log('De acordo com o DTD carregado, o XML é valido');
}

if(libxml.validationSchemaErrors) {
    console.log(libxml.validationSchemaErrors);
} else {
    console.log('De acordo com o XML Schema carregado, o XML é valido');
}
