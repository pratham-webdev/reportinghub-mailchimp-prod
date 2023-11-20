const express = require('express');

const app = express();

const client = require("@mailchimp/mailchimp_marketing");

let postStatus;

const listID = "29e8b48def"


app.use(express.urlencoded({
  extended: true
}));


app.get('/', (req, res) => {
    res.send('<h1>Hello there</h1>');
});


client.setConfig({
    apiKey: "4158c7190a0a6888bdafb06c362dce62-us14",
    server: "us14",
  });

app.post('/sheets/contact', (req, res) => {
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.email;

    const contactData = {
        email_address: email,
        status: 'subscribed',
        tags:['Contact Form'],
        merge_fields: {
            FNAME: fname,
            LNAME: lname
        }
    };

    console.log(contactData);

    const mailRun = async () => {
        const response = await client.lists.addListMember(listID, contactData);


        if (response) {
            postStatus = 'Success'
        }
        res.send(postStatus);
        console.log(postStatus);
    }

    mailRun().catch(err => {
        postStatus = 'There is an error';
        res.send(postStatus);
        console.log(err);
        console.log(postStatus);
    });

});

app.post('/sheets/blog', (req, res) => {
    const email = req.body.email;

    const blogData = {
        email_address: email,
        status: 'subscribed',
        tags:['Blog Subscriber'],
    };

    console.log(blogData);

    const mailRun = async () => {
        const response = await client.lists.addListMember(listID, blogData);


        if (response) {
            postStatus = 'Success'
        }
        res.send(postStatus);
        console.log(postStatus);
    }

    mailRun().catch(err => {
        postStatus = 'There is an error';
        res.send(postStatus);
        console.log(err);
        console.log(postStatus);
    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});