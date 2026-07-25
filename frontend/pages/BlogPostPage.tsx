import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import PageHeader from '../components/PageHeader';
import { BLOG_POSTS as FALLBACK_POSTS } from '../data/blogData';
import { BlogPost } from '../types';
import { API_BASE_URL } from '../config';

const FacebookIcon = () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>;
const TwitterIcon = () => <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.176-1.336.213-2.033.188.606 1.922 2.36 3.226 4.401 3.251-1.621 1.276-3.666 2.03-5.88 2.03-.38 0-.755-.022-1.124-.067 2.094 1.344 4.585 2.126 7.24 2.126 8.683 0 13.44-7.256 13.44-13.442 0-.204-.005-.407-.014-.61a9.61 9.61 0 002.35-2.44z"/></svg>;

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const fallbackPost = FALLBACK_POSTS.find(p => p.slug === slug);
  const [post, setPost] = useState<BlogPost | null>(fallbackPost || null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>(FALLBACK_POSTS);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE_URL}/api/blogs/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setPost(data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/blogs`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPosts(data);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Article Not Found</h2>
          <p className="text-gray-500 mb-6 text-xs">
            The blog article you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 bg-[#009688] text-white rounded-lg font-semibold text-xs hover:bg-[#00796B] transition-colors"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts.filter(p => p.id !== post.id && p.slug !== post.slug).slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribeMsg('Thank you for subscribing!');
    setEmail('');
    setTimeout(() => setSubscribeMsg(''), 4000);
  };

  const shareTitle = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(window.location.href);

  // Render article markdown content line by line
  const renderContent = (contentStr: string) => {
    const lines = contentStr.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3" />;

      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 mb-4 leading-snug">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg sm:text-xl font-bold text-gray-900 mt-8 mb-3 leading-snug">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-gray-900 mt-6 mb-2 leading-snug">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm text-gray-700 my-1 leading-relaxed">
            {trimmed.replace('- ', '')}
          </li>
        );
      }

      // Format bold text **bold**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-3">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* Page Banner Header matching screenshot */}
      <PageHeader
        title={post.title}
        subtitle={`Written by ${post.author.name} • ${post.date}`}
        backgroundImage={post.image}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Article Card */}
          <div className="lg:col-span-8">
            <AnimatedSection className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200/80 shadow-sm">
              
              {/* Article Content */}
              <div className="prose prose-sm max-w-none text-gray-700">
                {post.sections.map((section, sIdx) => (
                  <div key={sIdx}>
                    {renderContent(section.content)}
                  </div>
                ))}

                {/* Keywords block matching screenshot */}
                {post.keywords && (
                  <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                    <strong className="text-gray-900">Keywords:</strong> {post.keywords}
                  </div>
                )}
              </div>

              {/* Bottom Card Footer: Back to Blog & Share */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => navigate('/blog')}
                  className="text-xs font-bold text-[#009688] hover:underline flex items-center"
                >
                  ← Back to Blog
                </button>

                <div className="flex items-center space-x-3 text-xs text-gray-500 font-semibold">
                  <span>SHARE THIS ARTICLE:</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#009688] transition-colors"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#009688] transition-colors"
                    aria-label="Twitter"
                  >
                    <TwitterIcon />
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Sidebar matching screenshot */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Author Box */}
            <AnimatedSection className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm text-center">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-[#009688]/20"
              />
              <h4 className="text-base font-bold text-gray-900">{post.author.name}</h4>
              <p className="text-xs text-[#009688] font-semibold mb-3">{post.author.role}</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {post.author.bio || 'Dedicated to eliminating middleman costs from Indian real estate. Sharing verified advice on buying, selling, and renting properties directly.'}
              </p>
            </AnimatedSection>

            {/* Newsletter Box */}
            <AnimatedSection className="bg-[#0F1C3F] text-white rounded-2xl p-6 shadow-md">
              <h4 className="text-base font-bold mb-2">Never Miss a Guide</h4>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Subscribe to receive zero-brokerage real estate advice, legal document checklists, and market reports.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#C2185B] hover:bg-[#FF4081] text-white font-bold text-xs rounded-md transition-colors shadow-sm"
                >
                  Subscribe Now
                </button>
              </form>
              {subscribeMsg && (
                <p className="mt-2 text-xs text-emerald-400 text-center font-medium">{subscribeMsg}</p>
              )}
            </AnimatedSection>

            {/* Related Articles Widget */}
            <AnimatedSection className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm">
              <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
                Related Articles
              </h4>

              <div className="space-y-4">
                {relatedPosts.map((rPost) => (
                  <Link
                    key={rPost.id}
                    to={`/blog/${rPost.slug}`}
                    className="group flex items-start space-x-3 text-left"
                  >
                    <img
                      src={rPost.image}
                      alt={rPost.title}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-[#009688] block truncate">
                        {rPost.category}
                      </span>
                      <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#009688] transition-colors line-clamp-2 leading-snug">
                        {rPost.title}
                      </h5>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{rPost.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </AnimatedSection>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
