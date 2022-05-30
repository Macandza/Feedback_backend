const { query } = require('express')
const connectDB = require('../db/connect')
require('dotenv').config()
const logger = require('../logger')
//const username = require('./auth')
//let user=abc.username
//var us=sess.username;
//All user methods
// get users
//let username=username;
//console.log("session"+ username)
var userGlobal;


const getAllUsers = (req, res) => {
    try {
        // const getSql = `SELECT * FROM users`
        const getSql = `SELECT u.*, r.name role,r.id role_id, c.name country  FROM users u 
        inner join roles r on u.role_id = r.id
        inner join countries c on u.country_id = c.id`
        connectDB.query(getSql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }
            
            res.status(200).send({
                Success: true,
                Status : 200,
                Users : result
            })
        }) 
    } catch (error) {
        res.status(400).send({
            Success : false,
            Message : error
        })
    }
    
}

// Delete a user
// const deleteUser = (req, res) => {
//     try {
//         email = req.body.email || ""

//         if (email == "") {
//             res.status(412).send({
//                 Success : false,
//                 message : "All fields are required"
//             })
//         } else {
//             // Check if user exists
//             check = `SELECT * FROM users WHERE email = "${email}"`
//             connectDB.query(check, (error, result) => {
//                 if (error) {
//                     res.status(400).send({
//                         Success : false,
//                         message : error
//                     })
//                 }

//                 if (result.length == 0) {
//                     res.status(404).send({
//                         Success : false,
//                         Message: "User does not exist"
//                     })
//                 } else {
//                     const deleteSql = `DELETE FROM users WHERE email = "${email}"`
//                     connectDB.query(deleteSql, (error) => {
//                         if (error) res.status(400).send({
//                             Success : false,
//                             message : error
//                         })

//                         res.status(200).send({
//                             Success : true,
//                             message: `User with email ${email} has been deleted`
//                         })
//                     })
//                 }
//             })
//         }       
//     } catch (error) {
//         res.send(500).send({
//             Success : false,
//             Message : error
//         })
//     }
// }

const deleteUser = async (req, res) => {
    try {
        const { id:email } = req.params

        // check if user exists
        check = `SELECT * FROM users WHERE email = "${email}"`
        connectDB.query(check, (error, result) => {
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            } 

            if (!result.length) {
                res.status(400).send({
                    Success : false,
                    Message : `No user with the email "${email}" exists`
                })
            } else {
                // delete user if email is found
                const deleteUser = `DELETE FROM users WHERE email = "${email}"`
                connectDB.query(deleteUser, (error) => {
                    if (error) {
                        res.status(400).send({
                            Success : false,
                            Message : error
                        })
                    }

                    res.status(200).send({
                        Success : true,
                        Message : `${email} has been deleted`
                    })
                })
            }
        })

    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
}

//All Role methods
// get all roles
const getAllRoles = (req, res) => {
    try {
        const sql = `SELECT r.*, d.name departament FROM roles r 
        inner join departament d on r.id_dept = d.id `
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(404).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Roles : result
            })
        }) 
    } catch (error) {
        res.status(500).send({
            Success : false, 
            message : error
        })
    }
    
}

