import { useState, useEffect } from 'react';
import { Post, CreatePostDTO, UpdatePostDTO } from '@domain/posts/entities/Post';
import { PostUseCases } from '@usecases/posts/PostUseCases';

export const usePosts = (postUseCases: PostUseCases) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchId, setSearchId] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const postsPerPage = 9;

  useEffect(() => {
    if (!isSearching) {
      loadPosts();
    }
  }, [currentPage, isSearching]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postUseCases.getPosts(currentPage, postsPerPage);
      setPosts(data.posts);
      setTotalPosts(data.total);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchPost = async (id: number) => {
    try {
      setLoading(true);
      setIsSearching(true);
      const post = await postUseCases.searchPostById(id);
      if (post) {
        setPosts([post]);
        setTotalPosts(1);
      } else {
        setPosts([]);
        setTotalPosts(0);
        setError('No post found with this ID');
      }
    } catch (err) {
      setError('Failed to search post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setIsSearching(false);
    setCurrentPage(1);
    loadPosts();
  };

  const createPost = async (post: CreatePostDTO) => {
    try {
      setLoading(true);
      const newPost = await postUseCases.createPost(post);
      if (!isSearching) {
        setPosts([newPost, ...posts].slice(0, postsPerPage));
        setTotalPosts(prev => prev + 1);
      }
      return newPost;
    } catch (err) {
      setError('Failed to create post. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (post: UpdatePostDTO) => {
    try {
      setLoading(true);
      const updatedPost = await postUseCases.updatePost(post);
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      return updatedPost;
    } catch (err) {
      setError('Failed to update post. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    try {
      setLoading(true);
      await postUseCases.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
      setTotalPosts(prev => prev - 1);
    } catch (err) {
      setError('Failed to delete post. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPosts,
    postsPerPage,
    searchId,
    isSearching,
    setCurrentPage,
    setSearchId,
    searchPost,
    clearSearch,
    createPost,
    updatePost,
    deletePost,
    setError
  };
};