const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('Logger');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute ='mongodb://localhost/fullstack_app';
mongoose.connect(dbRoute, {useNewUrlParser: true});
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
let db = mongoose.connection;

db.once('open', () => console.log('connected to database'));

db.on('error', () => console.log('connection to database failed'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(logger('dev'));

router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if(err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    })
});

router.post('/updateData', (req, res) => {
    const {id, update} = req.body;
    Data.findByIdAndUpdate(id, update, (err)=>{
        if(err) return res.json({success:false, error: err});
        return res.json({success: true});
    });
});

router.delete('/deleteData', (req, res)=> {
    const {id} = req.body;
    console.log("DELETE "+id);
    Data.findByIdAndRemove(id, (err) =>{
        if(err) return res.send(err);
        return res.json({success: true});
    });
});

router.post('/putData', (req, res)=>{
    let data = new Data();
    const {id, message} = req.body;
    
    if((!id && id !== 0) || !message ) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        });
    }
    console.log("Adding new by :"+ message);
    data.message = message;
    data.id = id;
    data.save((err)=>{
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`Listening on Port ${API_PORT}`));
