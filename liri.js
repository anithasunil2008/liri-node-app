require("dotenv").config();

var fs = require('fs');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var action = process.argv[2];
var movie = process.argv[3];

//twitter function goes here
function myTweets() {
    var params = { screen_name: 'nodejs' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log('Error Occured in twitter: ' + error);
        }
        console.log("================================ Twitter - Last 20 tweets ===========================");
        tweets.forEach(function(element, index) {
            console.log("Tweet #" + index + " : " + element.text);

            fs.appendFile('log.txt', element.text, function(error) {
                if (error) {
                    return console.log("Error Occured");
                }
            });
        });
        console.log("================================ Tweets Ends Here ==========================================");
    });
}

//Spotify function goes here
function spotifyThis() {
    fs.readFile('./random.txt', 'utf8', function(error, dataInfo) {
        if (error) {
            return console.log("Error Occured");
        }

        spotify.search({ type: 'track', query: dataInfo }, function(err, data) {
            if (err) {
                return console.log('Error occurred in spotify: ' + err);
            }

            jsonBody = JSON.stringify(data);

            console.log("================================ Song Information ====================================");
            console.log(' ');
            console.log('Artist: ' + data.tracks.items[0].artists[0].name);
            console.log('Song: ' + data.tracks.items[0].name);
            console.log('Preview Link: ' + data.tracks.items[0].preview_url);
            console.log('Album: ' + data.tracks.items[0].album.name);
            console.log(' ');
            console.log("================================ Song Information Ends Here ====================================");

            fs.writeFile("./temp.json", jsonBody, 'utf8', function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
    });
}


//movie function goes here
function movie() {

    var movieName = "Mr. Nobody";
    // request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=3d710c54";

    console.log(queryUrl);

    var request = require("request");

    request(queryUrl, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log("================================ Movie Information ====================================");
            console.log(' ');
            console.log("Title of the movie: " + movieName);
            console.log("Year the movie came out: " + JSON.parse(body).Released);
            console.log("IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country where the movie was produced: " + JSON.parse(body).Country);
            console.log("Language of the movie: " + JSON.parse(body).Language);
            console.log("Plot of the movie: " + JSON.parse(body).Plot);
            console.log("Actors in the movie: " + JSON.parse(body).Actors);
            console.log(' ');
            console.log("================================ Movie Information Ends Here ====================================");

        }
    });
}

switch (action) {

    case 'spotify-this-song':
        spotifyThis();
        break;

    case 'my-tweets':
        myTweets();
        break;

    case 'movie-this':
        movie();
        break;

    default:
        console.log("Please Use a Working Command");
        break;
}