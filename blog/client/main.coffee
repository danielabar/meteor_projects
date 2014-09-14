Meteor.subscribe 'posts'

BlogRouter = Backbone.Router.extend
  routes: {
    "" : "main"
    "new" : "newPost"
  },
  newPost: () -> Session.set 'currentView', 'newPostForm'

  Meteor.startup () ->
    new BlogRouter
    Backbone.history.start pushState: true
