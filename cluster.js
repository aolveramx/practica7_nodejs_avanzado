const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const os = require('os')
const cluster = require('cluster')

//Load env variables
dotenv.config({ path: './config/config.env' })

//Create clusters times CPU cores
if (cluster.isMaster) {
  console.log('Runinng in Master')

  const coreNum = os.cpus().length

  for (let i = 0; i < coreNum; i++) {
    cluster.fork()
  }

  cluster.on('listening', (worker, address) => {
    console.log(`Worker ${worker.id} PID ${worker.process.pid} its running at port ${address.port}`)
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} PID ${worker.process.pid} exit with code ${code} and signal ${signal}`)
    console.log('New worker created')
    cluster.fork()
  })

} else {
  //Connect to database
  connectDB()

  //Route files
  const articles = require('./routes/articles')
  const auth = require('./routes/auth')

  //Init express
  const app = express()

  //Body parser
  app.use(express.json())

  //Cookie parser
  app.use(cookieParser())

  //Init i18n
  app.use(i18n.init)

  //Website routes
  app.get('/', (req, res) => { res.render('index', { title: 'WallaFake API' }) })
  app.use('/change-locale', require('./routes/change-locale'))

  //Dev loggin middleware
  if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
  }

  //File uploading
  app.use(fileupload())

  //Sanitize Data
  app.use(mongoSanitize())

  //Set security headers
  app.use(helmet())

  //Prevent XSS attacks
  app.use(xss())

  //Rate limiting
  const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_MINUTES * 60 * 1000,
  max: process.env.MAX_RATE_LIMIT
  })

  app.use(limiter)

  //Prevent http param pollution
  app.use(hpp())

  //Enable CORS
  app.use(cors())

  //Register view engine
  app.set('view engine', 'ejs')

  //Load assets for Website
  app.use('/css', express.static(path.resolve(__dirname, 'assets/css')))
  app.use('/img', express.static(path.resolve(__dirname, 'assets/img')))
  app.use('/js', express.static(path.resolve(__dirname, 'assets/js')))
  app.use('/favicon', express.static(path.resolve(__dirname, 'assets/favicon')))

  //Set static folder
  app.use(express.static(path.join(__dirname, 'public')))

  //Mount routers
  app.use('/api/v1/articles', articles)
  app.use('/api/v1/auth', auth)

  //Init error middleware
  app.use(errorHandler)

  const PORT = process.env.PORT || 5000

  const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `.yellow.bold)
  )

  //Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  //Close server & exit process
  server.close(() => process.exit(1))
  })

}