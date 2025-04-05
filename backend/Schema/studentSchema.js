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
    Board :{
        type : String,
        required : true
    },
    std :{
        type: Number,
        required : true
    },
    duelRating :{
        type : Number
    },
    testRating : {
        type : Number
    },
    testCompleted:{
        type: Number
    }
})

const Student = mongoose.model('Student',studentSchema)
export {Student}