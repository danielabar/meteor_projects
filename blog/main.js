// This file contains only code that is shared between client and server
// It must be in JavaScript, not CoffeeScript, so that these vars become global and shared in all other files in app

Posts = new Meteor.Collection("posts");

adminLoggedIn = function() {
  var _ref, _ref1;
  return ((_ref = Meteor.user()) != null ? (_ref1 = _ref.emails[0]) != null ? _ref1.address : void 0 : void 0) === 'joe@blog.com';
};