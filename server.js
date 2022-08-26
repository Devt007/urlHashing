const express = require('express');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrls');
const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://0.0.0.0:27017/urlShortener');

app.use(express.urlencoded({ extended: false }));

app.get('/', async(req, res) => {
    const ShortUrls = await shortUrl.find();
    res.render('index', { shortUrls: ShortUrls });
});

app.post('/shortUrls', async(req, res) => {
    await shortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
})

app.get('/:shortUrl', async(req, res) => {
    const ShortUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (ShortUrl == null) return res.sendStatus(404);

    ShortUrl.clicks++;
    ShortUrl.save();

    res.redirect(ShortUrl.full);
})


app.listen(process.env.PORT || 5000);