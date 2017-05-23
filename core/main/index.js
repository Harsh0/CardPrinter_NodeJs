'use strict';
const SocketIO = require('socket.io');
const Stomp = require('stomp-client');

function main(server,options,next){
  const connectOpt = [process.env.appHost,process.env.appPort,process.env.appUser,process.env.appPass];
  const client = new Stomp(...connectOpt);
  const io = SocketIO(server.listener);
  client.connect(sessionId=>{
    console.log('Connected to Apache Apollo');
  })
  io.on('connection',socket=>{
    console.log('Connected!');
  })
  return next();
}

main.attributes={
  name:'main'
}
module.exports = main;
