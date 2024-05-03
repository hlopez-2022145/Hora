import { Schema, model } from "mongoose"

const userSchema = Schema({
    name:{
        type: String,
        requored: true,
    },
    surname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

export default model('user', userSchema)