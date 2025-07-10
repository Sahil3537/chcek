const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/mailroutes')
const cors = require('cors')
const path = require("path")


app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', routes)

app.listen(port,()=>{
    console.log('server is running on port 3000');
    
})

