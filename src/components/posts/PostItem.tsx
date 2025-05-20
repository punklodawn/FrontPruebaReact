import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Post } from '@domain/posts/entities/Post';

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  disabled: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, onEdit, onDelete, disabled }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(post.id);
    }, 300);
  };

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  return (
<div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 ${isDeleting ? 'opacity-50 scale-95' : ''} flex flex-col h-full`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{post.title}</h3>
          <div className="relative">
            <button 
              onClick={toggleActions}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              disabled={disabled}
            >
              <MoreVertical size={20} className="text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 animate-fade-in">
                <div className="py-1">
                  <button 
                    onClick={() => {
                      setShowActions(false);
                      onEdit(post);
                    }}
                    disabled={disabled}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Editar Post
                  </button>
                  <button 
                    onClick={() => {
                      setShowActions(false);
                      handleDelete();
                    }}
                    disabled={disabled}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Eliminar Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow mb-4">
          <p className="text-gray-600 line-clamp-3">{post.body}</p>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>User ID: {post.userId}</span>
            <span>Post #{post.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;