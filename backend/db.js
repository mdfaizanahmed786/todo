const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ahmedriyan528:KZM1ObUQrnbAJ0pa@cluster0.zstrq1a.mongodb.net/todos")

const TodoSchema = new mongoose.Schema({
      title:{
            type:String,
            required:true
        },
        createdBy:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        isEdited:Boolean
    }, {
        timestamps:true
    })
    const UserSchema = new mongoose.Schema({
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        isVerified:{
            type:Boolean,
            default:false
        }
    })
    const Users = mongoose.model("Users", UserSchema)
const Todos = mongoose.model("Todos",TodoSchema)

module.exports = {
    Todos,
    Users
}