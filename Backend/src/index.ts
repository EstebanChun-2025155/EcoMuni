import express from 'express';
import dotenv from 'dotenv';
import campanaRoutes from './routes/campana.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/campanas', campanaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor EcoMuni corriendo en http://localhost:${PORT}`);
});
