export interface User {
  id: string;
  username: string;
  avatar: string;
  interests: string[];
}

export interface Interest {
  id: string;
  name: string;
  icon: string;
  color: string;
  postsCount: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  interest: Interest;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
}
