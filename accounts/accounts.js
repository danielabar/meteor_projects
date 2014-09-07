if (Meteor.isClient) {

  Template.login.creatingAccount = function() {
    return Session.get("creatingAccount");
  };

  // 'login' is the parent template therefore
  //    has access to elements in 'newAccount' and 'loginForm'
  Template.login.events({
    'click #loginform': function() {
      Session.set('creatingAccount', false);
    },
    'click #accountform': function() {
      Session.set('creatingAccount', true);
    },
    'click #createaccount': function(e, t) {
      Session.set('creatingAccount', false);
      // Create user AND log in
      Accounts.createUser({
        username: t.find('#username').value,
        password: t.find('#password').value,
        email: t.find('#email').value,
        profile: {
          name: t.find('#name').value
        }
      });
    },
    'click #logout': function() {
      Meteor.logout();
    },
    'click #login': function(e, t) {
      Meteor.loginWithPassword(
        t.find('#username').value, t.find('#password').value,
        function(error) {
          console.dir(error);
        }
      );
    }
  });

}