// Adding roles
const addRole = (req, res) => {
    try {
        role_name  = req.body.name || ""
        departament  = req.body.departament  || ""

        if (role_name == ""|| departament=="") {
            res.status(400).send({
                Success : false,
                Message: "Cannot send an empty field"
            })
        } else {

            // check if role exists
            roleCheck = `SELECT * FROM roles WHERE name = "${role_name}"`
            connectDB.query(roleCheck, (error, result)  => {
                if (error) {
                    res.status(400).send({
                        Success : false,
                        Message : error
                    })
                }

                if (result.length == 0) {
                    let roleSql = `INSERT INTO roles (name,id_dept, created_on, last_updated_on) VALUES ("${role_name}","${departament}", NOW(), NOW())`
                    connectDB.query(roleSql, (error) => {
                        if(error) {
                            res.status(404).send({
                                Success : false,
                                Message : error
                            })
                        }
                        res.status(200).send({ 
                            Success : true,
                            Message: "Role added" })
                    })
                } else {
                    res.status(400).send({ 
                        Success : false,
                        Message : `A role with the name ${role_name} already exists` })
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
}

// update roles
const updateRole = (req, res) => {
    try {
        const { id:id_role } = req.params
       
        newName = req.body.name 
        departament  = req.body.departament 
        //console.log("depppp+"+departament)
               // check if role exists
        roleCheck = `SELECT * FROM roles WHERE id = "${id_role}"`
        connectDB.query(roleCheck, (error, checkResult) => {
            if (error) {
                res.status(400).send({ 
                    Success : false,
                    Message : error 
                })
            }

            if (checkResult.length == 0) {
                res.status(404).send({ 
                    Success : false,
                    Message : `No role with this name` 
                })
            } else {
                const updateSql = `UPDATE roles SET name = "${newName}",id_dept="${departament}" WHERE id = "${id_role}"`
                connectDB.query(updateSql, (error, result) => {
                    if (error) {
                        res.status(404).send({
                            Success : false,
                            message : error
                        })
                    }
                    res.status(200).send({
                        Success : true,
                        message : `Updated successfully`
                    })
                })
            }
        })

        
    } catch (error) {
        res.send(500).send({
            Success : false,
            message : error
        })
    }
    
}

// delete roles
const deleteRole = (req, res) => {
    try {
        const { id:name } = req.params

        // check if role exists
        roleCheck = `SELECT * FROM roles WHERE name = "${name}"`
        connectDB.query(roleCheck, (error, result) =>{
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({ 
                    Success : false,
                    Message : `No role with the name ${name} exists`
                })
            } else {
                const deleteSql = `DELETE FROM roles WHERE name = "${name}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(500).send({
                        Success : false,
                        message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${name} has been deleted`
                    })
                })
            }
        })

        
    } catch (error) {
        res.send(500).send({
            Success : false,
            message : error
        })
    }
    
}

//All country methods
//GET
/*const getAllCountries = (req, res) => {
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
    
}*/

//POST
const addCountry = (req, res) => {
    try {
        country_name  = req.body.name || ""
        if (country_name == "") {
            throw Error({
                Success : false,
                message : "All fileds should be filled"
            })
        } else {

            // check if country exists
            checkCountry = `SELECT * FROM countries WHERE name = "${country_name}"`
            connectDB.query(checkCountry, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        Message : error
                    })
                }

                if (result.length > 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `A country by the name ${country_name} already exists`
                    })
                } else {
                    let countrySql = `INSERT INTO countries (name, created_ON, last_updated_on) VALUES ("${country_name}", NOW(), NOW())`
                    connectDB.query(countrySql, (error) => {
                        if(error) {
                            res.status(404).send({
                                Success : false, 
                                Message : error
                            })
                        }
                        res.status(200).send({ 
                            Success : true,
                            Message: "Country added" 
                        })
                    })
                }
            })
            
        }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//PUT
const updateCountry = (req, res) => {
    try {
        const { id:name } = req.params
        newName = req.body.name || ""

        if ( newName == "") {
            throw Error("Cant send an empty request")
        } else {

            // check if country exists
            checkCountry = `SELECT * FROM countries WHERE name = "${name}"`
            connectDB.query(checkCountry, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        message : error
                    })
                }

                if (result.length == 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `No country by the name ${name} exists`
                    })
                } else {

                    // check if update to new name will be possible
                    newCountry = `SELECT * FROM countries WHERE name = "${newName}"`
                    connectDB.query(newCountry, (error, result) => {
                        if (error) {
                            res.status(400).send({
                                Success : false,
                                Message : error
                            })
                        }

                        if (result.length > 0) {
                            res.status(400).send({
                                Success : false,
                                Message : `The new country name "${newName}" already exists`
                            })
                        } else {
                            const updateSql = `UPDATE countries SET name = "${newName}" WHERE name = "${name}"`
                            connectDB.query(updateSql, (error, result) => {
                                if (error) {
                                    res.status(404).send({
                                        Success : false,
                                        Message : error
                                    })
                                }
                                res.status(200).send({
                                    Success : true,
                                    message : `${name} Updated to ${newName}`
                                })
                            })
                        }
                    })
                }
            })    
        }

        
    } catch (error) {
        res.status(400).send({
            Success : false,
            message : error.message})
    }
    
}

