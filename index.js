var xpath = require('xpath'), dom = require('xmldom').DOMParser;
var fs = require('fs');
var xml = fs.readFileSync('arquivo.xml', 'utf8');
var doc = new dom().parseFromString(xml, 'text/xml');

const express = require('express');
const app = express();
app.use(express.static('public'));

let topic = xpath.select('//topicMap/topic/instanceOf/topicRef[@href="#Filme"]/../../@id', doc);
topic.forEach((movie, index) => {    
    let movie_id = movie.value;

    let movie_name = xpath.select(`//topicMap/topic[@id="${movie_id}"]/baseName/baseNameString`, doc);
    let movie_name_english = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#ingles"]/../following-sibling::resourceData`, doc);    
    let movie_distribution = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#distribuicao"]/../following-sibling::resourceData`, doc);
    let movie_sinopse = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#sinopse"]/../following-sibling::resourceData`, doc);
    let movie_supporting = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#elencoApoio"]/../following-sibling::resourceData`, doc);
    let movie_site = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/instanceOf/topicRef[@href="#site"]/../following-sibling::resourceRef/@href`, doc);

    let movie_associations = xpath.select(`//*[@href="#${movie_id}"]/../following-sibling::member/topicRef/@href`, doc);

    let movie_association_year = movie_associations[0].nodeValue.replace("#", "");
        let movie_year = xpath.select(`number(//topic[@id='${movie_association_year}']/baseName/baseNameString)`, doc);

    let movie_association_director = movie_associations[1].nodeValue.replace("#", "");
        let movie_director = xpath.select(`string(//topic[@id='${movie_association_director}']/baseName/baseNameString)`, doc);

    let teste = movie_associations[2].nodeValue.replace("#", "");
    
    if(/^\d+$/.test(teste)){               
        let movie_duration = xpath.select(`number(//topic[@id='${teste}']/baseName/baseNameString)`, doc);
        console.log(movie_duration)
    }

    let movie_actors= []
    let movie_genre = movie_associations[3].nodeValue;

    var html = `
          <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>${movie_name[0].firstChild.data}</title>
            </head>
            <body>
                <h1>${movie_name[0].firstChild.data}</h1>`;

                if(movie_name_english[0].firstChild.data != null){
                    html += `<h5>${movie_name_english[0].firstChild.data}</h5>`
                }

                if(movie_distribution[0] != null || movie_distribution[0] != undefined){
                    html += `<h3>Distribuição - ${movie_distribution[0].firstChild.data}</h3>`;
                }

                if(movie_sinopse[0] != null || movie_sinopse[0] != undefined){
                    html += `<h3>Sinopse - ${movie_sinopse[0].firstChild.data}</h3>`;
                }

                if(movie_supporting === Array){
                    html += `<h3>Atores suporte</h3>`
                    movie_supporting.forEach((supporting) => {                                                
                        html += `<h4>${supporting.firstChild.data}</h4>`;
                    });
                } else if (movie_supporting[0] != null || movie_supporting[0] != undefined) {
                    html += `<h3>Atores suporte:</h3>`
                    html += `<h4>${movie_supporting[0].firstChild.data}</h4>`;
                }

                if(movie_site[0] != null || movie_site[0] != undefined){
                    html += `<h3>Site - ${movie_site[0].value}</h3>`
                }

        html += `
            </body>
        </html>
        `;    

    fs.writeFileSync(`filmes/${movie_id}.html`, html, (err) => {
        if(err) {
            console.log(err);
            return;
        }    
        console.log('File created successfully!');
    });
});

var html = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>Index</title>
                    </head>
                    <body>`;
                    

topic.forEach((movie, index) => {    
    let movie_id = movie.value;

    let movie_name = xpath.select(`//topicMap/topic[@id="${movie_id}"]/baseName/baseNameString`, doc);   
                
    
    html += `<h1><a href="filmes/${movie_id}.html">${movie_name[0].firstChild.data}</a></h1>`      
});

html += `</body></html>`;

fs.writeFileSync(`index.html`, html, (err) => {
    if(err) {
        console.log(err);
        return;
    }    
    console.log('File created successfully!');
});   
