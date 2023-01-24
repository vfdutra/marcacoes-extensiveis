var xpath = require('xpath'), dom = require('xmldom').DOMParser;
var fs = require('fs');
var xml = fs.readFileSync('arquivo.xml', 'utf8');
var doc = new dom().parseFromString(xml, 'text/xml');

const http = require('http');

if(!fs.existsSync('anos')){
    fs.mkdirSync('anos');
}

if(!fs.existsSync('atores')){
    fs.mkdirSync('atores');
}

if(!fs.existsSync('diretores')){
    fs.mkdirSync('diretores');
}

if(!fs.existsSync('duracoes')){
    fs.mkdirSync('duracoes');
}

if(!fs.existsSync('filmes')){
    fs.mkdirSync('filmes');
}
    
if(!fs.existsSync('generos')){
    fs.mkdirSync('generos');
}

let topic = xpath.select('//topicMap/topic/instanceOf/topicRef[@href="#Filme"]/../../@id', doc);
topic.forEach((movie, index) => {    
    let movie_id = movie.value;

    let movie_name = xpath.select(`//topicMap/topic[@id="${movie_id}"]/baseName/baseNameString`, doc);
    let movie_name_english = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#ingles"]/../following-sibling::resourceData`, doc);    
    let movie_distribution = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#distribuicao"]/../following-sibling::resourceData`, doc);
    let movie_sinopse = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#sinopse"]/../following-sibling::resourceData`, doc);
    let movie_supporting = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/scope/topicRef[@href="#elencoApoio"]/../following-sibling::resourceData`, doc);
    let movie_site = xpath.select(`//topicMap/topic[@id="${movie_id}"]/occurrence/instanceOf/topicRef[@href="#site"]/../following-sibling::resourceRef/@href`, doc);
    let movie_association_actors = xpath.select(`//association/member/topicRef[@href="#${movie_id}"]/../preceding-sibling::instanceOf/topicRef[@href="#filme-elenco"]/../following-sibling::member[2]/topicRef/@href`, doc);
    let movie_genre = xpath.select(`string(//association/member/topicRef[@href="#${movie_id}"]/../preceding-sibling::instanceOf/topicRef[@href="#filme-genero"]/../following-sibling::member[2]/topicRef/@href)`, doc);

    let movie_associations = xpath.select(`//*[@href="#${movie_id}"]/../following-sibling::member/topicRef/@href`, doc);

    if(movie_associations[0] != undefined){
        let movie_association_year = movie_associations[0].nodeValue.replace("#", "");
        var movie_year = xpath.select(`number(//topic[@id='${movie_association_year}']/baseName/baseNameString)`, doc);
    } else {
        var movie_year = null;
    }

    if(movie_associations[1] != undefined){
        let movie_association_director = movie_associations[1].nodeValue.replace("#", "");
            var movie_director = xpath.select(`string(//topic[@id='${movie_association_director}']/baseName/baseNameString)`, doc);
    } else {
        var movie_director = null;
    }
    
    if(movie_associations[2] != undefined){
        let movie_association_duration = movie_associations[2].nodeValue.replace("#", "");
            var movie_duration = xpath.select(`number(//topic[@id='${movie_association_duration}']/baseName/baseNameString)`, doc);
    } else {
        var movie_duration = null;
    }
    
    var movie_actors = []

    for(var i = 0; i < movie_association_actors.length; i++){
        movie_actors[i] = movie_association_actors[i].nodeValue.replace("#", "");
    }   

    movie_actors = movie_actors.filter(function(item, pos) {
        return movie_actors.indexOf(item) == pos;
    })

    var movie_supporting_actors = []
    for(var i = 0; i < movie_supporting.length; i++){
        movie_supporting_actors[i] = movie_supporting[i].firstChild.data;
    }

    movie_supporting_actors = movie_supporting_actors.filter(function(item, pos) {
        return movie_supporting_actors.indexOf(item) == pos;
    })

    var html = `
          <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>${movie_name[0].firstChild.data}</title>
            </head>
            <body>
                <h1>${movie_name[0].firstChild.data}</h1>`
                
                if(movie_name_english[0].firstChild.data != null){
                    html += `<h5>${movie_name_english[0].firstChild.data}</h5>`
                }

                if(movie_year != null || movie_year != undefined) html += `<h4><a href="../anos/${movie_year}.html" target="_blank">(${movie_year})</a></h4>`;

                if(movie_director != null && movie_director != undefined){
                    movie_director_page = movie_director.replace(" ", "-").toLowerCase();                    
                    html += `<h3>Diretor - <a href="../diretores/${movie_director_page}.html" target="_blank">${movie_director}</a></h3>`;
                }

                if(movie_duration != null && movie_duration != undefined && !isNaN(movie_duration)){
                    html += `<h3>Duração - <a href="../duracoes/${movie_duration}.html" target="_blank">${movie_duration}</a> minutos</h3>`;
                }

                if(movie_distribution[0] != null && movie_distribution[0] != undefined){
                    html += `<h3>Distribuição - ${movie_distribution[0].firstChild.data}</h3>`;
                }

                if(movie_sinopse[0] != null && movie_sinopse[0] != undefined){
                    html += `<h3>Sinopse - ${movie_sinopse[0].firstChild.data}</h3>`;
                }

                if(movie_actors[0] != null && movie_actors[0] != undefined){
                    html += `<h3>Atores principais</h3>`
                    movie_actors.forEach((actor) => {
                        actor_name = xpath.select(`string(//topicMap/topic[@id="${actor}"]/baseName/baseNameString)`, doc);
                        html += `<h4><a href="../atores/${actor}.html" target="_blank">${actor_name}</a></h4>`;           
                    });
                }   
              
                if(movie_supporting_actors[0] != null && movie_supporting_actors[0] != undefined){
                    html += `<h3>Atores suporte</h3>`
                    movie_supporting_actors.forEach((supporting) => {                                                
                        html += `<h4><a href="../atores/${supporting}.html" target="_blank">${supporting}</a><h4>`;
                    });
                }
               
                if(movie_site[0] != null && movie_site[0] != undefined){
                    html += `<h3>Site - ${movie_site[0].value}</h3>`
                }

                if(movie_genre != null && movie_genre != undefined){
                    html += `<h3>Genero - <a href="../generos/${movie_genre.replace("#", "")}.html" target="_blanl">${movie_genre.replace("#", "")}</a> </h3>`
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


let all_actors = xpath.select(`//association/instanceOf/topicRef[@href="#filme-elenco"]/../following-sibling::member[2]/topicRef/@href`, doc);

all_actors.forEach((actor) => {
    actor_id = actor.nodeValue

    let actor_movies = xpath.select(`//association/member/topicRef[@href="${actor_id}"]/../preceding-sibling::member/topicRef/@href`, doc)

    var html_actors = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${actor_id}</title>
                    </head>
                    <body>`;
                    html_actors += `<h1>${actor_id.replace("#","").replace("-", " ")}</h1>`
                    actor_movies.forEach((movie) => {
                        html_actors += `<h2><a href="../filmes/${movie.nodeValue.replace("#", "")}.html" target="_blank">${movie.nodeValue.replace("#","").replace("-", " ")}</a></h2>`
                     })
                html_actors += `</body></html>`;

    fs.writeFileSync(`atores/${actor_id.replace("#","")}.html`, html_actors, (err) => {
             if(err) {
                 console.log(err);
                 return;
             }    
             console.log('File created successfully!');
        });
})

let all_directors = xpath.select(`//association/instanceOf/topicRef[@href="#filme-direcao"]/../following-sibling::member[2]/topicRef/@href`, doc);

all_directors.forEach((director) => {
    director_id = director.nodeValue

    let director_movies = xpath.select(`//association/member/topicRef[@href="${director_id}"]/../preceding-sibling::member/topicRef/@href`, doc)

    var html_directors = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${director_id}</title>
                    </head>
                    <body>`;
                    html_directors += `<h1>${director_id.replace("#","").replace("-", " ")}</h1>`
                    director_movies.forEach((movie) => {
                        html_directors += `<h2><a href="../filmes/${movie.nodeValue.replace("#", "")}.html" target="_blank">${movie.nodeValue.replace("#","").replace("-", " ")}</a></h2>`
                     })
                html_directors += `</body></html>`;

    fs.writeFileSync(`diretores/${director_id.replace("#","")}.html`, html_directors, (err) => {
                if(err) {
                    console.log(err);
                    return;
                }    
                console.log('File created successfully!');
            });
});

