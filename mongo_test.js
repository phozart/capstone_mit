const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, {useUnifiedTopology: true}, function (err, client) {
    console.log('Connected!');

    const dbName = 'myproject';
    const db = client.db(dbName);

    var name = 'user' + Math.floor(Math.random()*10000);
    var email = name + '@mit.edu';

    var collection = db.collection('customers');
    var doc = {name, email};
    collection.insertOne(doc, {w:1}, function(err, result) {
        console.log('document inserted');
    });
    var customers = db
        .collection('customers')
        .find()
        .toArray(function(err, docs) {
            console.log('collection:', docs );

            client.close();
        })
});