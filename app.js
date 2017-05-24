"use strict";
require('dotenv').load();
const Hapi = require('hapi');

const server = new Hapi.Server();

server.connection({
  port:process.env.port||3000
})

server.register([{
  register:require('inert')
  },{
    register:require('vision')
  },{
    register:require('good'),
    options:{
      opsInterval:10000,
      reporters:[{
        reporter:require('good-file'),
        events:{
          log:'*',
          ops:'*'
        },
        config:'./applog.log'
      }]
    }
  },{
    register:require('./core'),
    options:{
      data:require('../data/studentData.json')
    }
  }],error=>{
    if(error){
      console.log('Error : '+error);
      server.log('error',error);
    }else{
      server.start((err)=>{
        if(err){
          throw err;
        }
        console.log('Hapi server is running at :',server.info.uri);
      });
    }
});
