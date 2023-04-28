const express=require('express');
const bodyParser=require("body-parser");
const $=require('jquery');
const mysql=require('mysql');


const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine",'ejs');

let regerrors=[];
let logerrors=[];



//connecting to the database

var con=mysql.createConnection({
    host:'localhost',
    user:'yourusername',
    password:'yourpassword',
    database:'feedb'
});
con.connect(function(err){
    if (err){
        console.log(err);
    }
    else{
        console.log("Successfully connected harsha");
        //created database

        // con.query("CREATE DATABASE feedb", function (err, result) {
        //     if (err) throw err;
        //     console.log("Database created");
        //     })
        //   });

        // created the table here 

        // var qry="CREATE TABLE student_details (stuid varchar(255),stuname varchar(255),username varchar(255),password varchar(255))";
        // con.query(qry,function(err,result){
        //     if (err){
        //         console.log(err);
        //     }
        //     else{
        //         console.log('Table created!');
        //     }   
        // })

        

    }  
})



app.get('/',function(req,res){
    res.sendFile(__dirname+'/welcome.html');
})

app.get('/success',function(req,res){
    res.sendFile(__dirname+'/views/success.ejs')
    res.render('success');
})
// for register page 

app.get('/register',function(req,res){
    res.sendFile(__dirname+'/views/register.ejs');
    res.render('register',{
        errors:regerrors,
    });
});

app.post('/register',function(req,res){
    var sname=req.body.sname;
    var uname=req.body.uname;
    var pass=req.body.pass;
    var sid=req.body.sid;
    var qry1="INSERT INTO student_details VALUES ('" + sid + "', '" + sname + "', '" + uname + "', '" + pass + "')";
    con.query(qry1,function(err,result){
        if (err) {
            console.log(err);
        }
        else{
            console.log('1 row is inserted');
        }
        
    })
    if (sname.length==0){
        regerrors.push('Student name is mandatory');
    }
    if (!sid){
        regerrors.push('Student id is mandatory');
    }
    if (!uname){
        regerrors.push('User name is mandatory');
    }
    if (!pass){
        regerrors.push('Password is mandatory');
    }

    if (regerrors.length>0){
        res.redirect('/register');
    }
    else{
        res.redirect('/success');
    }
   
})


// for login page 

app.get('/login',function(req,res){
    res.sendFile(__dirname+'/views/login.ejs');
    res.render('login');
});

app.post('/login',function(req,res){
    var lsid=req.body.lsid;
    var luname=req.body.luname;
    var lpass=req.body.lpass;
    var qry2="SELECT COUNT(*) AS count FROM student_details WHERE stuid = '" + lsid + "' AND username = '" + luname + "' AND password = '"+lpass+"'";
    con.query(qry2,function(err,result){
        if (err){
            console.log(err);
        }
        else{
            var count=result[0].count;
            if (count>0){
                var qry3="SELECT sd.stuname,fd.* From student_details sd inner join fee_details fd on sd.stuid=fd.stuid where sd.stuid ='"+ lsid+"'";
                con.query(qry3,function(err,result){
                    if (err){
                        console.log(err);
                    }
                    else{
                        var stuname=result[0].stuname;
                        var stuid=result[0].stuid;
                        var fdy1=result[0].feedueyr1;
                        var fdy2=result[0].feedueyr2;
                        var fdy3=result[0].feedueyr3;
                        var fdy4=result[0].feedueyr4;

                        res.render('loginsuccess',{
                            stuname:stuname,
                            stuid:stuid,
                            fdy1:fdy1,
                            fdy2:fdy2,
                            fdy3:fdy3,
                            fdy4:fdy4
                        })
                        
                    }
                })

            }
            else{
                res.send("You are not a valid user!");
            }
        }
    })
})



app.listen(3000,function(){
    console.log("Running on port 3000");

})

