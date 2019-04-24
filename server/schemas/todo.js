const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Todo = new Schema({
         content: {
            type: String,
            required: true  
         },
         date: {
            type: String,
            required: true
         }
}, { collection: 'todoLi' });

module.exports = Todo;