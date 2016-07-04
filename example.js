User = require('./Models/user'),
    twitterUser = new User('greenlool', '2011-01-01', '', '2013-05-05', 30),
    TwitterClient = require('./client');

let client = new TwitterClient(twitterUser);
client.fetch();

