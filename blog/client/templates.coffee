# In a real app, wouldn't hard-code admin user's email address
adminLoggedIn = () ->
  Meteor.user()?.emails[0]?.address is 'joe@blog.com'

ifViewing = (viewName) -> Session.get('currentView') is viewName

Template.header.adminLoggedIn = () -> adminLoggedIn()

Template.header.events
   'click button': () -> Backbone.history.navigate '/new', true

Template.newPostForm.show = () -> ifViewing 'newPostForm'

Template.newPostForm.events
  'click button': (e, t) ->
    slug = t.find('#slug').value
    Meteor.call 'post',
      t.find('#content').value
      t.find('#title').value
      slug
      (err, id) -> console.log id