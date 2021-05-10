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
  res
    .status(200)
    .json(res.advancedResults)
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
  //Add user to req.body
  req.body.user = req.user.id

  //Check for published article
  const publishedArticle = await Article.findOne({ user: req.user.id })

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
  let article = await Article.findById(req.params.id)

  if(!article) {
    return next(
      new ErrorResponse(`No encontramos el artículo con id ${req.params.id}`, 404)
    )
  }

  //Make sure user is article owner
  if (article.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`El usuario ${req.params.id} no esta autorizado para actualizar este artículo `, 401)
    )
  }

  article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

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

  //Make sure user is article owner
  if (article.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`El usuario ${req.params.id} no esta autorizado para borrar este artículo `, 401)
    )
  }

  await article.remove()

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

  //Make sure user is article owner
  if (article.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`El usuario ${req.params.id} no esta autorizado para actualizar este artículo `, 401)
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