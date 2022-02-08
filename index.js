//import express
const express = require('express')

const dataService = require('./services/data.services')

const jwt = require('jsonwebtoken')
const cors = require('cors')

//Create app using express
const app = express()

//cors
app.use(cors({
origin:'http://localhost:4200'
// origin:'http://192.168.1.4:8080'
// origin:'http://127.0.0.1:8081'
}))

//parse json
app.use(express.json())

//resolving http request

//get Request - to fetch
app.get('/', (req, res) => {
    res.status(401).send("GET REQUEST!!!")
})

//post request - to create
app.post('/', (req, res) => {
    res.send("POST REQUEST!!!")
})

//put request - to modify
app.put('/', (req, res) => {
    res.send("PUT REQUEST!!!")
})

//patch request - to partially modify
app.patch('/', (req, res) => {
    res.send("PATCH REQUEST!!!")
})

//delete request - to delete
app.delete('/', (req, res) => {
    res.send("DELETE REQUEST!!!")
})

//middleware application specific
// app.use((req,res,next)=>{
//     console.log("APPLICATION SPECIFIC MIDDLEWARE")
//     next()
// })

//middleware-application specific-another way
const logMiddleware = (req, res, next) => {
    console.log("APPLICATION SPECIFIC MIDDLEWARE")
    next()
}
app.use(logMiddleware)

//BankApp

//jwtMiddleware-To validate token
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'supersecretkey123')
        req.currentAcc = data.currentAcc
        next()
    }
    catch {
        res.json({
            statusCode: 401,
            status: false,
            message: 'Please Log In'
        })
    }
}

//Register API
app.post('/register', (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.register(req.body.acno, req.body.password, req.body.uname)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//Login API
app.post('/login', (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.login(req.body.acno, req.body.password)
        .then(result => {
            res.status(result.statusCode).json(result)
           
        })
})

//deposit API
app.post('/deposit', jwtMiddleware, (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.deposit(req.body.acno, req.body.password, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    console.log(req.body);
    //asynchronous
    dataService.withdraw(req, req.body.acno, req.body.password, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//getTransaction API
app.post('/getTransaction/:acno', jwtMiddleware, (req, res) => {
    console.log(req.params.acno);
    //asynchronous
    dataService.getTransaction(req.params.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

//deleteAcc API
app.delete('/deleteAcc/:acno', jwtMiddleware, (req, res) =>{
    //asynchronous
    dataService.deleteAcc(req.params.acno)
    .then(result=> {
        res.status(result.statusCode).json(result)
    })
})


//set port number for server
app.listen(3000, () => {
    console.log("Server started at 3000");
})