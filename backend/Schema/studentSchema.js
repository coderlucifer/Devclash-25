import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    class :{
        tyoe: String,
        required : true
    },

    Board :{
        type : String,
        required : true
    },
    duelRating :{
        type : Number,
        required : true
    },
    testRating : {
        type : Number,
        required : true
    }
})

const Student = mongoose.model('Student',studentSchema)
export {Student}