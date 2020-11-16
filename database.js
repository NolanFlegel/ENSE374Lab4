// add all your boilerplate code up here
const mongoose = require("mongoose");

// connect mongoose to a database called testdb
mongoose.connect("mongodb://localhost:27017/testdb", 
                {useNewUrlParser: true, 
                 useUnifiedTopology: true});

// because mongoose functions are asynchronous, there is
// no guarantee they will finish in order. To force this,
// we will call them in an async function using the "await"
// keyword after each database read / write

async function databaseCalls () {
    // create a game schema - like a document temlpate
    const gameSchema = new mongoose.Schema ({
        name: String,
        rating: Number,
        price: Number,
        review: String
    })

    // create a collection of games using the gameSchema
    // using vague rules, mongoose will create the collection "games"
    const Game = mongoose.model("Game", gameSchema);

    // create a new game in the Game collection
    const game = new Game ({
        name: "Dead Space",
        rating: 5,
        price: 6.74,
        review: "Classic"
    });

    // save your record - comment me out if you don't want multiple saves!
    await game.save()

    // update a game
    await Game.updateOne( {name:"Dead Space"}, {$set: {rating:3}}, function(err){
        if (err) {
            console.log(err);
        }
    })

    // delete a game
    // Game.deleteOne({name: "Dead Space"}, function(err){
    //     if (err) {
    //         console.log(err)
    //     }
    // })

    await Game.find({name:"Dead Space"}, function(err, results) {

        if (err) {
            console.log(err);
        } else {
            console.log(results)
            if (results.length !== 0) {
                for (currentGame of results){
                    console.log(currentGame.name, currentGame.rating);
                }
            }
        }
    });

    // relationships example
    // lets create a user schema
    const userSchema = new mongoose.Schema ({
        name: String,
        faveGame: gameSchema
    })

    const User = mongoose.model("User", userSchema);

    // instantiate a user
    const user = new User ({
        name: "Adam",
        faveGame: game // this is our old game object
    })

    await user.save()

    await User.find({name:"Adam"}, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results)
        }
        // dangerous to close in an async function without await!
        mongoose.connection.close()
    });
}

databaseCalls()