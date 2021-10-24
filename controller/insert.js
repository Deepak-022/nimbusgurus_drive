var sd=require('express');
var app=sd();
app.use(sd.json());
var conn=require('../model/dbconnection');
const router=sd.Router();
var bcrypt=require('bcrypt');
var validateEmail=require('email-validator');
const validatePhoneNumber = require('validate-phone-number-node-js');

router.post('/add',function(req,res){

    var count=0;
    var mail=req.body.email;
    if(validateEmail.validate(mail))
    {
        var mail1=mail;
        count++;
    }
    else{
        console.log("invalid mail");
    }

    var pass1=req.body.password;
    var pass2=req.body.cpassword;

    if((pass1.length>=7) && (pass1==pass2))
    {
        var pwd=pass1;
        count++;
    }
    else{
        console.log("password miss match or password length is not satisfied");
    }

    var number=req.body.mobile_number;
    if(validatePhoneNumber.validate(number))
    {
        var number2=number;
        count++;
    }
    else
    {
        console.log("not a valid mobile number");
    }
    
    var sql="SELECT mobile_number FROM user_detials WHERE mobile_number = '"+number2+"'";
    conn.query(sql,(err,result)=>{
        if(err) throw(err)
        if(result.length==0 && count==3)
        {
            var sql1 ="INSERT INTO user_detials (firstname,lastname,email,mobile_number,password) VALUES('"+req.body.firstname+"','"+req.body.lastname+"','"+mail1+"','"+number2+"','"+pwd+"')";
            conn.query(sql1,(err,result1)=>{
                if(err) throw(err);
                console.log("one row inserted...");
                res.send("validation completed...");
            });
        }
        else{
            res.send("already exit...")
        }
    });
    
});


router.get('/login',function(req,res){

    var count=0;
    var num=req.body.mobile_number;
    var pass=req.body.password;

    if(validatePhoneNumber.validate(num))
    {
        var number2=num;
        count++;
    }
    else
    {
        console.log("not a valid mobile number");
    }

    if(pass.length>=7)
    {
        var pwd=pass;
        count++;
    }
    else{
        console.log("password not satisfied...");
    }

    if(count==2)
    {
        var sql="SELECT mobile_number,password FROM user_detials WHERE  mobile_number = '"+pwd+"' AND password = '"+number2+"'";

        conn.query(sql,(err,result)=>{
            if(err) throw (err);
            console.log("loged in...");
            res.send("loged in..");
        })

    }
    else{
        console.log("mobile number and password miss match....");
        res.send("password and mobile number miss match..");
    }

})

module.exports = router;