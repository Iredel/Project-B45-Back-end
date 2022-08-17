//connect npm modules
const express = require('express')
const mongoess = require('mongoose')
const cors = require('cors')

const server = express()

server.use(
    cors({
        origin: "*",

    })
)

server.use(express.json({extended: true}))

//routes
server.use('/auth', require('./routes/auth.routes'))

const PORT = 5000

//function start server
async function start(){
    try{
        await mongoess.connect('mongodb+srv://Kremlejija:DOzlBIselhzrtp4y@cluster0.vhjz1.mongodb.net/app?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
        server.get('/',(req, res)=>{
            res.send('Hello world!!!!');
        })
        server.listen(process.env.PORT || PORT,()=>{
            console.log(`Server has started on ${PORT} `)
        })
    }
    catch (e){
        console.log("Server error:", e)
        process.exit(1)
    }
}

start()




//mongoURI : mongodb+srv://Kremlejija:DOzlBIselhzrtp4y@cluster0.vhjz1.mongodb.net/app?retryWrites=true&w=majority