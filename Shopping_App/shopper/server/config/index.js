const pkg = require('../../package.json');

module.exports = {
  applicationName: pkg.name,
  mongodb:{ // add new propert and connect to the url to the local host 
    url: 'mongodb://localhost:37017/shopper',
  },
  redis:{
    port:7379,
    client:null,
  },
  mysql:{
    options:{
      host:"localhost",
      port:3406,
      database:"shopper",
      dialect:"mysql",
      username:"root",
      password:"mypassword",
    },
    client:null,
  },
};
