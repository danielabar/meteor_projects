var LIST_KEY = 'list';

var add = function(item) {
  var list = Session.get(LIST_KEY);
  list.push(item);
  Session.set(LIST_KEY, list);
};

var remove = function(item) {
  var list = Session.get(LIST_KEY);
  var indexOf = list.indexOf(item);
  if (indexOf !== -1) {
    list.splice(indexOf, 1);
  }
  Session.set(LIST_KEY, list);
}

if (Meteor.isClient) {

  Session.set(LIST_KEY, ['one', 'two']);

  Template.list.items = function() {
    return Session.get(LIST_KEY);
  };

  Template.list.events({
    'keypress input': function(e, t) {
      if (e.keyCode === 13) {
        var input = t.find('input');
        add(input.value);
        input.value = '';
      }
    }
  });

  // My attempt at remove on click, turns out, it can be simpler
  // Template.item.events({
  //   'click li': function(e, t) {
  //     var item = t.find('li').innerText;
  //     remove(item);
  //   }
  //  });
  Template.item.events({
    'click': function(e, t) {
      remove(t.data);
    }
  });

  Template.item.rendered = function () {
    console.log('item template rendered');
    console.dir(this);
  };

  Template.item.created = function () {
    console.log('item template created');
    console.dir(this);
  };

}