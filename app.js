// kai naudojami api .env faile sudedami visi duomenys(name, key secret)
// syueiks kai bus development mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const joi = require('joi')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const Campground = require('./models/campground');
const { reduce } = require('./seeds/cities');
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema, reviewSchema } = require('./schemas')
const Review = require('./models/review')
const User = require('./models/user')

const app = express();


const campgroundsRouter = require('./routes/campgrounds')
const reviewsRouter = require('./routes/reviews')
const usersRouter = require('./routes/user')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,  // does not support
    useUnifiedTopology: true,
    // useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

// passport configuration
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(express.static(path.join(__dirname, 'public')))



app.use((req, res, next) => {

    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/campgrounds', campgroundsRouter)
app.use('/campgrounds/:id/reviews', reviewsRouter)
app.use('/', usersRouter)




app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', { err })
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})
