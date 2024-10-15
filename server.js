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
app.use(express.static(path.join(__dirname, 'public')));

// Movie schema and model
const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  trailer: String,
  description: String,
  rating: Number,
  reviews: [{ user: String, review: String }],
});

// Explicitly specify the collection name as 'movies'
const Movie = mongoose.model('Movie', movieSchema, 'movies');

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new movie
app.post('/movies', async (req, res) => {
  const { title, poster, trailer, description, rating } = req.body;
  const movie = new Movie({ title, poster, trailer, description, rating, reviews: [] });
  try {
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a review to a movie
app.post('/movies/:id/review', async (req, res) => {
  const { user, review } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    movie.reviews.push({ user, review });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update movie rating
app.post('/movies/:id/rate', async (req, res) => {
  const { rating } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    movie.rating = rating;
    await movie.save();
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
