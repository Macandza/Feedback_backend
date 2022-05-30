const connectDB = require('../db/connect')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
require('dotenv').config()
const logger = require('../logger')
const crypto = require('crypto')
const axios = require('axios')
const sendEmail = require('../utils/sendEmail')
const { randomInt } = require('crypto')
const session = require('express-session');
//All user methods
// user login
//var sess;
/*app.use(
    session({
    secret: 'thisisasecret',
    saveUninitialized: false,
    resave: false
    })
    );*/

    //var sess;


const login = async (req, res) => {
    try {
        const { username, password } = req.body || ""

        //console.log(username)
       // sess=req.session;
        //sess.username;

        //validate user input
        if ((username && password) == "") {
            res.status(412).send({
                success: false,
                message: "All input is required"
            })
        } else {
            //check db if user exists
            const sql = `SELECT u.*, r.name role,r.id role_id, c.name country  FROM users u 
            inner join roles r on u.role_id = r.id
            inner join countries c on u.country_id = c.id where u.username="${username}"`
            user = connectDB.query(sql, (error, result) => {
                if (error) {
                    logger.error(error)
                    res.status(400).send({
                        Success: false,
                        Message: error
                    })
                }
                if (!result.length) {
                    return res.status(400).json({
                        success: false,
                        message: "Username does not exist"
                    })
                }
                //check password
                bcrypt.compare(req.body.password, result[0]['password'], (error, pResult) => {
                    if (error) {
                        throw error;
                    }
                    //generate token
                    if (pResult) {
                        const token = jwt.sign(
                            { user_id: result[0].id },
                            process.env.TOKEN_KEY,
                            { expiresIn: "1h" })
                        return res.status(200).json({
                            success: true,
                            message: "Logged In", token,
                            payload: {
                                user_id: result[0].id,
                                role_id: result[0].role_id,
                                username: result[0].username,
                                name: result[0].name,
                                //msisdn: result[0].msisdn,
                                email: result[0].email,
                                role: result[0].role,
                                //branch: result[0].branch,
                                id_no: result[0].id_no,
                                country: result[0].country
                            }
                        })
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: `Wrong Password`
                        })
                    }
                })
            })
        }
    } catch (error) {
        res.status(500).send({
            "Success": false,
            "message": error.message
        })
    }
}

//Get countries to make user select when sign up

const getAllCountries = (req, res) => {
    try {
        const sql = `SELECT * FROM countries`
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Countries : result
            })
        })
    } catch (error) {
        res.send(400).send({
            Success : false,
            message : error
        })
    }
    
}

