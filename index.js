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

//Find all the genres
let nodes = xpath.select('//topicMap/topic/instanceOf/topicRef[@href="#Genero"]/parent::*/following-sibling::baseName/baseNameString', doc);

let genres = nodes.map(node => node.firstChild.data.trim());

let generos = genres.map((genre) => {
    if(genre.includes('/')){
        genre = genre.replace(/\s\/\s/g, '/');        
    }

    return genre;
})

let array = [...new Set(generos)]

var questao_1 = `
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
            questao_1 += `<li>${genre}</li>`;
        });

        questao_1 += `
            </ul>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao01.html', questao_1, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('File created successfully!')
});

//Find all the movies from 2000's
let movies_2000 = xpath.select('//association/member/topicRef[@href="#id_2000"]/../preceding-sibling::member/topicRef/@href', doc);

let movies = movies_2000.map((movie) => movie.nodeValue.replace('#', '').replace('-', ' ').replace("id", "").replace("_", ""));

var questao_2 = `
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
        movies.forEach((movie) => {
            questao_2 += `<li>${movie}</li>`;
        });

        questao_2 += `
            </ul>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao02.html', questao_2, (err) => {
  if (err) {
      console.log(err);
      return;
  }
  console.log('File created successfully!')
});

// Find all the movies with 'special' on the synopsis
let special_movies = xpath.select("//topic/occurrence/scope/topicRef[@href='#sinopse']/following::resourceData[contains(text(), 'especial')]/parent::*/preceding-sibling::occurrence/scope/topicRef[@href='#ingles']/../following-sibling::resourceData", doc);

let spe_movies = special_movies.map((movie) => movie.firstChild.data);

var questao_3 = `
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
            questao_3 += `<li>${movie}</li>`;
        });

        questao_3 += `
            </ul>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao03.html', questao_3, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('File created successfully!')
});
        
// Get the site from the thriller movies
let thriller_movies = xpath.select('//association/member/topicRef[@href="#thriller"]/../preceding-sibling::member/topicRef/@href', doc);

var questao_4 = `
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

          questao_4 += `<li>${movie_site}</li>`;       
        });

          questao_4 += `
          </ul>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao04.html', questao_4, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('File created successfully!')
});

//Get the number of movies with more than 3 elenco-apoio
let $topics = xpath.select('//topic', doc); 

let $topic = $topics.map((topic) => {
  let $filme_id = topic.getAttribute('id');
  
  let $elencoApoio = xpath.select(`count(//topic[@id="${$filme_id}"]/occurrence/scope/topicRef[@href="#elencoApoio"])`, doc);  

  return $elencoApoio;
}).filter(n => n > 3).length;

var questao_5 = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Filmes Elenco Apoio</title>
          </head>
          <body>
            <h1>Filmes Com Elenco Apoio Maior que 3</h1>
            <p>${$topic}</p>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao05.html', questao_5, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('File created successfully!')
});

// //Get the number of ID's there have the name of one of it actors on the sinopse
let $associations = xpath.select('//association/instanceOf/topicRef[@href="#filme-elenco"]/../following-sibling::member[1]/topicRef/@href', doc);

let $actors_names = $associations.map((association) => {
  let $actors = xpath.select(`//association/member/topicRef[@href="${association.nodeValue}"]/../preceding-sibling::instanceOf/topicRef[@href="#filme-elenco"]/../following-sibling::member[2]/topicRef/@href`, doc)  

  return $actors;
});

let $array = [];

for(var i = 0; i < $actors_names.length; i++){
  for(var j = 0; j < $actors_names[i].length; j++){
    if($array.includes($actors_names[i][j].nodeValue)){
      continue; 
    }else{
      $array.push($actors_names[i][j].nodeValue);      
    }
  }
}

let $array_2 = $array.map((actor) => {
  let $actor = actor.replace('#', '').replace('-', ' ').replace("id", "").replace("_", "");
  $actor = $actor.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  return $actor;
});

let $filmes_id = $array_2.map((actor) => {
  let $sinopse = xpath.select(`//topic/occurrence/scope/topicRef[@href="#sinopse"]/following::resourceData[contains(text(), "${actor}")]/../../@id`, doc);
  return $sinopse;
});

let $array3 = []

for(var i = 0; i < $filmes_id.length; i++){
  for(var j = 0; j < $filmes_id[i].length; j++){
    if($array3.includes($filmes_id[i][j].nodeValue)){
      continue;
    }else{
      $array3.push($filmes_id[i][j].nodeValue);
    }
  }
}

var questao_6 = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />  
            <title>Filmes Elenco Atores</title>
          </head>
          <body>
            <h1>Filmes Elenco Atores>
            <ul>
        `;
        $array3.map((movie) => {
          questao_6 += `<li>${movie}</li>`;   
        });
          questao_6 += `          </ul>
          </body>
        </html>
        `;

fs.writeFile('consultas/questao06.html', questao_6, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log('File created successfully!')
});
