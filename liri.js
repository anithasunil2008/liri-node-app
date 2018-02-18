require("dotenv").config();

var fs = require('fs');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var action = process.argv[2];
var value = process.argv[3];

//twitter function goes here
function myTweets() {
    var params = { screen_name: 'nodejs' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log('Error Occured in twitter: ' + error);
        }
        console.log("================================== Twitter - Last 20 tweets ===================================");
        console.log(" ");
        console.log("Latest 20 Tweets");
        tweets.forEach(function(element, index) {
            console.log("\nTweet #" + index + " : " + element.text);

            fs.appendFile('log.txt', "\nTweet #" + index + " : " + element.text, function(error) {
                if (error) {
                    return console.log("Error Occured");
                }
            });
        });
        console.log("================================ Tweets Ends Here ==========================================");
    });
}

//Spotify function goes here
function spotifyThis(value) {

    var song = value || "The Sign";

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred in spotify: ' + err);
        }

        jsonBody = JSON.stringify(data);

        var songMessage = "\n" + "\nSong Info" + "\n " + '\nArtist: ' + data.tracks.items[0].artists[0].name + '\nSong: ' + data.tracks.items[0].name +
            '\nPreview Link: ' + data.tracks.items[0].preview_url + '\nAlbum: ' + data.tracks.items[0].album.name;

        fs.appendFile('log.txt', songMessage, function(error) {
            if (error) {
                return console.log("Error Occured");
            }
        });

        console.log("================================ Song Info ====================================");
        console.log(' ');
        console.log(songMessage);
        console.log(' ');
        console.log("================================ Song Info ====================================");
    });
}

//movie function goes here
function movie() {

    var movieName = process.argv[3] || "Mr. Nobody";
    // request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=3d710c54";

    console.log(queryUrl);

    var request = require("request");

    request(queryUrl, function(error, response, body) {

        var movieMessage = "\nMovie Info" + "\n " + "\nTitle of the movie: " + movieName + " \nYear the movie came out: " + JSON.parse(body).Released +
            " \nIMDB Rating of the movie: " + JSON.parse(body).imdbRating + " \nRotten Tomatoes Rating of the movie: " + JSON.parse(body).Ratings[1].Value +
            " \nCountry where the movie was produced: " + JSON.parse(body).Country + " \nLanguage of the movie: " + JSON.parse(body).Language +
            " \nPlot of the movie: " + JSON.parse(body).Plot + " \nActors in the movie: " + JSON.parse(body).Actors;

        fs.appendFile('log.txt', movieMessage, function(error) {
            if (error) {
                return console.log("Error Occured");
            }
        });

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log("================================ Movie ====================================");
            console.log(' ');
            console.log(movieMessage);
            console.log(' ');
            console.log("================================ Movie Info ====================================");
        }
    });
}

switch (action) {

    case 'spotify-this-song':
        spotifyThis(value);
        break;

    case 'my-tweets':
        myTweets();
        break;

    case 'movie-this':
        movie();
        break;

    case 'do-what-it-says':
        fs.readFile("./random.txt", 'utf-8', function(error, text) {
            if (error) {
                return console.log("Error Occured while reading random.txt : " + error);
                process.exit(1);
            }
            var textByLine = text.split("\n");
            var song = textByLine[Math.floor(Math.random() * textByLine.length)];
            spotifyThis(song);
        });
        break;

    default:
        console.log("Please Use a Working Command");
        break;
}