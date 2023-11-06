const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});
// nereikia saugoti db
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const CamgroundSchema = new Schema({
    title: String,
    images: [
        ImageSchema
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

// query middleware
// istrins visus susijusius irasus
// kai trinama, objektas paduodamas parametru
CamgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        // istrins visus atsiliepimus, kuriu id yra doc.reviews parametre/masyve
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CamgroundSchema)

