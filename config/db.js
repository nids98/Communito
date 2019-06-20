const mongoose = require('mongoose')
const config = require('config')
const db = config.get("mongoURI")

const connectDB = async () => {
    try {
        //Mongoose returns promise so put await before it
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        console.log("MongoDB connected....")
    } catch (err) {
        console.log(err.message)
        // Exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB