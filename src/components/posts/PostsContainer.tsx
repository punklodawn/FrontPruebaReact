import React, { useState } from 'react';
import { PlusCircle, Loader, Search, X } from 'lucide-react';
import PostList from '@components/posts/PostList';
import PostForm from '@components/posts/PostForm';
import { Post } from '@domain/posts/entities/Post';
import { usePosts } from '@presentation/hooks/usePosts';
import { PostUseCases } from '@usecases/posts/PostUseCases';
import { PostAPIRepository } from '@infrastructure/api/posts/PostAPIRepository';

const postUseCases = new PostUseCases(new PostAPIRepository());

const PostsContainer: React.FC = () => {
  const { 
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
  } = usePosts(postUseCases);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const handleCreatePost = async (newPost: Omit<Post, 'id'>) => {
    try {
      await createPost(newPost);
      setIsFormVisible(false);
      setCurrentPost(null);
    } catch (err) {
      console.error('Error al crear un post:', err);
      setError(err instanceof Error ? err.message : 'Fallo en la creacion de post');
    }
  };

  const handleUpdatePost = async (post: Post) => {
    try {
      await updatePost(post);
      setIsFormVisible(false);
      setCurrentPost(null);
    } catch (err) {
      console.error('Error editando post:', err);
      setError(err instanceof Error ? err.message : 'Fallo en la edicion del post');
    }
  };

  const handleEditPost = (post: Post) => {
    setCurrentPost(post);
    setIsFormVisible(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId);
    if (!isNaN(id) && id > 0) {
      searchPost(id);
    } else {
      setError('Por favor Ingrese un ID Post Valido');
    }
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 right-0 px-4 py-3" 
            onClick={() => setError(null)}
          >
            <span className="sr-only">Cerrar</span>
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex-1 sm:flex-initial">
            <div className="relative">
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Post ID"
                className="w-full sm:w-48 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                min="1"
              />
              {isSearching ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              ) : (
                <Search size={20} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              )}
            </div>
          </form>
          <button
            onClick={() => {
              setCurrentPost(null);
              setIsFormVisible(true);
            }}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-300 whitespace-nowrap"
          >
            <PlusCircle size={20} />
            <span>Nuevo Post</span>
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-fade-in">
          <PostForm 
            post={currentPost}
            onSubmit={currentPost ? handleUpdatePost : handleCreatePost}
            onCancel={() => {
              setIsFormVisible(false);
              setCurrentPost(null);
            }}
          />
        </div>
      )}

      {loading && posts.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader size={40} className="text-gray-900 animate-spin" />
        </div>
      ) : (
        <>
          <PostList 
            posts={posts} 
            onEdit={handleEditPost} 
            onDelete={deletePost} 
            loading={loading}
          />
          
          {!isSearching && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="text-gray-600">
                Pagina {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostsContainer;