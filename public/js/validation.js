const validator = require('validator');

const validation = (name,email,password) =>{
    if(name.trim.length()>1 && (validator.isEmail(email)) && password.length>6){
        return true;
    }
}