let all_years = xpath.select(`//association/instanceOf/topicRef[@href="#filme-ano"]/../following-sibling::member[2]/topicRef/@href`, doc);

all_years.forEach((year) => {
    year_id = year.nodeValue

    let year_movies = xpath.select(`//association/member/topicRef[@href="${year_id}"]/../preceding-sibling::member/topicRef/@href`, doc)

    var html_years = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${year_id.replace("#", "").replace("_", "").replace("id", "")}</title>
                    </head>
                    <body>`;
                    html_years += `<h1>${year_id.replace("#", "").replace("_", "").replace("id", "")}</h1>`
                    year_movies.forEach((movie) => {
                        html_years += `<h2><a href="../filmes/${movie.nodeValue.replace("#", "")}.html" target="_blank">${movie.nodeValue.replace("#","").replace("-", " ")}</a></h2>`
                     })
                html_years += `</body></html>`;
    fs.writeFileSync(`anos/${year_id.replace("#", "").replace("_", "").replace("id", "")}.html`, html_years, (err) => {
                if(err) {
                    console.log(err);
                    return;
                }    
                console.log('File created successfully!');
            } )
});

let all_genres = xpath.select(`//association/instanceOf/topicRef[@href="#filme-genero"]/../following-sibling::member[2]/topicRef/@href`, doc);

