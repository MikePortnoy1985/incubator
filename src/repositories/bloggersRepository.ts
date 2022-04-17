import { IBloggerBody } from '../interfaces';
import BLOGGERS from '../mocks/bloggersMock.json';

import { Request, Response } from 'express';

import { RequestType, TEST_URL } from '../constants';

import { IUpdateBloggerData } from './interfaces';

class BloggersRepository {
  bloggers: Array<IBloggerBody> = [];

  constructor(bloggers: Array<IBloggerBody>) {
    this.bloggers = bloggers;
  }

  getBloggers = (id?: string) => {
    if (id) {
      const blogger = this.bloggers.find(
        (blogger: IBloggerBody) => blogger.id === Number(id)
      );

      if (blogger) return blogger;
      return null;
    }

    return this.bloggers;
  };

  createBlogger = (name: string, youtubeUrl: string) => {
    const newBlogger = {
      id: this.bloggers.length + 1,
      name: name.trim(),
      youtubeUrl: youtubeUrl.trim(),
    };

    this.bloggers.push(newBlogger);

    return newBlogger;
  };

  updateBlogger = (bloggerData: IUpdateBloggerData) => {
    const { id, name, youtubeUrl } = bloggerData;

    const blogger = this.bloggers.find(
      (blogger: IBloggerBody) => blogger.id === Number(id)
    );

    if (!blogger) return null;

    blogger.name = name ? name : blogger.name;
    blogger.youtubeUrl = youtubeUrl ? youtubeUrl : blogger.youtubeUrl;

    return true;
  };

  deleteBlogger = (id: string) => {
    const startLength = this.bloggers.length;

    this.bloggers = this.bloggers.filter(
      (blogger: IBloggerBody) => blogger.id !== Number(id)
    );

    if (startLength === this.bloggers.length) {
      return false;
    }

    return true;
  };

  errorHandler = (
    request: Request,
    response: Response,
    requestType: RequestType
  ) => {
    const hasName = request.body.name?.trim().length;
    const hasCorrectUrl = TEST_URL.test(request.body.youtubeUrl);

    const wrongNameText = 'Wrong title format';
    const wrongUrlText = 'Wrong youtubeUrl format';
    const wrongEntityText = 'Wrong entity format';

    switch (requestType) {
      case RequestType.Post: {
        if (!hasName) return response.status(400).send(wrongNameText);

        if (!hasCorrectUrl) return response.status(400).send(wrongUrlText);
      }
      case RequestType.Put: {
        if (!hasCorrectUrl && request.body.youtubeUrl) {
          return response.status(400).send(wrongUrlText);
        }

        if (!hasName && request.body.name) {
          return response.status(400).send(wrongNameText);
        }

        if (!hasName && !hasCorrectUrl)
          return response.status(400).send(wrongEntityText);
      }
      default:
        return false;
    }
  };
}

export default new BloggersRepository(BLOGGERS);
