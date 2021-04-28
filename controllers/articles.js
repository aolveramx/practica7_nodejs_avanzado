const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Article = require('../models/Article')

/**
 * @desc Get all articles
 * @route GET /api/v1/articles
 * @access Public
 */
exports.getArticles = asyncHandler(async (req, res, next) => {
  let query

  const reqQuery = { ...req.query }

  //Fields to exclude
  const removeFields = ['sort', 'page', 'limit']

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param])

  //Create query String
  let queryStr = JSON.stringify(reqQuery)

  //Create operators ($gt, gte, ...) with Regex
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  //Finding resource
  query = Article.find(JSON.parse(queryStr))

  //sort
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page -1) * limit
  const endIndex = page * limit
  const total = await Article.countDocuments()

  query = query.skip(startIndex).limit(limit)

  //Executing query
  const articles = await query

  //Pagination result
  const pagination = {}

  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if(startIndex > 0) {
    pagination.prev = {
      page: page -1,
      limit
    }
  }

  res
    .status(200)
    .json({
    success: true,
    count: articles.length,
    pagination,
    data: articles
  })
})

/**
 * @desc Get single article
 * @route GET /api/v1/articles/:id
 * @access Public
 */
exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id)

  if(!article) {
    return next(
      new ErrorResponse(`No encontramos el artículo con id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ 
    success: true, 
    data: article 
  })
})

/**
 * @desc Create new article
 * @route POST /api/v1/articles
 * @access Private
 */
exports.createArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.create(req.body)

  res.status(201).json({ 
    success: true, 
    data: article 
  })
})

/**
 * @desc Update article
 * @route PUT /api/v1/article/:id
 * @access Private
 */
exports.updateArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!article) {
    return next(
      new ErrorResponse(`No encontramos el artículo con id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: article })
  
})

/**
 * @desc Delete article
 * @route DELETE /api/v1/articles/:id
 * @access Private
 */
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id)

  if(!article) {
    return next(
      new ErrorResponse(`No encontramos el artículo con id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: {} })
})

/**
 * @desc Upload photo for article
 * @route PUT /api/v1/articles/:id/photo
 * @access Private
 */
 exports.articlePhotoUpload = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id)

  if(!article) {
    return next(
      new ErrorResponse(`No encontramos el artículo con id ${req.params.id}`, 404)
    )
  }

  if(!req.files) {
    return next(
      new ErrorResponse('Por favor carga una foto', 400)
    )
  }

  const file = (req.files.file)

  //Make shure the image is a photo
  if(!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse('Por favor carga un archivo de imagen', 400)
    )
  }

  //Check filesize
  if(file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Por favor carga un archivo de imagen menor a ${process.env.MAX_FILE_UPLOAD}`, 400)
    )
  }

  //Create custom filename
  file.name = `photo_${article._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if(err) {
      console.error(err)
      return next(
        new ErrorResponse('Error del servidor al procesar tu archivo', 500)
      )
    }
    await Article.findByIdAndUpdate(req.params.id, { photo: file.name })

    res.status(200).json({
      success: true,
      data: file.name
    })
  })
})