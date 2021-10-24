var sd=require('express');
var app=sd();
app.use(sd.json());
var insert=require('./controller/insert');

app.use(insert);
app.listen(4000,()=>{
    console.log("Server is running at 4000");
})