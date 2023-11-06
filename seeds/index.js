const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Camground = require('../models/campground')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,  // does not support
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Camground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Camground({
            author: '63de83744d53c1ba9ce6a5af',
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/duivzmmgh/image/upload/v1687442021/YelpCamp/fuymzjfiiemk8dp3ynsu.jpg',
                    filename: 'YelpCamp/fuymzjfiiemk8dp3ynsu'
                },
                {
                    url: 'https://res.cloudinary.com/duivzmmgh/image/upload/v1687442023/YelpCamp/zyz9lqiotaigtop7wcyt.jpg',
                    filename: 'YelpCamp/zyz9lqiotaigtop7wcyt'
                }
            ],
            description: 'this is a camp description',
            price: price
        });
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})