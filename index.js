require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const SCOREBAT_API = 'https://www.scorebat.com/video-api/v3/feed/';
const API_TOKEN = process.env.API_KEY;

app.locals.formatDate = (dateString) => {
  const options = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${SCOREBAT_API}?token=${API_TOKEN}`);
    const matches = data.response
      .filter(match => match.date && match.competition)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.render('home', {
      matches: matches,
      currentDate: new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      })
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.render('error', { message: 'Failed to fetch matches' });
  }
});

module.exports=app;
