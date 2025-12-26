import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from "./Routes/user.js"
import productRouter from "./Routes/product.js"
import cartRouter from "./Routes/cart.js"
import addressRouter from "./Routes/address.js"
import paymentRouter from "./Routes/payment.js"
import cors from "cors"


const app = express();

app.use(bodyParser.json())

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true

}))

// home testing route
app.get('/', (req, res) => res.json({ message: 'this is home route' }))

// user router
app.use('/api/user', userRouter)

// product router
app.use('/api/product', productRouter)

// cart Router
app.use('/api/cart', cartRouter)

// address router
app.use('/api/address', addressRouter)

// payment Router
app.use('/api/payment',paymentRouter)

mongoose.connect("mongodb+srv://muskanagarwal1901_db_user:RkLVzo8Nl3SAHQ5f@cluster0.slenc3g.mongodb.net/", {
    dbName: "MERN_E_Commerce"
}
).then(() => console.log("MongoDB connected successfully")).catch((err) => console.log(err));

const port = 1000;

app.listen(port, () => console.log(`server is running on port ${port}`))