// register user
const register = async (req, res) => {
    try {

        let { name = "", username = "", email = "", password = "",country_id = ""} = await req.body
        console.log( req.body)
        let role=7
        if (name == "" || username == "" || email == "" || password == ""  ||country_id == "") {
            res.status(412).send({
                Success: false,
                Message: "Cannot send with empty fields"
            })
        } else {
            // Encrypted password
            let encryptedpassword = await bcrypt.hash(password, saltRounds)

            // Check if user exists
            check = `SELECT * FROM users WHERE username = "${username}"`
            connectDB.query(check, (error, cResult) => {
                if (error) {
                    res.status(400).send({
                        Success: false,
                        Message: error
                    })
                }

                if (cResult.length > 0) {
                    res.status(400).send({
                        Success: false,
                        Message: "User already exists"
                    })
                } else {
                    
                         
                     let userSql = `INSERT INTO users 
                     (name, username,email,role_id,country_id, password, created_on, last_updated_on) 
                     VALUES ("${name}", "${username}", "${email}","${role}", "${country_id}", "${encryptedpassword}", NOW(), NOW())`

                     connectDB.query(userSql, (error) => {
                         if (error) {
                             res.status(400).send({
                                 Success: false,
                                 Message: error
                             })
                         }

                         res.status(200).send({
                             Success: true,
                             Message: "User added"
                         })
                     })
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            Success: false,
            msg: error.message
        })
    }
}

// pin reset
const reset = async (req, res) => {
    try {
        const { msisdn } = req.body || ""
        if (msisdn == "") {
            res.status(400).send({
                "Success": false,
                "message": "Cannot send a request with empty fields"
            })
        } else {
            pin = Math.floor(1000 + Math.random() * 9000)
            var dear = `Your new pin is ${pin}`
            // res.send({pin})
            await axios.post('http://localhost:1600/send_sms', {
                "msisdn": msisdn,
                "text": dear,
                "pin": pin
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            }).catch(err => {
                console.log("err", err)
            })

            let userSql = `UPDATE users SET pin =${pin} WHERE msisdn = ${msisdn}`

            connectDB.query(userSql, (error) => {
                if (error) {
                    res.status(400).send({
                        Success: false,
                        Message: error
                    })
                }
                res.status(200).send({
                    Success: true,
                    Message: "Reset pin sent"
                })
            })

            // // console.log(pinRes['status'])
            // if (pinRes['status'] == 200) {
            //     res.status(200).send({
            //         "Success": true,
            //         "Message": "Reset pin sent"
            //     })
            // }

        }

    } catch (error) {
        res.status(500).send({
            Success: false,
            "Message": error
        })
    }

    // const pin = crypto.randomInt(0, 10000, (error, n) => {
    //     console.log(n)
    //     // console.log("09203902".substring(-1))
    //     n = ("00000" + n).substring(4)
    //     // n= n.substring(4)
    //     res.status(200).send({
}

// const passwordReset = async ( req, res ) => {
//     try {
//         const  { username, email } = req.body || ""

//         if (username == "" || email == "") {
//             res.status(400).send({
//                 Success : false,
//                 Message : "Cannot send an empty request"
//             })
//         } else {
//             // check if user exists
//             const check = `SELECT * FROM users WHERE username = "${username}"`
//             connectDB.query(check, (error, result) => {
//                 if (error) res.status(400).send({
//                     Success : false,
//                     Message : error
//                 })

//                 console.log(result.length)

//                 if (!result.length) {
//                     res.status(404).send({
//                         Success : false,
//                         Message : `User with username "${username}" does not exist`
//                     })
//                 } else {
//                     let token = crypto.randomBytes(32).toString('hex')
//                     window
//                     // console.log(token)
//                     let send = sendEmail(email, token)
//                     // console.log(send)
//                 }
//             })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

// const passwordReset_link = async (req, res, email, token) => {
//     const { newPassword, confirmPassword } = req.body || ""

//     // check if link is valid
//     if (token == token) {
//         res.status(400).send({
//             Success :false,
//             Message : 'Link is invalid'
//         })
//     }  
// }

// password reset
const passwordReset = async (req, res) => {
    try {
        const { msisdn } = req.body || ""

        if (msisdn == "") {
            res.status(400).send({
                Success: false,
                Message: "Cannot send a request with empty fields"
            })
        } else {
            let pin = Math.floor(1000 + Math.random() * 9000)
            console.log(pin)

            let newPin = pin.toString()

            // ENCRYPT NEW PIN
            let encryptedPin = await bcrypt.hash(newPin, saltRounds)

            const sql = `select * from users where msisdn = "${msisdn}"`
            connectDB.query(sql, (error, result) => {
                if (error) res.status(400).send({
                    Success: false,
                    Message: error
                })

                // console.log(!result.length)

                if (!result.length) {
                    res.status(400).send({
                        Success: false,
                        Message: "No user exists with the provided phone number"
                    })
                } else {
                    try {
                        const passRes = axios.post(`http://localhost:1600/send_sms`, {
                            "msisdn": msisdn,
                            "text": pin
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                "Access-Control-Allow-Origin": "*",
                            }
                        }).catch(err => {
                            // console.log("err", err)
                            logger.error(err.message)
                        })

                        if (passRes['status'] == 200) {
                            // update db with new password
                            const update = `UPDATE users SET password = "${encryptedPin}" WHERE msisdn = "${msisdn}"`
                            connectDB.query(update, (error, result) => {
                                if (error) res.status(400).send({
                                    Success: false,
                                    Message: error
                                })

                                res.status(200).send({
                                    Success : true,
                                    Mesage : "Password updated"
                                })
                                // console.log(result)
                            })
                        }

                    } catch (error) {
                        logger.error(error.message)
                    }
                }

            })
        }
    } catch (error) {
        logger.error(error.message)
        // console.log(error)
    }
}

module.exports = { login, register, reset, passwordReset,getAllCountries }