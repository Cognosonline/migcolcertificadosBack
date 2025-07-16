import User from '../models/users.model.js';

const user = {}

const getId = async (id) =>{
    try{
        const user = await User.findOne({_id: id})
        return user
    }catch(err){
        return console.log(err)
    }
};


const getOne = async (username) =>{
    try{
        const user = await User.findOne({user: username})
        return user
    }catch(err){
        return console.log(err)
    }
};



const insert = async (name, lastName, email, username, password) =>{
    try{
         const newUser = new User({
            "name":`${name}`,
            "lastName":`${lastName}`,
            "email":`${email}`,
             "user": `${username}`,
             "password": `${password}`
         })

        const user = await newUser.save();

        return user

    }catch(err){
        return console.log(err)
    }
};

user.getId = getId
user.getOne = getOne
user.insert = insert


export default user;