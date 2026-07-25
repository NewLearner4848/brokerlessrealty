const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');
const { handleSingleUpload } = require('../middleware/upload.middleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/:idOrSlug', getBlogByIdOrSlug);

// Protected admin routes
router.post('/upload', protect, handleSingleUpload, uploadImage);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
