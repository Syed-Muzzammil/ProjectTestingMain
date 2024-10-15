const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://movielens_admin:movielenspassword@cluster0.cy68m.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("Failed to connect to MongoDB Atlas", err));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Movie schema and model
const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  trailer: String,
  description: String,
  rating: Number,
  reviews: [{ user: String, review: String }],
  actors: [String],  // Array of actors
  genre: [String],     // Movie genre
});

// Explicitly specify the collection name as 'movies'
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Search route
app.get('/movies', async (req, res) => {
  const searchQuery = req.query.search;
  try {
    const movies = await Movie.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { actors: { $elemMatch: { $regex: searchQuery, $options: 'i' } } },
        { genre: { $regex: searchQuery, $options: 'i' } },
      ]
    });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new movie to the database
app.post('/movies', async (req, res) => {
  const newMovie = new Movie(req.body);
  try {
    await newMovie.save();
    res.status(201).json(newMovie);  // Return the created movie
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});