//DELETE
const deleteCountry = (req, res) => {
    try {
        const { id:name } = req.params

        // check if country exist
        checkCountry = `SELECT * FROM countries WHERE name = "${name}"`
        connectDB.query(checkCountry, (error, result) =>{
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({
                    Success : false,
                    Message : `No country by the name ${name} exists`
                })
            } else {
                const deleteSql = `DELETE FROM countries WHERE name = "${name}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(400).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${name} has been deleted`})
                })
            }
        })

        
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error})
    }
    
}

//All service methods
//GET
const getAllService = (req, res) => {
    try {
        const sql = `SELECT * from services`
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Services:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}

//POST
const addService = async (req, res) => {
    try {

        let { name = ""} =req.body

        if(name=="")
            { res.status(400).send({
                Success : false,
                Message : "Cannot send request with empty fields"
            })
        } else {

            // check if service exists
            checkService = `SELECT * FROM services WHERE name = "${name}"`
            connectDB.query(checkService, (error, result) => {
                if (error) {
                    res.status(400).send({
                        Success : false,
                        Message : error
                    })
                }

                if (result.length > 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `A Service with the name ${name} already exists`
                    })
                } else {
                    let branchSql = `INSERT INTO services (name, created_on, last_updated_on) VALUES ("${name}",  NOW(), NOW())`
                            connectDB.query(branchSql, (error) => {
                                if(error) {
                                    res.status(404).send({
                                        Success : false,
                                        Message : error
                                    })
                                }
                                res.status(200).send({ 
                                    Success : true,
                                    Message : "Service added" 
                                })
                            })
                   
                }
            })       
        }       

        
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message})
    }
}

//PUT
const updateBranch = (req, res) => {
    try {
        const { id:name } = req.params
        newName = req.body.name || ''

        if (newName=="") {
            throw Error('All fileds must be filled')
        } else {

            // Check if branch exists
            checkBranch = `SELECT * FROM branches WHERE name = "${name}"`
            connectDB.query(checkBranch, (error, result) => {
                if (error) {
                    res.status(404).send({
                        Success : false,
                        Message : error
                    })
                }
    
                if (result.length == 0) {
                    res.status(404).send({
                        Success : false,
                        Message : `No branch with the name ${name} exists`
                    })
                } else {

                    // check if update will be possible
                    newBranch = `SELECT * FROM branches WHERE name = "${newName}"`
                    connectDB.query(newBranch, (error, result) => {
                        if (error) {
                            res.status(400).send({
                                Success : false,
                                Message : error
                            })
                        }

                        if (result.length > 0) {
                            res.status(400).send({
                                Success : false,
                                Message : `The new name "${newName}" already exists`
                            })
                        } else {
                            const updateSql = `UPDATE branches SET name = "${newName}" WHERE name = "${name}"`
                            connectDB.query(updateSql, (error, result) => {
                                if (error) {
                                    res.status(404).send({
                                        Success : false,
                                        Message : error
                                    })
                                }
                                res.status(200).send({
                                    Success : true,
                                    Message : `${name} Updated to ${newName}`
                                })
                            })
                        }
                    })
                }
            })

            
        }       
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message
        })
    }
    
}

//DELETE
const deleteBranch = (req, res) => {
    try {
        const { id:bName } = req.params

        // Check if branch exists
        checkBranch = `SELECT * FROM branches WHERE name = "${bName}"`
        connectDB.query(checkBranch, (error, result) => {
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({
                    Success : false,
                    Message : `No branch with the name ${bName} exists`})
            } else {
                const deleteSql = `DELETE FROM branches WHERE name = "${bName}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(404).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${bName} has been deleted`
                    })
                })
            }
        })        
    } catch (error) {
        res.status(400).send({
            Success : false,
            Message : error
        })
    }  
}


