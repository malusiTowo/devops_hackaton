const express = require('express');
const Prometheus = require('./utils/prometheus');
const app = express();
const port = process.env.PORT || 80;

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


app.get('/liste-personnes', (req, res, next) => {
  res.send('helloc');
});

app.get('/', (req, res) => res.send('home'));

app.get('/bad', (req, res) => {
  throw new Error();
});


app.listen(port, () => console.log('Server is listening on port ' + port));
