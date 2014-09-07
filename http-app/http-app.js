if (Meteor.isClient) {
  Template.tweetList.tweets = function() {
    return Session.get('tweets');
  };
  Template.tweetList.latestRefresh = function() {
    return Session.get('latestRefresh');
  };
  Meteor.setInterval(function() {
    Meteor.call('getTweets', 'sports', function(err, tweets) {
      Session.set('tweets', tweets);
      var d = new Date();
      Session.set('latestRefresh', '' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds());
    });
  }, 3000);
}

if (Meteor.isServer) {
  Meteor.methods({
    getTweets: function (searchTerm) {
      // synchronous example
      var response = Meteor.http.call('GET', 'http://content.guardianapis.com/search?show-fields=all', {q: searchTerm});
      return response.data.response.results.map(function(tweet) {
        return {
          user: tweet.byline,
          text: tweet.fields.trailText
        }
      });
    }
  });
}
