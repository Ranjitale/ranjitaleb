const express=require('express')
const app=express()
const router=express.Router()
const mongoose = require('mongoose');
const Blog=require('./models/blog')
const bodyParser=require('body-parser')
const cors=require('cors')
require('dotenv').config()
const authRoutes=require('./passport')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
mongoose.connect('mongodb+srv://ranjit:ranjit@cluster0.lfir6st.mongodb.net/website', {
  useNewUrlParser: true,  
  useUnifiedTopology: true
});  

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB successfully!');
});
app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/blogs', async (req, res) => {
    const { author, title, images, description } = req.body;
  
    const newBlog = new Blog({
      author,
      title,
      images,
      description,
      timestamp: new Date().getTime()
    });
  
    await newBlog.save();
})
 
  
router.get("/",authRoutes)

app.listen(3001,(req,res)=>{
    console.log("Connected to the server")
})