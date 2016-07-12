/**
 * Schema caching API requests to the client
 *
 * The client should always send "since" and not necessarily "until" and "count".
 * The client must send the offset parameter to get the entire set of tweets.
 * Ok, the first request should be a POST user=robotomize&since=2014-05-05.
 * In response, the server will send to his 18 tweets.
 * Next request should be a POST user=robotomize&since=2014-05-05&offset=1, the server will return another 18 tweets
 */