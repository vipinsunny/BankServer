//import jsonwebtoken
const jwt = require('jsonwebtoken')

const db = require('./db')


users = {
  1000: { acno: 1000, uname: "Vipin", password: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Kevin", password: "1001", balance: 4000, transaction: [] },
  1002: { acno: 1002, uname: "Mini", password: "1002", balance: 3000, transaction: [] }
}

//Register definition
const register = (acno, password, uname) => {
  //ASYNCHRONOUS
  return db.User.findOne({ acno })
    .then(user => {
      console.log(user);
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: "Account already Exists... Please Login!!!!"
        }
      }
      else {
        const newUser = new db.User({
          acno,
          uname,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "Account created sucessfully!!!!"
        }
      }
    })
}


//login definition
const login = (acno, password) => {

  //asynchronous call

  return db.User.findOne({acno,password})
    .then(user => {
      if (user) {
        currentAcno = acno
        currentUserName = user.uname

        //token generation
        const token = jwt.sign({
          currentAcc: acno
        }, 'supersecretkey123')

        return {
          statusCode: 200,
          status: true,
          message: "Sucessfully Logged In!!!!",
          currentAcno,
          currentUserName,
          token
        }

      }
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials"
      }

    })
}






//deposit
const deposit = (acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (user) {
      user.balance = user.balance + amount
      user.transaction.push({
        amount: amount,
        type: "CREDIT"
      })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: amount + " credited. New balance is : " + user.balance

      }
    }
    return {
      statusCode: 401,
      status: false,
      message: "Invalid Credentials"
    }
  })
}


//withdraw
const withdraw = (req, acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password
  }).then(user => {
    if (req.currentAcc != acno) {
      return {
        statusCode: 401,
        status: false,
        message: "Permission Denied!!!"
      }
    }
    if (user) {
      if (user.balance > amount) {
        user.balance = user.balance - amount
        user.transaction.push({
          amount: amount,
          type: "DEBIT"
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: amount + " debitted. New balance is : " + user.balance
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: "Insufficient Balance"
        }
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "Invalid Credentials!!!!"
      }
    }
  })

}

//transaction
const getTransaction = (acno) => {
  // acno = req.currentAcc
    console.log(acno);
  return db.User.findOne({
    acno
  }).then(user=>{
    if(user){
  return {
      statusCode: 200,
      status: true,
      transaction: user.transaction
    }

  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: "Invalid Credentials!!!!"
    }
  }
})
}


//deleteAcc
const deleteAcc=(acno)=>{
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(user){
      return{
      statusCode: 200,
      status: true,
      message: "Account deleted successfully!!!"
    }
  }
  else{
    return {
      statusCode: 401,
      status: false,
      message: "Operation Denied"
    }
  }
  })
}


//export
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}