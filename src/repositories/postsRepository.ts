import { NextFunction, Request, Response } from 'express';
import { body, validationResult, CustomValidator } from 'express-validator';

import { IBloggerBody, IPostBody } from '../interfaces';

import { ICreatePostData } from './interfaces';

import BloggersRepository from './bloggersRepository';
import POSTS from '../mocks/postsMock.json';

class PostsRepository {
  posts: Array<IPostBody> = [];

  hasExistingBloggerId: CustomValidator = (id: number) => {
    if (!BloggersRepository.currentBloggersId.includes(id)) {
      return Promise.reject('Invalid blogger id');
    }

    return true;
  };

  schema = [
    body('title').exists().isLength({ min: 1 }),
    body('content').exists().isLength({ min: 1 }),
    body('shortDescription').exists().isLength({ min: 1 }),
    body('bloggerId').exists().isInt({ min: 1 }),
    body('bloggerId').custom(this.hasExistingBloggerId),
  ];

  constructor(posts: Array<IPostBody>) {
    this.posts = posts;
  }

  validateResult = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    next();
  };

  getPosts = (id?: string) => {
    if (id) {
      const post = this.posts.find((post: IPostBody) => post.id === Number(id));

      if (post) return post;
      return null;
    }

    return this.posts;
  };

  createPost = (data: ICreatePostData) => {
    const { title, content, bloggerId, shortDescription } = data;

    const newPost = {
      id: this.posts.length + 10,
      title: title.trim(),
      content: content.trim(),
      bloggerId: bloggerId,
      bloggerName: BloggersRepository.bloggers.find(
        (blogger: IBloggerBody) => blogger.id === bloggerId
      )!.name,
      shortDescription: shortDescription.trim(),
    };
    this.posts.push(newPost);

    return newPost;
  };

  updatePost = (postData: ICreatePostData, id: string) => {
    const { title, content, bloggerId, bloggerName, shortDescription } =
      postData;

    const post = this.posts.find((post: IPostBody) => post.id === Number(id));

    if (!post || post.bloggerId !== bloggerId) return false;

    post.title = title ? title : post.title;
    post.content = content ? content : post.content;
    post.shortDescription = shortDescription
      ? shortDescription
      : post.shortDescription;
    post.bloggerId = bloggerId ? bloggerId : post.bloggerId;
    post.bloggerName = bloggerName ? bloggerName : post.bloggerName;

    return true;
  };

  deletePost = (id: string) => {
    const startLength = this.posts.length;

    this.posts = this.posts.filter((post: IPostBody) => post.id !== Number(id));

    if (startLength === this.posts.length) {
      return false;
    }

    return true;
  };
}

export default new PostsRepository(POSTS);
