import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/liste-personnes', (req, res, next) => {
  res.send('helloc');
});


app.get('/liste-personnes', (req, res, next) => {
  res.send('helloc')
});

// app.get('/bad', (req,res) => )
app.listen(port, () => console.log('Server is listening on port ' + port));
