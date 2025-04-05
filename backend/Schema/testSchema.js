import mongoose from "mongoose"

const testSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : false
    },
    score : {
        type : Number,
        required : true
    },
    difficulty :{
        type : String,
        required : false
    }
    
})

const Test = mongoose.model('Test',testSchema)
export {Test}