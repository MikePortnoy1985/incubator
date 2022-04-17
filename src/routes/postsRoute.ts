import { Request, Response, Router } from 'express';

import { RequestType } from '../constants';
import PostsRepository from '../repositories/postsRepository';

export const postsRouter = Router({});

// ================================ POSTS ===============================================

postsRouter.get('/', (request: Request, response: Response) => {
  const posts = PostsRepository.getPosts();
  response.status(200).send(posts);
});

postsRouter.get('/:id', (request: Request, response: Response) => {
  const post = PostsRepository.getPosts(request.params.id);

  if (post) {
    response.status(200).send(post);
    return;
  }

  response.status(404).send('Post not found');
});

postsRouter.post('/', (request: Request, response: Response) => {
  PostsRepository.errorHandler(request, response, RequestType.Post);

  const newPost = PostsRepository.createPost(request.body);

  response.status(201).send(newPost);
});

postsRouter.put('/:id', (request: Request, response: Response) => {
  const isPostUpdated = PostsRepository.updatePost(
    request.body,
    request.params.id
  );

  if (!isPostUpdated) {
    response.status(404).send('Not found');
    return;
  }

  PostsRepository.errorHandler(request, response, RequestType.Put);

  response.send(204);
});

postsRouter.delete('/:id', (request: Request, response: Response) => {
  const isPostDeleted = PostsRepository.deletePost(request.params.id);

  if (!isPostDeleted) {
    response.status(404).send('Not found');
    return;
  }

  response.send(204);
});
