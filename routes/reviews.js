const express = require('express')
const router = express.Router({ mergeParams: true }) // kad gautu visus parametrus
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas')
const Campground = require('../models/campground')
const Review = require('../models/review')
const reviews = require('../controllers/reviews')

const { validateReview, isLoggedIn } = require('../middleware')




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router