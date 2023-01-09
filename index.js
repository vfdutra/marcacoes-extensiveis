const http = require('http');
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

//Get from the XML all the generos
let nodes = xpath.select('//topicMap/topic/instanceOf/topicRef[@href="#Genero"]/parent::*/following-sibling::baseName/baseNameString', doc);

//Get only the generos data of the nodes
let genres = nodes.map(node => node.firstChild.data.trim());

//Find the occurences inside the code there have a slash and remove its spaces
let generos = genres.map((genre) => {
    if(genre.includes('/')){
        genre = genre.replace(/\s\/\s/g, '/');        
    }

    return genre;
})


//Remove the repetition of the genres
let array = [...new Set(generos)]

//Find all the movies from 2000's
let movies_2000 = xpath.select('//association/member/topicRef[@href="#id_2000"]/../preceding-sibling::member/topicRef/@href', doc);

let movies_2 = movies_2000.map((movie) => movie.nodeValue.replace('#', '').replace('-', ' ').replace("id", "").replace("_", ""));

//Find all the movies with 'special' on the synopsis
let special_movies = xpath.select("//topic/occurrence/scope/topicRef[@href='#sinopse']/following::resourceData[contains(text(), 'especial')]/parent::*/preceding-sibling::occurrence/scope/topicRef[@href='#ingles']/../following-sibling::resourceData", doc);

let spe_movies = special_movies.map((movie) => movie.firstChild.data);

//Get the site from the thriller movies
let thriller_movies = xpath.select('//association/member/topicRef[@href="#thriller"]/../preceding-sibling::member/topicRef/@href', doc);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  switch(req.url){
    case '/generos': 
        var html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Generos</title>
          </head>
          <body>
            <h1>Generos</h1>
            <ul>
        `;
        array.forEach((genre) => {
            html += `<li>${genre}</li>`;
        });

        html += `
            </ul>
          </body>
        </html>
        `;
        res.end(html);
        break;

    case '/filmes-2000':  
        var html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Filmes do ano de 2000</title>
          </head>
          <body>
            <h1>Filmes do ano de 2000</h1>
            <ul>
        `;
        movies_2.forEach((movie) => {
            html += `<li>${movie}</li>`;
        });

        html += `
            </ul>
          </body>
        </html>
        `;
        res.end(html);
        break;

    case '/filmes-especiais':
      var html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Filmes Especiais</title>
        </head>
        <body>
          <h1>Filmes Especiais</h1>
          <ul>
      `;
      spe_movies.forEach((movie) => {
          html += `<li>${movie}</li>`;
      });

      html += `
          </ul>
        </body>
      </html>
      `;
      res.end(html);
      break;

    case '/filmes-thriller': {
        var html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Filmes Thriller</title>
          </head>
          <body>
            <h1>Filmes Thriller</h1>
            <ul>        
        `;
        thriller_movies.map((movie) => {
          let movie_name = movie.nodeValue.replace('#', '');   
          
          let movie_site_node = xpath.select(`//topicMap/topic[@id="${movie_name}"]/occurrence/resourceRef/@href`, doc);    
          
          let movie_site = movie_site_node.map(movie_node => movie_node.nodeValue);

          html += `<li>${movie_site}</li>`;       
      });
        html += `
        </ul>
        </body>
      </html>
      `;
      res.end(html);
      break;
    }

    default:  
        res.end('Hello World');
        break;
  }
});

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});
