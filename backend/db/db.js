import mongoose from "mongoose";


function connect() {
    // Disable mongoose buffering to fail fast when the DB is unreachable
    mongoose.set('bufferCommands', false)

    const opts = {
        // modern connection options
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // fail faster when the server is not reachable
        serverSelectionTimeoutMS: 5000,
    }

    return mongoose.connect(process.env.MONGODB_URI, opts)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(err => {
            console.error('MongoDB connection error:', err && err.message ? err.message : err)
            // keep throwing so callers can react if they want
            throw err
        })
}

// Also surface connection events for easier debugging
mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'))
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err && err.message ? err.message : err))
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'))

export default connect;