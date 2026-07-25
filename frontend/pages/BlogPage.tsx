import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AnimatedSection from '../components/AnimatedSection';
import { BLOG_POSTS as FALLBACK_POSTS, BLOG_CATEGORIES } from '../data/blogData';
import { BlogPost } from '../types';
import { API_BASE_URL } from '../config';

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  return (
    <AnimatedSection style={{ transitionDelay: `${index * 80}ms` }} className="h-full">
      <Link 
        to={`/blog/${post.slug}`} 
        className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        {/* Card Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#009688] text-white shadow-sm">
              {post.category}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="text-xs text-gray-400 font-medium mb-2">
            {post.date} <span className="mx-1">•</span> {post.readTime}
          </div>

          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#009688] transition-colors duration-200 leading-snug mb-3">
            {post.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center space-x-3 mt-auto">
            <img
              src={post.author?.avatar || '/images/client1.jpeg'}
              alt={post.author?.name || 'Author'}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-xs font-bold text-gray-900">{post.author?.name || 'Admin'}</p>
              <p className="text-[10px] text-gray-500">{post.author?.role || 'Author'}</p>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
};

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(err => {
        console.warn('API error fetching blogs, falling back to static data:', err);
      });
  }, []);

  const featuredPost = useMemo(() => {
    return posts.find(post => post.isFeatured) || posts[0];
  }, [posts]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return posts;
    return posts.filter(post => post.id !== featuredPost.id && post.slug !== featuredPost.slug);
  }, [posts, featuredPost]);

  const filteredPosts = useMemo(() => {
    return gridPosts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.keywords && post.keywords.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, gridPosts]);

  return (
    <div className="bg-white min-h-screen">
      {/* Page Hero Header matching screenshot */}
      <PageHeader
        title="Brokerless Realty Blog"
        subtitle="Insights, legal tips, home buying guides, and renting strategies to navigate real estate with zero brokerage."
        backgroundImage="/images/blog_hero.png"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Tabs & Search Input Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {BLOG_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#009688] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#009688] transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Featured Article Card */}
        {featuredPost && searchQuery === '' && selectedCategory === 'All' && (
          <AnimatedSection className="mb-12">
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-gray-100">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-[#C2185B] text-white shadow-md">
                    Featured
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#009688] block mb-3">
                    {featuredPost.category}
                  </span>

                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-[#009688] transition-colors leading-snug mb-4">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900">{featuredPost.author.name}</p>
                      <p className="text-[11px] text-gray-500">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">{featuredPost.date}</p>
                    <p className="text-[11px] font-semibold text-[#009688]">{featuredPost.readTime}</p>
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>
        )}

        {/* 3-Column Blog Cards Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">No articles found</h3>
            <p className="text-gray-500 mt-2 text-xs">
              Try adjusting your search query or switching category filters.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-[#009688] text-white rounded-lg font-semibold text-xs hover:bg-[#00796B] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
