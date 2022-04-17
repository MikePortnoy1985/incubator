import { Request, Response, Router } from 'express';

import { IBloggerBody } from '../interfaces';
import { RequestType } from '../constants';
import BloggersRepository from '../repositories/bloggersRepository';

export const bloggersRouter = Router({});

// ========================== BLOGGERS =========================================

bloggersRouter.get('/', (request: Request, response: Response) => {
  const bloggers = BloggersRepository.getBloggers();
  response.status(200).send(bloggers);
});

bloggersRouter.get('/:id', (request: Request, response: Response) => {
  const blogger = BloggersRepository.getBloggers(request.params.id);

  if (blogger) {
    response.status(200).send(blogger);
    return;
  }

  response.status(404).send('Blogger not found');
});

bloggersRouter.post('/', (request: Request, response: Response) => {
  BloggersRepository.errorHandler(request, response, RequestType.Post);

  const { name, youtubeUrl }: IBloggerBody = request.body;

  const newBlogger = BloggersRepository.createBlogger(name, youtubeUrl);

  response.status(201).send(newBlogger);
});

bloggersRouter.put('/:id', (request: Request, response: Response) => {
  const { name, youtubeUrl }: IBloggerBody = request.body;

  const isBloggerUpdated = BloggersRepository.updateBlogger({
    id: request.params.id,
    name,
    youtubeUrl,
  });

  if (!isBloggerUpdated) {
    response.status(404).send('Not found');
    return;
  }

  BloggersRepository.errorHandler(request, response, RequestType.Put);

  response.send(204);
});

bloggersRouter.delete('/:id', (request: Request, response: Response) => {
  const isBloggerDeleted = BloggersRepository.deleteBlogger(request.params.id);

  if (!isBloggerDeleted) {
    response.status(404).send('Not found');
    return;
  }

  response.send(204);
});
