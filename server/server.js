require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Monitor MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

// Schema para as notícias
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  timestamp: Date,
  savedAt: { type: Date, default: Date.now }
});

const News = mongoose.model('News', newsSchema);

app.use(cors());
app.use(express.json());

// Rota para salvar notícia
app.post('/api/news', async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ success: true, id: news._id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para obter todas as notícias
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find().sort({ savedAt: -1 });
    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Rota para deletar notícia
app.delete('/api/news/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 