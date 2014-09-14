# In a real app, wouldn't hard-code admin user's email address
adminLoggedIn = () ->
  Meteor.user()?.emails[0]?.address is 'joe@blog.com'

Meteor.publish "posts", () -> Posts.find()

Meteor.methods
  post: (content, title, slug) ->
    if adminLoggedIn()
      Posts.insert
        content: content
        title: title
        slug: slug
        createdOn: new Date()