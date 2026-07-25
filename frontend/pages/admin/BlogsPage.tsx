import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import { BLOG_CATEGORIES } from '../../data/blogData';

interface BlogItem {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorBio: string;
  date: string;
  readTime: string;
  image: string;
  isFeatured: boolean;
  tags: string[] | string;
  keywords: string;
}

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Uploading states
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: string;
    image: string;
    excerpt: string;
    content: string;
    authorName: string;
    authorRole: string;
    authorAvatar: string;
    authorBio: string;
    readTime: string;
    tags: string;
    keywords: string;
    isFeatured: boolean;
  }>({
    title: '',
    slug: '',
    category: 'Home Buying Guides',
    image: '/images/blog_hero.png',
    excerpt: '',
    content: '',
    authorName: 'Piyush Khardekar',
    authorRole: 'Founder, Brokerless Realty',
    authorAvatar: '/images/client1.jpeg',
    authorBio: 'Dedicated to eliminating middleman costs from Indian real estate.',
    readTime: '5 min read',
    tags: 'Zero Brokerage, Home Buying',
    keywords: 'Real Estate, Property, Pune',
    isFeatured: false,
  });

  const getAuthToken = () => localStorage.getItem('brokerless-token') || '';

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // File upload helper
  const handleFileUpload = async (file: File, type: 'cover' | 'avatar') => {
    const token = getAuthToken();
    const data = new FormData();
    data.append('file', file);

    if (type === 'cover') setUploadingCover(true);
    if (type === 'avatar') setUploadingAvatar(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Image upload failed');
      }

      const result = await res.json();
      if (type === 'cover') {
        setFormData(prev => ({ ...prev, image: result.url }));
      } else {
        setFormData(prev => ({ ...prev, authorAvatar: result.url }));
      }
    } catch (err: any) {
      alert(err.message || 'Upload error');
    } finally {
      if (type === 'cover') setUploadingCover(false);
      if (type === 'avatar') setUploadingAvatar(false);
    }
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Home Buying Guides',
      image: '/images/blog_hero.png',
      excerpt: '',
      content: '',
      authorName: 'Piyush Khardekar',
      authorRole: 'Founder, Brokerless Realty',
      authorAvatar: '/images/client1.jpeg',
      authorBio: 'Dedicated to eliminating middleman costs from Indian real estate.',
      readTime: '5 min read',
      tags: 'Zero Brokerage, Home Buying',
      keywords: 'Real Estate, Property, Pune',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogItem) => {
    setEditingBlog(blog);
    const tagString = Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || '');
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Home Buying Guides',
      image: blog.image || '/images/blog_hero.png',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      authorName: blog.authorName || (blog as any).author?.name || 'Piyush Khardekar',
      authorRole: blog.authorRole || (blog as any).author?.role || 'Founder, Brokerless Realty',
      authorAvatar: blog.authorAvatar || (blog as any).author?.avatar || '/images/client1.jpeg',
      authorBio: blog.authorBio || (blog as any).author?.bio || '',
      readTime: blog.readTime || '5 min read',
      tags: tagString,
      keywords: blog.keywords || '',
      isFeatured: Boolean(blog.isFeatured),
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingBlog ? prev.slug : autoSlug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const token = getAuthToken();
    const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      tags: tagArray
    };

    try {
      let res;
      if (editingBlog) {
        res = await fetch(`${API_BASE_URL}/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/api/blogs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Operation failed');
      }

      setSuccessMsg(editingBlog ? 'Blog updated successfully!' : 'Blog post created successfully!');
      setIsModalOpen(false);
      fetchBlogs();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete blog post');
      setSuccessMsg('Blog post deleted successfully.');
      fetchBlogs();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error deleting blog post');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, upload image assets, and manage published articles.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Blog
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading blog posts...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-gray-700">No blog posts found</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add New Blog" to create your first article.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={blog.image || '/images/blog_hero.png'}
                          alt={blog.title}
                          className="w-12 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold text-gray-900 line-clamp-1">{blog.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-teal-50 text-[#009688] font-bold rounded-md text-[10px]">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={blog.authorAvatar || (blog as any).author?.avatar || '/images/client1.jpeg'}
                          alt={blog.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200"
                        />
                        <span className="text-gray-700 font-medium">{blog.authorName || (blog as any).author?.name || 'Admin'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{blog.date}</td>
                    <td className="py-3.5 px-4">
                      {blog.isFeatured ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-bold rounded text-[10px]">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. 5 Tips to Buy Direct Owner Property"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. 5-tips-to-buy-direct-owner-property"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none bg-white"
                  >
                    {BLOG_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Upload Section */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block font-bold text-gray-800">Cover Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Cover Preview"
                      className="w-20 h-14 rounded-lg object-cover border border-gray-300 flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow space-y-1.5 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'cover');
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-[#00796B] cursor-pointer"
                    />
                    {uploadingCover && <span className="text-xs text-[#009688] font-bold">Uploading cover image...</span>}
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or paste image URL (e.g. /images/blog_hero.png)"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 2-line overview of the article..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Article Content (Markdown) *</label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Article Heading&#10;&#10;Write your markdown content here..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none font-mono"
                />
              </div>

              {/* Author Details & Avatar Upload Section */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-1">Author Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Author Role</label>
                    <input
                      type="text"
                      value={formData.authorRole}
                      onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Author Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  {formData.authorAvatar && (
                    <img
                      src={formData.authorAvatar}
                      alt="Author Preview"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300 flex-shrink-0"
                    />
                  )}
                  <div className="flex-grow space-y-1.5 w-full">
                    <label className="block font-semibold text-gray-700">Author Avatar Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0], 'avatar');
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#009688] file:text-white hover:file:bg-[#00796B] cursor-pointer"
                    />
                    {uploadingAvatar && <span className="text-xs text-[#009688] font-bold">Uploading avatar...</span>}
                    <input
                      type="text"
                      value={formData.authorAvatar}
                      onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                      placeholder="Or paste avatar URL (e.g. /images/client1.jpeg)"
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Author Bio</label>
                  <textarea
                    rows={2}
                    value={formData.authorBio}
                    onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                    placeholder="Short description of author background..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Zero Brokerage, Buying Guide"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="Property, Real Estate, Pune"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#009688] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#009688] rounded focus:ring-[#009688]"
                />
                <label htmlFor="isFeatured" className="font-bold text-gray-700">
                  Feature this article on main blog hero banner
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingCover || uploadingAvatar}
                  className="px-5 py-2 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Blog Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
