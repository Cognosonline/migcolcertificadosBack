import mongoose from "mongoose";

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type:String},
    lastName:{type:String},
    email:{type:String},
    user: {type: String},
    password: {type: String},    
    role: {type: String, default:'Profesor'},
    createDate : {type: Date, default: Date.now()}
});

export default mongoose.model('user', userSchema);