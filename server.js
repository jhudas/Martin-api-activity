require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const baseUri = process.env.BASE_URI || '/api/v1';

const apiRoutes = require('./src/routes/apiRoutes');
app.use(baseUri, apiRoutes);

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
    console.log(`Base URI: http://localhost:${port}${baseUri}`);  
});