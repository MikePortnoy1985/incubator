export interface IBloggerBody {
  id: number;
  name: string;
  youtubeUrl: string;
}

export interface IPostBody {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
}
