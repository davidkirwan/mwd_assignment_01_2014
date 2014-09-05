// Filename: main.js

requirejs.config({
  paths: {
    jquery: 'libs/jquery-2.1.0',
    jquerymobile: 'libs/jquery.mobile-1.4.2',
    underscore: 'libs/underscore-1.6.0',
    backbone: 'libs/backbone-1.1.2',
    require: 'libs/require-2.1.11',
    iscroll: 'libs/iscroll-5.1.1',
    app: 'app'
  }

});

requirejs(['app', "jquery", "underscore", "backbone", "jquerymobile"], 
function(App, $, _, Backbone){
	
	var app = new App();
	
});
