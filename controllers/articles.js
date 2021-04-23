const Article = require('../models/Article')

/**
 * @desc Get all articles
 * @route GET /api/v1/articles
 * @access Public
 */
exports.getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find()

    res.status(200).json({
      success: true,
      data: articles
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

/**
 * @desc Get single article
 * @route GET /api/v1/articles/:id
 * @access Public
 */
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)

    res.status(200).json({ 
      success: true, 
      data: article 
    })

    if(!article) {
      return res.status(400).json({ success: false })
    }
  } catch (err) {
    res.status(400).json({ success: false })
  }
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
    return res.status(400).json({ success: false })
  }
}

/**
 * @desc Update article
 * @route PUT /api/v1/article/:id
 * @access Private
 */
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if(!article) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: article })
    
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}

/**
 * @desc Delete article
 * @route DELETE /api/v1/articles/:id
 * @access Private
 */
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)

    if(!article) {
      return res.status(400).json({ success: false })
    }

    res.status(200).json({ success: true, data: {} })
    
  } catch (err) {
    return res.status(400).json({ success: false })
  }
}
