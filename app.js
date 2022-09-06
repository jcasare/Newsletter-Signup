const express = require('express');
const app = express();
const port =3000;
const https = require('node:https');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/signup.html')
})

app.post('/',(req,res)=>{
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAddress = req.body.email;
  const url = "https://us9.api.mailchimp.com/3.0/lists/cbbd1eda9f";
  const data = {
    members: [
      {
        email_address:emailAddress,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const options = {
    method:"POST",
    auth:"jay1:c5abeb812a28c511db9d89e943202773-us9"
  }
  const request = https.request(url,options,(response)=>{
    response.on('data',(data)=>{
      if(response.statusCode===200){
    const receivedData =JSON.parse(data);
    if(receivedData.error_count === 0){
      res.sendFile(__dirname + '/success.html')
    }
    else {
      res.sendFile(__dirname+ '/failure.html')
    }
}
else{
  res.send("ERROR processing request");
}
    })

  })
  request.write(jsonData);
  request.end();

})

app.post('/failure',(req,res)=>{
  res.redirect('/');
})

app.listen(process.env.PORT ||port  ,()=>{
  console.log("Server started on Port "+ port);
})

// const apiKey = "c5abeb812a28c511db9d89e943202773-us9";

// Audience ID
// cbbd1eda9f