//All report methods
//GET
const getAllReport = (req, res) => {
    try {
        const sql = 'SELECT r.*, s.name service, u.name user From report r inner join services s on r.id_service = s.id inner join users u on r.id_user = u.id'
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Reports:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}

const getTodayReport = (req, res) => {
       let today = new Date();
        console.log("hoje" +today)
    try {
        
        const sqlTodayReport = `SELECT r.*, s.name service, u.name user From report r inner join services s on r.id_service = s.id inner join users u on r.id_user = u.id WHERE created_on="2022-05-23"`
        connectDB.query(sqlTodayReport, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                TodayReports:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}

const getFinance1 = (req, res) => {
    //var today = new Date();
       
    try {
        
        const sqlFinance1 = 'SELECT r.*, s.name service, u.name user From report r inner join services s on r.id_service = s.id inner join users u on r.id_user = u.id  WHERE chalange="over deposits" AND status=0'
        connectDB.query(sqlFinance1, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                ReportsFinOne:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}


const getFinance2 = (req, res) => {
    //var today = new Date();
       
    try {
        
        const sqlFinance2 = 'SELECT * from report WHERE chalange="over deposits" AND STATUS=2  '
        connectDB.query(sqlFinance2, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                ReportsFinTwo:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}

//POST
const addReport = async (req, res) => {
    const yourDate = new Date()
yourDate.toISOString().split('T')[0]
let t= new Date().toISOString().slice(0, 19).replace('T', ' ');
   
    try {
        customerphone  = req.body.customerphone|| ""
        custname  = req.body.custname|| ""
        challange  = req.body.challange|| ""
        action  = req.body.action|| ""
        stats = req.body.status|| ""
        comments = req.body.comments|| ""
        suggestions  = req.body.suggestions|| ""
        id_user  = req.body.id_user|| ""
        //idUser = req.body.id_user|| ""
        userGlobal = req.body.id_user|| ""
        service  = req.body.service|| ""

        // check if user exists
        if  (customerphone == " "|| custname==""||  challange=="" ||stats  == ""|| service=="" ) {
            throw Error({
                Success : "False",
                message : "All fileds should be filled"
            })
        } else {
        check = `SELECT * FROM users WHERE name = "${id_user}"`
        connectDB.query(check, (error, result) => {
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            } 

            if (!result.length) {
                res.status(400).send({
                    Success : false,
                    Message : `No user with the email "${email}" exists`
                })
            } else {
                // delete user if email is found
                const deleteUser =`INSERT INTO report 
                (
                    customerphone,
                    custname,
                    chalange,
                    actionReport,
                    status,
                    comments,
                    suggestions,
                     id_user,
                    id_service,
                    created_on,
                  last_updated_on) VALUES ("${customerphone}","${custname}","${challange}" ,"${action}","${stats}","${comments}","${suggestions}","${result[0]['id']}","${service}",NOW(), NOW())`
                connectDB.query(deleteUser, (error) => {
                    if (error) {
                        res.status(400).send({
                            Success : false,
                            Message : error
                        })
                    }

                    res.status(200).send({
                        Success : true,
                        Message : `Added successfully`
                    })
                })
            }
        })
    }

    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
}
//console.log("Global"+userGlobal)
//PUT
const updateFinance1 = (req, res) => {
    try {
        //const { id:report_id} = req.params
        id= req.body.id || ''
        
        if (id=="") {
            throw Error('All fileds must be filled')
        } else {
                const updateSql = `UPDATE report SET status = 1 WHERE id = "${id}"`
                connectDB.query(updateSql, (error, result) => {
                    if (error) {
                        res.status(404).send({
                            Success : false,
                            Message : error
                        })
                    }
                    res.status(200).send({
                        Success : true,
                        Message : ` Updated `
                    })
                })
        }       
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message
        })
    }
    
}


//asking for thr support
const upReqSupport = (req, res) => {
    try {
        //const { id:report_id} = req.params
        id= req.body.id || ''
        
        if (id=="") {
            throw Error('All fileds must be filled')
        } else {
                const updateSql = `UPDATE report SET status = 2 WHERE id = "${id}"`
                connectDB.query(updateSql, (error, result) => {
                    if (error) {
                        res.status(404).send({
                            Success : false,
                            Message : error
                        })
                    }
                    res.status(200).send({
                        Success : true,
                        Message : ` Updated `
                    })
                })
        }       
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message
        })
    }
    
}

//DELETE
const deleteReport = (req, res) => {
    try {
        const { id:bName } = req.params

                const deleteSql = `DELETE FROM report WHERE id = "${bName}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(404).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${bName} has been deleted`
                    })
                })
            
               
    } catch (error) {
        res.status(400).send({
            Success : false,
            Message : error
        })
    }  
}

