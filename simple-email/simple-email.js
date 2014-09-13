if (Meteor.isClient) {
  Template.emailForm.events({
    'click button' : function(e, t) {
      console.log('client calling sendEmail');
      var to = t.find('#to').value;
      var subject = t.find('#subject').value;
      var text = t.find('#text').value;
      Meteor.apply('sendEmail', [to, subject, text]);
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    sendEmail : function(to, subject, text) {
      console.log('server calling Email.send');
      Email.send({
        from: 'admin@localhost.com',
        to: to,
        // cc, bcc, replyTo
        subject: subject,
        text: text,
        // html
      });
    }
  });
}
