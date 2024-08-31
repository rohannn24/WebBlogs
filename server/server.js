import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import env from 'dotenv'
import chalk from 'chalk'
import cookieParser from 'cookie-parser'
import userRouter from './router/user.router.js'
import adminRouter from './router/admin.router.js'
import comRouter from './router/com.router.js'
import categoryRouter from './router/category.router.js'
import homeRouter from './router/home.router.js'


env.config();

const corsAllow = {
    origin: 'http://localhost:5173',
    method: 'POST, GET, PUT, PATCH, HEAD',
    credential: true
}
const app = express();
const dbConnection = () => {
    mongoose.connect(process.env.MONGO_STRING)
    .then(() => {
        console.log(chalk.yellow.inverse.bold('db is connected'))
    }).catch((e) => {
        console.log(e);
    })
}

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server is live'
    })
})

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsAllow));
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/com', comRouter);
app.use('/api/category', categoryRouter);
app.use('/api/home', homeRouter);


app.listen(process.env.PORT, (e) => {
    console.log(e?chalk.red.inverse.bold('Server is not live'):chalk.green.inverse.bold(`Server is live on ${process.env.PORT}`))
    dbConnection();
})