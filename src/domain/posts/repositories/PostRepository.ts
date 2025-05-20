import { Post, CreatePostDTO, UpdatePostDTO } from '@domain/posts/entities/Post';
import {PostsResponse} from '@usecases/posts/PostUseCases'

export interface PostRepository {
  getPosts(page?: number, limit?: number): Promise<PostsResponse>;
  getPostById(id: number): Promise<Post>;
  searchPostById(id: number): Promise<Post | null>;
  createPost(post: CreatePostDTO): Promise<Post>;
  updatePost(post: UpdatePostDTO): Promise<Post>;
  deletePost(id: number): Promise<void>;
}