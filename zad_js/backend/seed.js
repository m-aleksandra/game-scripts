require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const seedDB = async () => {
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categories = await Category.insertMany([
        { name: "Dogs" },
        { name: "Cats" },
        { name: "Small Animals" }
    ]);

    const products = [
        { name: "Dry dog food", price: 120, category: categories[0]._id, image: "dog_food.jpg" },
        { name: "Dog ball toy", price: 30, category: categories[0]._id, image: "dog_ball.jpg" },
        { name: "Dog bed", price: 150, category: categories[0]._id, image: "dog_bed.jpg" },

        { name: "Wet cat food", price: 90, category: categories[1]._id, image: "cat_food.jpg" },
        { name: "Cat scratching post", price: 200, category: categories[1]._id, image: "cat_scratcher.jpg" },
        { name: "Mouse toy for cats", price: 25, category: categories[1]._id, image: "cat_toy.jpg" },

        { name: "Rabbit food", price: 80, category: categories[2]._id, image: "rabbit_food.jpg" },
        { name: "Hamster exercise wheel", price: 50, category: categories[2]._id, image: "hamster_wheel.jpg" },
        { name: "Guinea pig house", price: 120, category: categories[2]._id, image: "guinea_pig_house.jpg" }
    ];

    await Product.insertMany(products);
    console.log("Database seeded successfully!");
    mongoose.connection.close();
};

seedDB();
