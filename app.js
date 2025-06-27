const express = require('express')
const app = express()
const port = 3000
 const routes = require('./routes/mailroutes')




app.use(express.json())

app.use('/api', routes)



app.listen(port,()=>{
    console.log('server is running on port 3000');
    
})

