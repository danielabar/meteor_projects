console.log('both.js shared code, this line runs on client and server');

if (Meteor.isClient) {
  console.log('both.js is running on the client');
}

if (Meteor.isServer) {
  console.log('both.js is running on the server');
}

Meteor.startup(function () {
  if (Meteor.isClient) {
    console.log('both.js STARTUP is running on the client');
  }

  if (Meteor.isServer) {
    console.log('both.js STARTUP is running on the server');
  }
});