//All report methods
//GET
const getAllFeed = (req, res) => {
    try {
        const sql = `SELECT * from feedback`
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Feedback:result
            })
        })
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error
        })
    }
    
}

//POST
 const addFeed = async (req, res) => {
       try {

        //const { customerphone = " 9999", custname= " bia", challange= " no chall", action= "haaa ", status= "0 ",comments= "no com ",suggestions= " NO sugg", id_user= "10 ",service= " LUCKYBOX"} = req.body
        
        customerphone  = req.body.customerphone|| ""
        custname  = req.body.custname|| ""
        challenge  = req.body.challenge|| ""
        reason  = req.body.reason|| ""
        recommendation  = req.body.recommendation|| ""
        suggestions  = req.body.suggestions|| ""
        id_user  = req.body.id_user|| ""
        service  = req.body.service|| ""

       
       
        //console.log("aquiiiii"+req.body)
        if(customerphone == " " || custname == " " || challenge == " "|| reason == " "|| id_user == " ")
            { res.status(400).send({
                Success : false,
                Message : "Cannot send request with empty fields"
            })
        } else {

            repoQuery = `SELECT * FROM services WHERE name = "${service}"`
                    connectDB.query(repoQuery, (error, result) => {
                        if (error) res.status(400).send({
                            Success: false,
                            Message: error
                        })

                        if (result == 0) {
                            res.status(404).send({
                                Success: false,
                                Message: `Service with the name ${service} does not exist`
                            })
                        } else {

                          service = result[0]['id']
                           
                        
                        let feedSql = `INSERT INTO feedback (
                            customerphone,
                            custname,
                            reason,
                            challenge,
                            suggestion,
                            recommendation,
                            id_user, 
                            id_service,
                            created_on, 
                            last_updated_on) 
                        VALUES ("${customerphone}", "${custname}", "${reason}", "${challenge}","${suggestions}", "${recommendation}","${id_user}","${service}",NOW(), NOW())`
                                        connectDB.query(feedSql, (error) => {
                                            if(error) {
                                                res.status(404).send({
                                                    Success : false,
                                                    Message : error
                                                })
                                            }
                                            res.status(200).send({ 
                                                Success : true,
                                                Message : " added succssesfully" 
                                            })
                                        }) 

                           
                        }
                    })     
        }       

        
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message})
    }
    
}

//PUT
const updateUserRole = (req, res) => {
    try {
       
        const { id:id } = req.params

        newRole = req.body.role || ''
        if (newRole=="") {
            throw Error('All fileds must be filled')
        } else {
                const updateSql = `UPDATE users SET role_id = "${newRole}" WHERE id = "${id}"`
                connectDB.query(updateSql, (error, result) => {
                    if (error) {
                        res.status(404).send({
                            Success : false,
                            Message : error
                        })
                    }
                    res.status(200).send({
                        Success : true,
                        Message : `User role updated successfuly`
                    })
                })
        }       
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message
        })
    }
    
}

//PUT
const updateFeed = (req, res) => {
    try {
        const { id:name } = req.params
        newName = req.body.name || ''

        if (newName=="") {
            throw Error('All fileds must be filled')
        } else {
                const updateSql = `UPDATE branches SET name = "${newName}" WHERE name = "${name}"`
                connectDB.query(updateSql, (error, result) => {
                    if (error) {
                        res.status(404).send({
                            Success : false,
                            Message : error
                        })
                    }
                    res.status(200).send({
                        Success : true,
                        Message : `${name} Updated to ${newName}`
                    })
                })
        }       
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error.message
        })
    }
    
}

