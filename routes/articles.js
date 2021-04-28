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

const Articles = require('../models/Article')
const advancedResults = require('../middleware/advancedResults')

router.route('/:id/photo').put(articlePhotoUpload)

router
  .route('/')
  .get(advancedResults(Articles), getArticles)
  .post(createArticle)

router
  .route('/:id')
  .get(getArticle)
  .put(updateArticle)
  .delete(deleteArticle)

module.exports = router