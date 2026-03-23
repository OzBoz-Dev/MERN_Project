const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routers
const commentsRouter = require('../routes/comments')
const conversationRouter = require('../routes/conversations')

app.use('/comments', commentsRouter)
app.use('/conversations', conversationRouter)

// Test route
app.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    res.json(
      { 
        message: 'MERN server is running!',
        database_status: 'Connected!',
        db_name: db.databaseName,
        active_collections: collections.map(col => col.name)
      }
    );
  }
  catch (err) {
    res.status(500).json({error: err.message});
  }
});

// app.listen(5000, () => {
//     console.log("Server running on 5000 i think lol");
// })

// MongoDB connection
const PORT = 5000
console.log(process.env.MONGO_URI)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}!`)
    })
  })
  .catch(err => console.log(err))