//DELETE
const deleteFeed = (req, res) => {
    try {
        const { id:id } = req.params
        console.log(id)
        // Check if branch exists
        checkBranch = `SELECT * FROM feedback WHERE id = "${id}"`
        connectDB.query(checkBranch, (error, result) => {
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({
                    Success : false,
                    Message : `Doesnt exists`})
            } else {
                const deleteSql = `DELETE FROM feedback WHERE id = "${id}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(404).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : ` deleted succefully`
                    })
                })
            }
        })        
    } catch (error) {
        res.status(400).send({
            Success : false,
            Message : error
        })
    }  
}


//DEPARTAMENT METHODS
const getAllDepartaments = (req, res) => {
    try {
        const sql = `SELECT * FROM departament`
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Departaments : result
            })
        })
    } catch (error) {
        res.send(400).send({
            Success : false,
            message : error
        })
    }
    
}

//POST
const addDepartament = (req, res) => {
    try {
        departament_name  = req.body.name || ""
        if (departament_name == "") {
            throw Error({
                Success : false,
                message : "All fileds should be filled"
            })
        } else {

            // check if country exists
            checkDepartament = `SELECT * FROM departament WHERE name = "${departament_name}"`
            connectDB.query(checkDepartament, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        Message : error
                    })
                }

                if (result.length > 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `A country by the name ${departament_name} already exists`
                    })
                } else {
                    let departamentSql = `INSERT INTO departament (name, created_ON, last_updated_on) VALUES ("${departament_name}", NOW(), NOW())`
                    connectDB.query(departamentSql, (error) => {
                        if(error) {
                            res.status(404).send({
                                Success : false, 
                                Message : error
                            })
                        }
                        res.status(200).send({ 
                            Success : true,
                            Message: "Departament added" 
                        })
                    })
                }
            })
            
        }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//PUT
const updateDepartament = (req, res) => {
    try {
        const { id:name } = req.params
        newName = req.body.name || ""

        if ( newName == "") {
            throw Error("Cant send an empty request")
        } else {

            // check if country exists
            checkDepartament = `SELECT * FROM departament WHERE name = "${name}"`
            connectDB.query(checkDepartament, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        message : error
                    })
                }

                if (result.length == 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `No departament by the name ${name} exists`
                    })
                } else {

                    // check if update to new name will be possible
                    newCountry = `SELECT * FROM departament WHERE name = "${newName}"`
                    connectDB.query(newCountry, (error, result) => {
                        if (error) {
                            res.status(400).send({
                                Success : false,
                                Message : error
                            })
                        }

                        if (result.length > 0) {
                            res.status(400).send({
                                Success : false,
                                Message : `The new departament name "${newName}" already exists`
                            })
                        } else {
                            const updateSql = `UPDATE departament SET name = "${newName}" WHERE name = "${name}"`
                            connectDB.query(updateSql, (error, result) => {
                                if (error) {
                                    res.status(404).send({
                                        Success : false,
                                        Message : error
                                    })
                                }
                                res.status(200).send({
                                    Success : true,
                                    message : `${name} Updated to ${newName}`
                                })
                            })
                        }
                    })
                }
            })    
        }

        
    } catch (error) {
        res.status(400).send({
            Success : false,
            message : error.message})
    }
    
}

//DELETE
const deleteDepartament = (req, res) => {
    try {
        const { id:name } = req.params

        // check if country exist
        checkDepartament = `SELECT * FROM departament WHERE name = "${name}"`
        connectDB.query(checkDepartament, (error, result) =>{
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({
                    Success : false,
                    Message : `No departament by the name ${name} exists`
                })
            } else {
                const deleteSql = `DELETE FROM departament WHERE name = "${name}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(400).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${name} has been deleted`})
                })
            }
        })

        
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error})
    }
    
}

//TAXES METHODS
const getAllTaxes = (req, res) => {
    try {
        const sql = `SELECT * FROM taxes`
        connectDB.query(sql, (error, result) =>  {
            if (error) {
                res.status(400).send({
                    Success : false,
                    message : error
                })
            }
            res.status(200).send({
                Success : true,
                Taxes : result
            })
        })
    } catch (error) {
        res.send(400).send({
            Success : false,
            message : error
        })
    }
    
}