all_genres.forEach((genre) => {
    genre_id = genre.nodeValue

    let genre_movies = xpath.select(`//association/member/topicRef[@href="${genre_id}"]/../preceding-sibling::member/topicRef/@href`, doc)

    var html_genres = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${genre_id}</title>
                    </head>
                    <body>`;
                    html_genres += `<h1>${genre_id.replace("#","").replace("-", " ")}</h1>`
                    genre_movies.forEach((movie) => {
                        html_genres += `<h2><a href="../filmes/${movie.nodeValue.replace("#", "")}.html" target="_blank">${movie.nodeValue.replace("#","").replace("-", " ")}</a></h2>`
                     })
                html_genres += `</body></html>`;

    fs.writeFileSync(`generos/${genre_id.replace("#","")}.html`, html_genres, (err) => {
                if(err) {
                    console.log(err);
                    return;
                }    
                console.log('File created successfully!');
            });
})

let all_durations = xpath.select(`//association/instanceOf/topicRef[@href="#filme-duracao"]/../following-sibling::member[2]/topicRef/@href`, doc);

all_durations.forEach((duration) => {
    duration_id = duration.nodeValue

    let duration_movies = xpath.select(`//association/member/topicRef[@href="${duration_id}"]/../preceding-sibling::member/topicRef/@href`, doc)

    var html_durations = `<!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8" />
                        <title>${duration_id.replace("#", "").replace("_", "").replace("id", "")}</title>
                    </head>
                    <body>`;
                    html_durations += `<h1>${duration_id.replace("#", "").replace("_", "").replace("id", "")}</h1>`
                    duration_movies.forEach((movie) => {
                        html_durations += `<h2><a href="../filmes/${movie.nodeValue.replace("#", "")}.html" target="_blank">${movie.nodeValue.replace("#","").replace("-", " ")}</a></h2>`
                     })
                html_durations += `</body></html>`;

    fs.writeFileSync(`duracoes/${duration_id.replace("#", "").replace("_", "").replace("id", "")}.html`, html_durations, (err) => {
                if(err) {
                    console.log(err);
                    return;
                }    
                console.log('File created successfully!');
            });
})