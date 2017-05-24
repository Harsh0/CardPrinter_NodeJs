'use strict';
const SocketIO = require('socket.io');
const Stomp = require('stomp-client');

function main(server,options,next){
  const connectOpt = [process.env.appHost,process.env.appPort,process.env.appUser,process.env.appPass];
  const client = new Stomp(...connectOpt);
  const io = SocketIO(server.listener);
  const outQueue = '/queue/toPython';
  const inQueue = '/queue/fromPython';
  let observer;
  let itemArray = new Proxy([],{
    get:function(target,property){
      return target[property];
    },
    set:function(target,property,value){
      target[property]= value;
      observer();
      return true;
    }
  });



  function stompClient(){
      return new Promise((resolve,reject)=>{
        client.connect(sessionId=>{
          console.log('Connected to Apache Apollo');
          client.subscribe(inQueue,body=>{
            itemArray.push(body);
          })
          resolve(sessionId,client);
        },error=>{
          reject(error);
        })
      })
  }
  function ioConnect(){
    io.on('connection',socket=>{
      console.log('Connected!');
      if(itemArray.length>0){
        //keep the button disabled
        socket
        .emit('buttonState',{
          state:false
        })
        .emit('allData',{
          dataArray:itemArray
        })
      }else{
        socket.emit('buttonState',{
          state:true
        })
      }
      //Publish data to Apollo
      socket.on('begin',()=>{
        client.publish(outQueue,JSON.stringify(options.data));
      });
      //Watch the itemArray for change
      observer = ()=>{
        socket.emit('item',{
          dataArray:itemArray[itemArray.length-1]
        });
      }

    });
  }
  stompClient()
  .then(ioConnect)
  .catch(err=>{
    console.log("There was an error : ",err);
    server.log('error','Error: '+err);
  })
  return next();
}

main.attributes={
  name:'main'
}
module.exports = main;
