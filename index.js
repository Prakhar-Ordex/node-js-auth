const express = require('express')
const connectDB = require('./src/db/db');
const crudeRouter = require('./src/routes/crud.routes');
const authRouter = require("./src/routes/auth.routes");
const cors = require('cors');
var cookieParser = require('cookie-parser')
const app = express()
const port = 3000

connectDB();

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))   

app.use('/apis', crudeRouter);
app.use('/auth',authRouter)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})