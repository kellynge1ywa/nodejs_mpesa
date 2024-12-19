import express from "express";
import cors from "cors";
import 'dotenv/config';
import lipaNaMpesaRoutes from "./routes/lipaNaMpesa.js";

//initialize express
const app= express();

const PORT= process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

app.use('/api', lipaNaMpesaRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Lipa Na Mpesa API!');
});

app.listen(PORT, ()=>{
    console.log(`The app is running on port: http://localhost:${PORT}`);
})





