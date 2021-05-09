const path = require('path')
const ErrorResponse = require('./utils/errorResponse')
const jimp = require('jimp')
const colors = require('colors')

async function imgConversion() {
  try {
    const image = await jimp.read('public/uploads/test.jpg')

    const thumbnail = image.clone()

    await thumbnail.resize(100, jimp.AUTO)

    await thumbnail.writeAsync('public/uploads/testThumbnail.jpg')
  } catch (error) {
    return new ErrorResponse('Error del servidor al procesar thumbnail', 500)
  }
}

imgConversion()
console.log('Imagen convertida'.green.bold)