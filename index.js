const express = require('express')
const app = express()
const port = process.env.port||5000;
const cors=require('cors');
const connectToMongo=require('./connection')
connectToMongo();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })


  
app.use('/api/auth',require('./routes/auth'));
app.use('/api/category',require('./routes/category'));
app.use('/api/thread',require('./routes/thread'));
app.use('/api/comment',require('./routes/comment'));



  
  
app.listen(port, () => {
    console.log(`NoteBook App listening at port ${port}`)
  })