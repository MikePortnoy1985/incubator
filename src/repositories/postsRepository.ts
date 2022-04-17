import { Request, Response } from 'express';

import { IPostBody } from '../interfaces';
import { RequestType } from '../constants';

import { ICreatePostData } from './interfaces';

import BloggersRepository from './bloggersRepository';
import POSTS from '../mocks/postsMock.json';

class PostsRepository {
  posts: Array<IPostBody> = [];

  constructor(posts: Array<IPostBody>) {
    this.posts = posts;
  }

  getPosts = (id?: string) => {
    if (id) {
      const post = this.posts.find((post: IPostBody) => post.id === Number(id));

      if (post) return post;
      return null;
    }

    return this.posts;
  };

  createPost = (data: ICreatePostData) => {
    const { title, content, bloggerId, bloggerName, shortDescription } = data;

    const newPost = {
      id: this.posts.length + 100,
      title: title.trim(),
      content: content.trim(),
      bloggerId: bloggerId,
      bloggerName: bloggerName?.trim(),
      shortDescription: shortDescription.trim(),
    };
    this.posts.push(newPost);

    return newPost;
  };

  updatePost = (postData: ICreatePostData, id: string) => {
    const { title, content, bloggerId, bloggerName, shortDescription } =
      postData;

    const post = this.posts.find((post: IPostBody) => post.id === Number(id));

    if (!post) return false;

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

  errorHandler = (
    request: Request,
    response: Response,
    requestType: RequestType
  ) => {
    const hasTitle = request.body.title?.trim().length;
    const hasContent = request.body.content?.trim().length;
    const hasShortDescription = request.body.shortDescription?.trim().length;
    const hasBloggerName = request.body.bloggerName?.trim().length;
    const hasBloggerId = request.body.bloggerId > 0;
    const hasExistingBloggerId = BloggersRepository.currentBloggersId.includes(
      request.body.bloggerId
    );

    const wrongEntityText = 'Wrong entity format';

    switch (requestType) {
      case RequestType.Post: {
        if (
          [
            hasTitle,
            hasContent,
            hasBloggerId,
            hasBloggerName,
            hasShortDescription,
            hasExistingBloggerId,
          ].some((value) => value === false)
        ) {
          return response.status(400).send(wrongEntityText);
        }
      }
      case RequestType.Put: {
        if (
          [
            hasTitle,
            hasContent,
            hasBloggerId,
            hasBloggerName,
            hasShortDescription,
          ].every((value) => value === false)
        ) {
          return response.status(400).send(wrongEntityText);
        }
      }
      default:
        return false;
    }
  };
}

export default new PostsRepository(POSTS);
