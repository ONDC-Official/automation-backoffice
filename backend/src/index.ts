import "./config/otelConfig"
import app from './app';
import * as dotenv from 'dotenv'
import { connectMongo } from './config/mongoConfig';

dotenv.config();


const PORT = process.env.PORT || 3000;

const start = async () => {
    await connectMongo();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
});
