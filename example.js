user = require('./Models/user'),
    twitterUser = new user('greenlool', '2011-01-01', '', '2013-05-05', 100),
    twitterClient = require('./client');

let client = new twitterClient(twitterUser);
client.fetch();