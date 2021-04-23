const Article = require('../models/Article')

/**
 * @desc Get all articles
 * @route GET /api/v1/articles
 * @access Public
 */
exports.getArticles = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all articles' })
}

/**
 * @desc Get single article
 * @route GET /api/v1/articles/:id
 * @access Public
 */
exports.getArticle = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show article ${req.params.id}` })
}

/**
 * @desc Create new article
 * @route POST /api/v1/articles
 * @access Private
 */
exports.createArticle = async (req, res, next) => {
  try {
    const article = await Article.create(req.body)

    res.status(201).json({ 
      success: true, 
      data: article 
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc Update article
 * @route PUT /api/v1/article/:id
 * @access Private
 */
exports.updateArticle = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update article ${req.params.id}` })
}

/**
 * @desc Delete article
 * @route DELETE /api/v1/articles/:id
 * @access Private
 */
exports.deleteArticle = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete article ${req.params.id}` })
}
