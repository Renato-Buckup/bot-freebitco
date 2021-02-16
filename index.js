const express 	= require('express');
const app = express();

app.get('/', (req, res) => {
	res.status(200).send('<h1><b>Bem vindo ao bot</b></h1>');
	crawler();
});



app.listen(process.env.PORT || 3000);