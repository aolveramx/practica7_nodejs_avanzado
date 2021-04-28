const express = require('express')
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  articlePhotoUpload
} = require('../controllers/articles')
const router = express.Router()

router.route('/:id/photo').put(articlePhotoUpload)

router
  .route('/')
  .get(getArticles)
  .post(createArticle)

router
  .route('/:id')
  .get(getArticle)
  .put(updateArticle)
  .delete(deleteArticle)

module.exports = router