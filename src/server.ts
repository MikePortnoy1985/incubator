import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { postsRouter } from './routes/postsRoute';
import { bloggersRouter } from './routes/bloggersRoute';

export const APP = express();
const port = process.env.PORT || 5000;

APP.use(cors());
APP.use(bodyParser.json());

APP.use('/posts', postsRouter);
APP.use('/bloggers', bloggersRouter);

APP.get('/', (request: Request, response: Response) => {
  response.send('SERVER ON THE AIR');
});

APP.listen(port, () => {
  console.log(`============ SERVER STARTS ON ${port} ==========`);
});
