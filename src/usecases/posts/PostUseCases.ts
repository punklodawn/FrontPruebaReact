import { Post, CreatePostDTO, UpdatePostDTO } from '@domain/posts/entities/Post';
import { PostRepository } from '@domain/posts/repositories/PostRepository';

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export class PostUseCases {
  constructor(private repository: PostRepository) {}

  async getPosts(page: number = 1, limit: number = 9): Promise<PostsResponse> {
    return this.repository.getPosts(page, limit);
  }

  async searchPostById(id: number): Promise<Post | null> {
    return this.repository.searchPostById(id);
  }

  async createPost(post: CreatePostDTO): Promise<Post> {
    return this.repository.createPost(post);
  }

  async updatePost(post: UpdatePostDTO): Promise<Post> {
    return this.repository.updatePost(post);
  }

  async deletePost(id: number): Promise<void> {
    return this.repository.deletePost(id);
  }
}