const mongoose = require('mongoose')
const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/reactcrud2026')
        console.log("DB Connected..")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connect;