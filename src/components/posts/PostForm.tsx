import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Post } from '@domain/posts/entities/Post';

interface PostFormProps {
  post: Post | null;
  onSubmit: (post: Post | Omit<Post, 'id'>) => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('1');
  const [errors, setErrors] = useState<{
    title?: string;
    body?: string;
    userId?: string;
  }>({});

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setUserId(post.userId.toString());
    }
  }, [post]);

  const validate = (): boolean => {
    const newErrors: {
      title?: string;
      body?: string;
      userId?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = 'Titulo Requerido';
    }

    if (!body.trim()) {
      newErrors.body = 'Contenido Requerido';
    }

    if (!userId.trim() || isNaN(Number(userId))) {
      newErrors.userId = 'Usuario Valido Requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const formData = {
      title,
      body,
      userId: parseInt(userId, 10)
    };

    if (post) {
      onSubmit({ ...formData, id: post.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {post ? 'Editar Post' : 'Crear Nuevo Post'}
      </h3>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Titulo
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter post title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Contenido
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.body ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="ingresa el contenido del post"
        ></textarea>
        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
      </div>
      
      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
          User ID
        </label>
        <input
          type="number"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          min="1"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.userId ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ingresa el ID User"
        />
        {errors.userId && <p className="mt-1 text-sm text-red-600">{errors.userId}</p>}
      </div>
      
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
        >
          <X size={18} />
          <span>Cancelar</span>
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2"
        >
          <Save size={18} />
          <span>{post ? 'Actualizar' : 'Crear'}</span>
        </button>
      </div>
    </form>
  );
};

export default PostForm;