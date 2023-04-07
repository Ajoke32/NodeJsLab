const express = require('express');
const  hbs = require('hbs');
const app = express();
const axios = require('axios');
const expHBS = require('express-handlebars')
const port = 3000;
const key = '';
const path = require('path');
const cookieParser = require("cookie-parser");

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
const h = expHBS.create({
    extname:'hbs',
    defaultLayout:'',
    layoutsDir:path.join(__dirname,'views'),
    partialsDir:path.join(__dirname,'views/partials')
});



app.use('/public',express.static(path.join('public')));

app.engine('hbs',h.engine);
app.set('views',path.join(__dirname,'views'));
app.set('trust proxy', true)
app.set('view engine','hbs');

app.get('/',(req,res)=>{
   res.redirect('/home');
});

app.get('/weather',async (req,res)=>{
    if(req.cookies['lat']){
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${req.cookies['lat']}&lon=${req.cookies['lon']}&appid=${key}&units=metric`;
        axios.get(URL).then(response=>{
            const data = response.data;
            const city = response.data.name;
            res.render('weather.hbs',{data,city});
        });
    }else{
        res.redirect('/weather/Kyiv');
    }
});

app.get('/weather/:city',async (req,res)=>{
    const city = req.params.city;
    const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`;
    axios.get(cityUrl).then(response=>{
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
        axios.get(URL).then(response=>{
            const data = response.data;
            res.render('weather',{data,city});
        });
    });

});

app.get('/home',(req,res)=>{
    res.render('home');
});




/*
app.get('/err',(req,res)=>{
   res.render('400');
});

app.get('/main',(req,res)=>{
    res.render('main');
});*/
app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
});