import mongoose from "mongoose";

const Schema = mongoose.Schema

const certificateSchema = new Schema({
    fileName:{type:String, default:null},
    courseId:{type:String},
    
    // Coordenadas y estilos para el nombre
    nameX:{type:Number, default:'10'},
    nameY:{type:Number, default:'35'},
    nameFontSize: {type:Number, default:20},
    nameFontFamily: {type: String, default:'Arial'},
    nameColor: {type:String, default: '#000000'},
    nameItalic: {type:Boolean, default: false},
    nameBold: {type:Boolean, default: false},
    
    // Coordenadas y estilos para el documento
    documentX:{type:Number, default:'10'},
    documentY:{type:Number, default:'65'},
    documentFontSize: {type:Number, default:20},
    documentFontFamily: {type: String, default:'Arial'},
    documentColor: {type:String, default: '#000000'},
    documentItalic: {type:Boolean, default: false},
    documentBold: {type:Boolean, default: false},
    
    // Coordenadas y estilos para el nombre del curso
    courseNameX:{type:Number, default:'10'},
    courseNameY:{type:Number, default:'100'},
    courseNameFontSize: {type:Number, default:20},
    courseNameFontFamily: {type: String, default:'Arial'},
    courseNameColor: {type:String, default: '#000000'},
    courseNameItalic: {type:Boolean, default: false},
    courseNameBold: {type:Boolean, default: false},
    
    // Coordenadas y estilos para la fecha
    dateX:{type:Number, default:'10'},
    dateY:{type:Number, default:'130'},
    dateFontSize: {type:Number, default:20},
    dateFontFamily: {type: String, default:'Arial'},
    dateColor: {type:String, default: '#000000'},
    dateItalic: {type:Boolean, default: false},
    dateBold: {type:Boolean, default: false},
    
    widthR:{type:Number, default:0},
    heightR:{type:Number, default:0},
    
    // Campos legacy para compatibilidad (deprecated)
    fontsize: {type:Number, default:20},
    fontFamily : {type: String, default:'Arial'},
    color: {type:String, default: '#000000'},
    italic: {type:Boolean, default: true},    
    
    state:{type:String, default:'0'},
    reqScore :{type: Number, default: '0'},
    createDate : {type: Date, default: Date.now()}
});

export default mongoose.model('certificate', certificateSchema);