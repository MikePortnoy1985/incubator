export interface IUpdateBloggerData {
  id: string;
  name: string;
  youtubeUrl: string;
}

export interface ICreatePostData {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: number;
  bloggerName: string;
}
