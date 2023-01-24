const Libxml = require('node-libxml');
let libxml = new Libxml();
libxml.loadXml('arquivo.xml');
libxml.loadDtds(['arquivo.dtd']);
let xmsIsValidBasedOfDTD = libxml.validateAgainstDtds();
// If the DTD validation generates errors, they are stored in the validationDtdErrors property
console.log(libxml.validationDtdErrors);

libxml.loadSchemas(['arquivo.xsd']);
let xmsIsValidBasedOfXSD = libxml.validateAgainstSchemas();
// If the XSD validation generates errors, they are stored in the validationSchemaErrors property
console.log(libxml.validationSchemaErrors);
