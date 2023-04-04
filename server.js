import express from 'express';
import serveStatic from 'serve-static';
import path from 'path';
import * as env from 'dotenv';
import {fileURLToPath} from 'url';
env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();
app.use(serveStatic(path.join(__dirname, 'dist')))


const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`[OK] Server is running on PORT = ${PORT}`);
    });

  } catch (e) {
    console.log(e);
  }
};
start();