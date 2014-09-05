// app.js:
define(["require", "jquery", "underscore", "backbone", "iscroll", "jquerymobile"],
    function(require, $, _, Backbone, IScroll) {
        var App = function() {
        	
        	$(document).bind('pageinit');
        	
        	// preventDefault
        	function pd( func ) {
        		return function( event ) {
        			event.preventDefault();
        			func && func(event);
        		};
        	}

        	// prevent browser-based scrolling
        	document.ontouchmove = function(e){ e.preventDefault(); };
        	
        	// Handle the iOS and Android stuff
        	var browser = {
        			android: /Android/.test(navigator.userAgent)
        	};
        	browser.iphone = !browser.android;
        	
        
        	// Declaration of app and bb variables
        	var app = {
        		view: {},
        		model: {}
        	};
        	var bb = {
        		view: {},
        		model: {}
        	};
        	
        	
        	// Setting up the template triggers for underscorejs
        	_.templateSettings = {
        		interpolate: /\{\{(.+?)\}\}/g,
        		escape: /\{\{-(.+?)\}\}/g,
        		evaluate: /\{\{=(.+?)\}\}/g
        	};
        	
        	bb.init = function() {

        		/*
        		var scrollContent = {
        			scroll: function() {
        				var self = this;
        				setTimeout( function() {
        					if( self.scroller ) {
        						self.scroller.refresh();
        					}
        					else {
        						self.scroller = new IScroll( $("div[data-role='content']")[0] );
        					}
        				},1);
        			}
        		}; // Setting up the iScroll object
        		console.log("after the scrollContent inside bb.init");
        		*/
        		
        		
        		bb.view.Head = Backbone.View.extend(_.extend({
        			events: {
        				'tap #add': 'add'
        			},

        			initialize: function(items) {
        				var self = this;
        				_.bindAll(self, 'add');
        				self.setElement("div[data-role='header']");
        				self.items = items;
        			},
        			
        			add: function(){ 
        				var self = this; 
        				self.items.additem(); 
        			}
        		})); // End of the bb.view.Head
        		console.log("after the bb.view.Head inside bb.init");
        		

        		bb.model.Item = Backbone.Model.extend(_.extend({
        			//defaults: {
        			//	_id: 0,
        			//	content: '',
        			//	done: false
        			//},
        			
        			idAttribute: "_id",
        			
        			urlRoot: '/todos',
        	        
        			initialize: function() {
        				var self = this;
        				//_.bindAll(self);
        			}
        		})); // End of the bb.model.Item
        		console.log("after the bb.model.Item inside bb.init");
        		

        		bb.model.Items = Backbone.Collection.extend(_.extend({
        			model: bb.model.Item,
        			//localStorage: new Store("items"),
        			url: '/todos',

        			initialize: function() {
        				console.log("inside the bb.model.Items.initialize");
        				var self = this;
        				_.bindAll(self, 'additem');
        				_.bindAll(self, 'bson_id');
        				//_.bindAll(self, 'sync');
        				self.count = self.length;
        				
        				self.on('reset',function() {
        					self.count = 0;
        				});
        				
        				console.log("after the bb.model.Items.initialize");
        			},
        			
        			/*
        			sync: function(method, model, options){
        				options || (options = {});

        				  switch (method) {
        				    case 'create': {
        				    	console.log('Method: ' + method);
        				    	break;
        				    }
        				    
        				    case 'update':{
        				    	console.log('Method: ' + method);
        				    	break;
        				    }

        				    case 'delete':{
        				    	console.log('Method: ' + method);
        				    	break;
        				    }

        				    case 'read':{
        				    	console.log('Method: ' + method);
        				    	console.log('Model: ' + JSON.stringify(model));
        				    	break;
        				    }
        				  }
        			},
        			*/
        			
        			// fetch set save destroy
        			
        			additem: function() {
        				var self = this;
  
        				self.bson_id().done(function(data) {
    						var parsedData = JSON.parse(data);
    		            	var the_id = parsedData.id;
    		            	console.log(the_id);
    		            	
    		            	var item;
    		            	
    		            	item = new bb.model.Item({
            					//_id: the_id,
            					content: 'item ' + self.count,
            					done: false
            				});
    		            	
    		            	item.save();
    		            	self.count++;
    		            	self.add(item);
    					});
        			},
        			
        			// Generate a BSON id for the new Todo item
        			bson_id: function(callback){
        				return $.ajax({
        		            type: 'GET',
        		            url: '/bson',
        		            //dataType: "json",
        		            success: callback,
        		            error: function(){
        		            	console.log("Error retrieving BSON id");
        		            }
        		         });
        			}
        			
        		})); // End of the bb.model.Items
        		console.log("after the bb.model.Items inside bb.init");


        		bb.view.List = Backbone.View.extend({
        			events: {
        				'swipe .tm': 'swipeitem',
        				'tap .destroy': 'remove',
        			},
        		
        			initialize: function(items) {
        				var self = this;
        				_.bindAll(this, 'render');
        				_.bindAll(this, 'appenditem');
        				_.bindAll(this, 'swipeitem');
        				self.setElement('#list');
        				self.tm = {
        					item: _.template( self.$el.html() )
        				};
        				self.items = items;
        				self.items.on('add', self.appenditem);
        				self.items.on('itemswiped', self.swipeitem);
        				self.items.on('change', self.render);
        			},

        			render: function() {
        				var self = this;
        				self.$el.empty();
        				self.items.each(function(item){
        					self.appenditem(item);
        				});
        			},
        			
        			swipeitem: function(e){
        				var self = this;
        				var id = $(e.currentTarget).data("id");
        		        var item = self.items.get(id);
        		        var content = item.get("content");
        		        console.log(content + " swiped");
        		        $(e.currentTarget).find('.destroy').removeClass('ui-disabled');
        			},
        			
        			remove: function (e) {
        				var self = this;
        				var id = $(e.currentTarget).data("id");
        		        var item = self.items.get(id);
        		        var content = item.get("content");
        		        
        				console.log(content + " deleted");
        				item.destroy();
        				self.render();
        			},

        			appenditem: function(item) {
        				var self = this;
        				var html = self.tm.item( item.toJSON() );
        				self.$el.append( html );
        				//self.scroll();
        			}

        		}); // End of the bb.view.List
        		console.log("after the bb.view.List inside bb.init");
        		
        	}; // End of the bb.init
        	
        	
        	
        	app.init_browser = function() {
        		if( browser.android ) {
        			$("#main div[data-role='content']").css({
        				bottom: 0
        			});
        		}
        	}; // End of the app.init_browser
        	
        	
        	app.init = function() {
        		console.log('start init');
        		
        		bb.init();
        		console.log('after bb.init');

        		app.init_browser();
        		console.log('after app.init_browser');
        		
        		app.model.items = new bb.model.Items();
        		console.log('after app.model.items');
        		
        		app.view.head = new bb.view.Head(app.model.items);
        		console.log('after app.view.head');
        		
        		app.view.list = new bb.view.List(app.model.items);
        		console.log('after app.view.list');

        		app.model.items.fetch({
        			success: function(model, response) {
        				console.log("importing from DB");
        				app.model.items.count = app.model.items.length;
        				app.view.list.render();
        			},

        			error: function (model, response) {
        				console.log("error importing from DB");
        			}
        		});

        		console.log('end init');
        	}; // End of the app.init


        	$(app.init);

        };
        
        return App;
    }
);
