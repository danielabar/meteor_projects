// This collection will be created on server AND client
var People = new Meteor.Collection('people');

if (Meteor.isClient) {

  // Populate the personList template from the People collection
  Template.personList.people = function() {
    return People.find();
  }

  // Event handler on form
  Template.personForm.events({
    'click button': function (e, t) {
      var el = t.find('#name');
      // In a real app, would validate before adding to collection
      People.insert({ name: el.value});
      el.value = '';
    }
  });

  // 'editing' variable in template is set to a function that returns reactive data from Session
  // 'this' is bound to data in template
  // '_id' is PK from mongodb
  Template.person.editing = function() {
    return Session.get('edit-' + this._id);
  };

  // Focus the edit input box using rendered callback
  // (this doesn't work, not trigerred on click)
  Template.person.rendered = function () {
    var input = this.find('input');
    if (input) {
      input.focus();
    }
  };


  // If user clicks a person, set the edit flag such that editing is enabled
  //  t.data is the same as 'this' in Template.person.editing
  // After user is done editing, they hit enter,
  //  catch that event to save the data and get out of editing mode
  Template.person.events({
    'click .name': function (e, t) {
      Session.set('edit-' + t.data._id, true);
    },
    'keypress input': function(e, t) {
      if (e.keyCode === 13) {
        People.update(
          { _id : People.findOne({ name : t.data.name })['_id']},
          { $set : { name: e.currentTarget.value } }
        );
        Session.set('edit-' + t.data._id, false);
      }
    },
    'click .del': function (e, t) {
      People.remove({ _id : People.findOne({ name : t.data.name })['_id']});
    }
  });

}