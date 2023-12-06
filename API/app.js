import express from 'express';
import userRoutes from './routes/userRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors'
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/user',userRoutes);
app.use('/pokemon',pokemonRoutes);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));