const express = require('express');
const connectDB = require('./config/db');
var bodyParser = require('body-parser');
const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

app.use('/image', require('./routes/image'));
app.use('/uploads', express.static('./uploads'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
