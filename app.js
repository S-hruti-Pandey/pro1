//import or initialize all the modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { application } = require('express');
const https = require('https');
const { json } = require('body-parser');




//initialize express as object to create a server on port 3000
const app = express();




//to use the static files of the computer
app.use(express.static(__dirname + "/public/"));


//initialize body parser to use it to get the input value in the form of objects from the web page
app.use(bodyParser.urlencoded({extended: true}));






// create a router that sends up the content of the home webpage
// to display it on the user side as response when the browser makes request.
app.get("/",function (req,res) {
    res.sendFile(__dirname + "/signup.html")
});

//to get the input value and process it and send back the response we write
app.post("/",function (req,res) {
    var firstName=req.body.fName //access the input value of the first input in the web page by writing req.body.name_of_input
    var lastName=req.body.lName
    var email = req.body.email

    //to send the data to the mailchimp website so that it can be recorded we 
    //will create a object called "data" in which which we store the info that has to be send . it will be in an object form 

    var data = {
        // members is a property which will contains the array of the objects which contain the info         
        members:[
        {
        email_address : email,
        status:"subscribed",
       // the merge fields will take the data that is to put in the mailchimp merge fields form to store records
        merge_fields:{
           FNAME: firstName,
           LNAME: lastName,
           },
    }
        ],



    };
    // here we need to covert the object "data" into a json object string
    var jasonData = JSON.stringify(data);
    //this data will be sent to mailchimp
    console.log(jasonData);
    // now we need to make a request to the mailchimp through the request module
    const url = "https://us8.api.mailchimp.com/3.0/lists/5d3f9c5bf7";
    //url = "https://<dc>.api.mailchimp.com/3.0/lists/5d3f9c5bf7" change <dc> to last element of api i.e us-8 it is the server on which u get the request
    // option object is made to carry additional property required b y the web server
    const options = {
        method:"POST",
        auth: "shruti1:fa1eb811e93324d594c51bf0c638622e-us8" // authentication 
    };
    // putting the data comming into the variable
    const request = https.request(url,options,function (response) {
        //check for statuscodeand display on loading or after signing up
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function (data) {
            console.log(JSON.parse(data));//it will display the data in response comming to the console from mailchimp
        })
    });
 request.write(jasonData); //send data to milchimp
 request.end();//ending the process

});
//create post request for failure page
app.post("/failure",function (req,res) {
    res.redirect("/");
});


//create a server on port 3000
app.listen(3000,function () {
    console.log("server running");
});
//1dc49d422866a43aeb9a569feb6eac7d-us8


//5d3f9c5bf7