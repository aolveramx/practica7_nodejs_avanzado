const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env variables
dotenv.config({ path: './config/config.env' })

//Load Model
const Article = require('./models/Article')

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

//Read JSON files
const articles = JSON.parse(fs.readFileSync(`${__dirname}/_data/articles.json`, 'utf-8'))

//Import into DB
const importData = async () => {
  try {
    await Article.create(articles)
    console.log('Data Imported...'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

//Delete data
const deleteData = async () => {
  try {
    await Article.deleteMany()
    console.log('Data Destryed...'.red.inverse);
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if(process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
