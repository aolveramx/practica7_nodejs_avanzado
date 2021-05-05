const express = require('express')
const router = express.Router()

// GET /change-locale/:locale
router.get('/:locale', function(req, res, next) {
  const locale = req.params.locale
  res.cookie('wallafake-locale', locale, { maxAge: 24 * 60 * 60 * 60 * 1000 })
  res.redirect(req.get('referer'))
})

module.exports = router