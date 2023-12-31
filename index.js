import Express from 'express';
const app = Express();
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import relationshipRoutes from './routes/relationships.js';
import likeRoutes from './routes/likes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {initDb} from './connect.js';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

app.use(Express.static(path.join(__dirname, 'build')));

//middlewares
app.use(cors());

app.use(Express.json());

app.use(cookieParser());

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/likes',likeRoutes);
app.use('/api/relationships',relationshipRoutes);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
 
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`);
    initDb();
})
