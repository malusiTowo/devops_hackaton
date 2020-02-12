const express = require('express');
const Prometheus = require('./utils/prometheus');
const admin = require("firebase-admin");
const bodyParser = require('body-parser');
const cors = require('cors');
const serviceAccount = require("./bleemeo-sdk-firebase");

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bleemeo-6bfb3.firebaseio.com"
});

const app = express();
const port = process.env.PORT || 80;
app.use(cors());

app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function addUser(request) {
  const { names } = request.body;
  let namesRandom = shuffle(names);
  firebase.firestore().collection('Users').add({
    names: namesRandom,
    time: Date.now()
  });
}

function getUser(_, response) {
  firebase.firestore().collection('Users').orderBy('time')
    .get().then(users => {
      let userToPush;
      users.forEach(user => {
        userToPush = user.data().names;
      });
      return response.status(200).json({
        names: userToPush,
      })
    }).catch(error => {
      return response.status(400).json({
        message: "Users not found",
        error: error
      })
    });
}

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/test.html');
});
app.get('/result', getUser);
app.post('/add-names', addUser);

app.listen(port, () => console.log('Server is listening on port ' + port));
