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

app.post('/sheets', (req, res) => {
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.email;

    const data = [{
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            FNAME: fname,
            LNAME: lname
        }
    }];

    console.log(data);

    const mailRun = async () => {
        const response = await client.lists.batchListMembers(listID, {
            members: data,
          });


        if (response.total_created > 0) {
            postStatus = 'Success'
        } else if (response.error_count > 0) {
            postStatus = response.errors;
        }
        res.send(postStatus);
        console.log(postStatus);
    }

    mailRun().catch(err => console.log(err));

});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});