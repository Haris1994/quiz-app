const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = '5c74f40dbb29f0183efadb62';

if(!ObjectID.isValid(id)){
    console.log('Id not valid');
}
Todo.find({
    _id : id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.find({
    _id : id
}).then((todo) => {
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    console.log('Todo by id', todo);
}).catch((e) => console.log(e));