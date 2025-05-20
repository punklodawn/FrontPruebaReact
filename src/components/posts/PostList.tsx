import React from 'react';
import { Post } from '@domain/posts/entities/Post';
import PostItem from '@components/posts/PostItem';

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, onEdit, onDelete, loading }) => {
  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700">Posts No Encontrado</h3>
        <p className="mt-2 text-gray-500">Crea un nuevo post para iniciar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <PostItem 
          key={post.id}
          post={post} 
          onEdit={onEdit} 
          onDelete={onDelete}
          disabled={loading}
        />
      ))}
    </div>
  );
};

export default PostList;