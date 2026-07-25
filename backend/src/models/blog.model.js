const pool = require('../config/db');

const parseBlog = (blog) => {
  if (!blog) return null;
  const newBlog = { ...blog };
  newBlog.isFeatured = Boolean(newBlog.isFeatured);
  
  newBlog.author = {
    name: newBlog.authorName || newBlog.author_name || 'Admin',
    role: newBlog.authorRole || newBlog.author_role || 'Real Estate Specialist',
    avatar: newBlog.authorAvatar || newBlog.author_avatar || '/images/client1.jpeg',
    bio: newBlog.authorBio || newBlog.author_bio || ''
  };

  try {
    if (typeof newBlog.tags === 'string') {
      newBlog.tags = JSON.parse(newBlog.tags);
    }
  } catch (e) {
    newBlog.tags = [];
  }

  newBlog.sections = [
    {
      heading: '',
      content: newBlog.content || ''
    }
  ];

  return newBlog;
};

class BlogModel {
  static async findAll(filters = {}) {
    let query = 'SELECT id, title, slug, excerpt, content, category, author_name as authorName, author_role as authorRole, author_avatar as authorAvatar, author_bio as authorBio, date, read_time as readTime, image, is_featured as isFeatured, tags, keywords, created_at, updated_at FROM blogs';
    const queryParams = [];

    if (filters.category && filters.category !== 'All') {
      query += ' WHERE category = ?';
      queryParams.push(filters.category);
    }

    query += ' ORDER BY id DESC';

    const [rows] = await pool.query(query, queryParams);
    return rows.map(parseBlog);
  }

  static async findByIdOrSlug(idOrSlug) {
    const [rows] = await pool.query(
      'SELECT id, title, slug, excerpt, content, category, author_name as authorName, author_role as authorRole, author_avatar as authorAvatar, author_bio as authorBio, date, read_time as readTime, image, is_featured as isFeatured, tags, keywords, created_at, updated_at FROM blogs WHERE id = ? OR slug = ?',
      [idOrSlug, idOrSlug]
    );
    return parseBlog(rows[0]);
  }

  static async create(data) {
    const {
      title, slug, excerpt, content, category,
      authorName, authorRole, authorAvatar, authorBio,
      date, readTime, image, isFeatured, tags, keywords
    } = data;

    const formattedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const [result] = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content, category, author_name, author_role, author_avatar, author_bio, date, read_time, image, is_featured, tags, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title, formattedSlug, excerpt, content, category || 'Home Buying Guides',
        authorName || 'Piyush Khardekar', authorRole || 'Founder, Brokerless Realty',
        authorAvatar || '/images/client1.jpeg', authorBio || '',
        formattedDate, readTime || '5 min read', image || '/images/blog_hero.png',
        isFeatured === true || isFeatured === 'true' ? 1 : 0,
        JSON.stringify(tags || []), keywords || ''
      ]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const {
      title, slug, excerpt, content, category,
      authorName, authorRole, authorAvatar, authorBio,
      date, readTime, image, isFeatured, tags, keywords
    } = data;

    const formattedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    await pool.query(
      'UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author_name = ?, author_role = ?, author_avatar = ?, author_bio = ?, date = ?, read_time = ?, image = ?, is_featured = ?, tags = ?, keywords = ? WHERE id = ?',
      [
        title, formattedSlug, excerpt, content, category,
        authorName, authorRole, authorAvatar, authorBio,
        date, readTime, image,
        isFeatured === true || isFeatured === 'true' ? 1 : 0,
        JSON.stringify(tags || []), keywords, id
      ]
    );
    return { id, ...data };
  }

  static async remove(id) {
    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = BlogModel;
