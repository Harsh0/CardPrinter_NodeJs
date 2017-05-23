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
    register:require('./core'),
    options:{
      data:require('../data/studentData.json')
    }
  }],error=>{
    if(error){
      console.log('Error : '+error);
    }else{
      server.start((err)=>{
        if(err){
          throw err;
        }
        console.log('Hapi server is running at :',server.info.uri);
      });
    }
});