//POST
const addTaxes = (req, res) => {
    try {
            tax_name  = req.body.name || ""
            tax_value= req.body.tax_value || ""
           
        if (tax_name == ""|| tax_value =="") {
            throw Error({
                Success : false,
                message : "All fileds should be filled"
            })
        } else {

            // check if country exists
            checkDepartament = `SELECT * FROM taxes WHERE name = "${tax_name}"`
            connectDB.query(checkDepartament, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        Message : error
                    })
                }

                if (result.length > 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `A tax by the name ${tax_name} already exists`
                    })
                } else {
                    let departamentSql = `INSERT INTO taxes (name,tax,created_ON, last_updated_on) VALUES ("${tax_name}",${tax_value}", NOW(), NOW())`
                    connectDB.query(departamentSql, (error) => {
                        if(error) {
                            res.status(404).send({
                                Success : false, 
                                Message : error
                            })
                        }
                        res.status(200).send({ 
                            Success : true,
                            Message: "Tax added successfully" 
                        })
                    })
                }
            })
            
        }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//PUT
const updateTax = (req, res) => {
    try {
        const { id:name } = req.params
        newName = req.body.tax_name || ""
        tax_value = req.body.tax_value || ""

        if ( newName == "") {
            throw Error("Cant send an empty request")
        } else {

            // check if country exists
            checkDepartament = `SELECT * FROM departament WHERE name = "${name}"`
            connectDB.query(checkDepartament, (error, result) =>{
                if (error) {
                    res.status(400).send({
                        Success : false, 
                        message : error
                    })
                }

                if (result.length == 0) {
                    res.status(400).send({
                        Success : false,
                        Message : `No departament by the name ${name} exists`
                    })
                } else {

                    // check if update to new name will be possible
                    newCountry = `SELECT * FROM taxes WHERE name = "${newName}"`
                    connectDB.query(newCountry, (error, result) => {
                        if (error) {
                            res.status(400).send({
                                Success : false,
                                Message : error
                            })
                        }

                        if (result.length > 0) {
                            res.status(400).send({
                                Success : false,
                                Message : `The new departament name "${newName}" already exists`
                            })
                        } else {
                            const updateSql = `UPDATE departament SET name = "${newName}",tax = "${tax_value}" WHERE name = "${name}"`
                            connectDB.query(updateSql, (error, result) => {
                                if (error) {
                                    res.status(404).send({
                                        Success : false,
                                        Message : error
                                    })
                                }
                                res.status(200).send({
                                    Success : true,
                                    message : `${name} Updated to ${newName}`
                                })
                            })
                        }
                    })
                }
            })    
        }

        
    } catch (error) {
        res.status(400).send({
            Success : false,
            message : error.message})
    }
    
}

//DELETE
const deleteTaxes = (req, res) => {
    try {
        const { id:name } = req.params

        // check if country exist
        checkDepartament = `SELECT * FROM taxes WHERE name = "${name}"`
        connectDB.query(checkDepartament, (error, result) =>{
            if (error) {
                res.status(400).send({
                    Success : false,
                    Message : error
                })
            }

            if (result.length == 0) {
                res.status(404).send({
                    Success : false,
                    Message : `No tax by the name ${name} exists`
                })
            } else {
                const deleteSql = `DELETE FROM tax WHERE name = "${name}"`
                connectDB.query(deleteSql, (error) => {
                    if (error) res.status(400).send({
                        Success : false,
                        Message : error
                    })

                    res.status(200).send({
                        Success : true,
                        Message : `${name} has been deleted`})
                })
            }
        })

        
    } catch (error) {
        res.status(500).send({
            Success : false,
            Message : error})
    }
    
}


module.exports = {
    getAllUsers,
    deleteUser,
    //getAllCountries,
    getAllService,
    getAllRoles,
    getAllService,
    getAllReport,
    getAllFeed,
    getTodayReport,
    addReport,
    addCountry,
    addService,
    addRole,
    addFeed,
    updateCountry,
    updateFinance1,
    updateRole,
    updateFeed,
    updateUserRole,
    deleteCountry,
    deleteFeed,
    deleteRole,
    deleteReport,
    getFinance1,
    getFinance2,
    upReqSupport,
    addDepartament,
    getAllDepartaments,
    updateDepartament,
    deleteDepartament,
    addTaxes,
    getAllTaxes,
    updateTax,
    deleteTaxes,
    
}