import { Post, CreatePostDTO, UpdatePostDTO } from '@domain/posts/entities/Post';
import { PostRepository } from '@domain/posts/repositories/PostRepository';
import {PostsResponse} from '@usecases/posts/PostUseCases'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export class PostAPIRepository implements PostRepository {
  async getPosts(page: number = 1, limit: number = 9): Promise<PostsResponse> {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    const allPosts = await response.json();
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      posts: allPosts.slice(start, end),
      total: allPosts.length
    };
  }

  async searchPostById(id: number): Promise<Post | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async getPostById(id: number): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    return response.json();
  }

  async createPost(post: CreatePostDTO): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    return response.json();
  }

  async updatePost(post: UpdatePostDTO): Promise<Post> {
    try {
      const { id, ...updateData } = post;
      
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Network or parsing error:', error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
  }
}