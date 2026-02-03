import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes.ts';
import connectDB from './config/db.ts';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
}
)

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Connected to the database successfully");
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error: Error) => {
    console.error("Database connection failed", error);
});


