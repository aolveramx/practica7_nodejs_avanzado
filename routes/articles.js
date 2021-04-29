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

const { protect } = require('../middleware/auth')

const Articles = require('../models/Article')
const advancedResults = require('../middleware/advancedResults')

router.route('/:id/photo').put(protect, articlePhotoUpload)

router
  .route('/')
  .get(advancedResults(Articles), getArticles)
  .post(protect, createArticle)

router
  .route('/:id')
  .get(getArticle)
  .put(protect, updateArticle)
  .delete(protect, deleteArticle)

module.exports = router