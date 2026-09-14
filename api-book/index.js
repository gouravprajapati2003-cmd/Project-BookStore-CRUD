const express = require('express')
const cors = require('cors')
const connect = require('./connection')
const book = require('./routes/BookRoutes')
const createAdmin = require('./createAdmin');
const User = require('./routes/UserRoutes');
const discount = require('./routes/DiscountRoutes')
const app = express();
app.use(cors());
app.use(book);
app.use(discount);
app.use(User);
connect();
createAdmin();


app.listen(3000, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("Server is Running on 3000")
    }
});