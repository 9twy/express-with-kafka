import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './router'
import { consumeMessages } from './kafka/consumer';

const app =express()
app.use(cors({
    credentials:true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json())
const server=http.createServer(app);

consumeMessages('user-topic').catch(console.error);

server.listen(8000,()=>{
    console.log('server running on http://localhost:8080/');
    
});
const MONGO_URL="mongodb+srv://saeed:saeed@cluster0.f2vkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.Promise=Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>console.log(error));
app.use('/',router())