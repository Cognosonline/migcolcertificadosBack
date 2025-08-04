import mongoose from "mongoose";

const Schema = mongoose.Schema

const certificateSchema = new Schema({
    fileName:{type:String, default:null},
    courseId:{type:String},
    nameX:{type:Number, default:'10'},
    nameY:{type:Number, default:'35'},
    documentX:{type:Number, default:'10'},
    documentY:{type:Number, default:'65'},
    courseNameX:{type:Number, default:'10'},
    courseNameY:{type:Number, default:'100'},
    dateX:{type:Number, default:'10'},
    dateY:{type:Number, default:'130'},
    widthR:{type:Number, default:0},
    heightR:{type:Number, default:0},
    fontsize: {type:Number, default:20},
    fontFamily : {type: String, default:'Arial'},
    color: {type:String, default: '#000000'},
    italic: {type:Boolean, default: true},    
    state:{type:String, default:'0'},
    reqScore :{type: Number, default: '0'},
    createDate : {type: Date, default: Date.now()}
});

export default mongoose.model('certificate', certificateSchema);