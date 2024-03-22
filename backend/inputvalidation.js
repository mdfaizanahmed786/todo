const zod = require("zod");

const enterTodo = zod.object({
   title: zod.string().min(1),
   description : zod.string().min(1)
})

const updateTodo = zod.object({
    id: zod.string()
})
const userValidation = zod.object({
    username:zod.string().optional(),
    email:zod.string().email(),
    password:zod.string().min(8)
})

module.exports = {
    enterTodo,
    updateTodo,
    userValidation
}