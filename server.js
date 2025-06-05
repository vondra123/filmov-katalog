const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const apiRoutes = require('./api/api');
app.use('/api', apiRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
