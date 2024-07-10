
import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
    required:true
    }, email: {
        type: String,
        required: true,
    unique:true
}
},{timestamps:true,versionKey:false})

name - string, required
email - string, email, unique, required
password - string, required
createdAt - дата створення
updatedAt - дата оновлення
