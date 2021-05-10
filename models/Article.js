const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    index: true,
  },
  operation: {
    type: Boolean,
    index: true,
  },
  price: {
    type: Number,
    index: true,
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  tags: {
    type: [String],
    require: true,
    enum: [
      'lifeStyle',
      'mobile',
      'work',
      'motor',
      'mobility',
      'musical'
    ],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true
  },
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

module.exports = mongoose.model('Article', ArticleSchema)
