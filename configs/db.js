// db.js
import mongoose from 'mongoose';

mongoose.set("strictQuery", true);


export default mongoose.connect(process.env.URI_DB)
    .then(db =>{
        console.log('DB is connect')
    }).catch(err =>{
        console.log(err)
    })