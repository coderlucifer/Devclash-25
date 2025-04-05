import mongoose from "mongoose"

const duelSchema = new mongoose.Schema({
    user1Id : {
        type : String,
        required : true
    },
    user2Id : {
        type : String,
        required : false
    },
    user1Score : {
        type : Number,
        required : true
    },
    user2Score : {
        type : Number,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : true
    }
})

const Duel = mongoose.model('Duel',duelSchema)
export {Duel}