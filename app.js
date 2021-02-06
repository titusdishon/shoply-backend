import express from 'express';
import products  from './routes/products.js';

const app = express();

app.use(express.json())

app.use(`/api/v1`,products);

export default app;