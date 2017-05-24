'use strict';
const Path = require('path');

function core(server,options,next){
  //Load routes
  server.route(require('./routes')(options));

  //Configure Hapi to use Handlebars to render html files
  server.views({
    engines:{
      html:require('Handlebars')
    },
    path:Path.join(__dirname,'../views')
  })



  //Core Logic
  server.register({
    register:require('./main'),
    options:{
      data:options.data
    }
  },error=>{
    if(error){
      console.log('There was an error loading the main plugin');
      server.log('error',"Error loading main plugin");
    }
  })

  return next();
}
core.attributes = {
  name:'core',
  dependencies:[
    'inert',
    'vision'
  ]
}
module.exports = core;
