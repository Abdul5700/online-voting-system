import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import rateLimit from 'express-rate-limit'; import morgan from 'morgan'; import fs from 'fs'; import 'dotenv/config'; import routes from './routes.js'; import {notFound,errorHandler} from './middleware/error.js';

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

fs.mkdirSync('uploads',{recursive:true});
const app=express();
app.use(helmet({crossOriginResourcePolicy:false}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false}));
app.use(express.json({limit:'100kb'}));
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.get('/health',(req,res)=>res.json({status:'ok'}));
app.use('/api',routes);
// Backwards-compatible auth paths for a previously deployed frontend bundle.
// New clients must use /api/*; this prevents old cached bundles from failing
// while Vercel finishes deploying the corrected VITE_API_URL value.
app.use('/', routes);
app.use(notFound);
app.use(errorHandler);
app.listen(process.env.PORT||5000,()=>console.log(`API listening on ${process.env.PORT||5000}`));
