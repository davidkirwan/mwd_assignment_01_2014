var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('mongodb.server.com', 10099, {auto_reconnect: true});
db = new Db('mongodb_database', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'todos' database");

        db.authenticate('username', 'password',{safe:true}, function(err, collection) {
        	//populateDB();
            if (err) {
                console.log("Todos");
                populateDB();
            }
        });
        
        //db.collection('todos', {safe:true}, function(err, collection) {
        //	populateDB();
        //    if (err) {
        //        console.log("Todos");
        //        populateDB();
        //    }
        //});
    }
});


// Util Methods
var util = {};

util.fixid = function( doc ) {
  if( doc._id ) {
    doc.id = doc._id.toString();
    delete doc._id;
  }
  else if( doc.id ) {
    doc._id = new mongodb.ObjectID(doc.id);
    delete doc.id;
  }
  return doc;
};



// API /bson GET
exports.bson_id = function(req, res){
	console.log('GET /bson');
	var the_id = { id: BSON.ObjectID().toString() };
	console.log(the_id.id.toString());
	res.send( JSON.stringify(the_id) );
};



 
// API /todos GET
exports.findAll = function(req, res) {
console.log('GET /todos');
db.collection('todos', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
  
  };


// API /todos/:id GET
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('GET /todos: ' + id);
    db.collection('todos', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
  
  };

// API /todos POST
exports.addTodo = function(req, res) {
  var todo = req.body;
  console.log('Adding Todo');
  db.collection('todos', function(err, collection) {
    collection.insert(todo, {safe: true}, function(err, result){
      if(err){
        res.send({'error':'An error has occurred'});
      }else{
        console.log('Success: ' + JSON.stringify(result[0]));
        res.send(result[0]);

      }
        
    });
    });
   };

// API /todos/:id DELETE
exports.deleteTodo = function( req, res) {
  var id = req.params.id;
    console.log('deleting ID '+id);
  db.collection('todos', function(err, collection){
    collection.remove({'_id':new BSON.ObjectID(id)},{safe: true}, function(err, result){
      if(err){
         res.send({'error':'An error has occurred - ' + err});
      }
      else{
         console.log('' + result + ' document(s) deleted');
         res.send(req.body);
      }
    });
  });
};

// API /todos/:id PUT
exports.updateTodo = function( req, res) {
  var id = req.params.id;
  var todo = req.body;

  console.log('Updating The Entry');
  console.log(id);
  console.log(todo);
  db.collection('todos', function(err, collection){
    collection.update({'_id': new BSON.ObjectID(id)}, todo, {safe: true}, function(err, result){
      if(err){
        console.log('Error Updating file');
      }
      else{
    	console.log('Todo updated');
        res.send(todo);
      }
    });
  });
};



// Populate DB
//
var populateDB = function() {
	
    var todos = [
	{
		content: "Wash car", 
		done: false 
	},
	{ 
		content: "Wash truck", 
		done: false
	},
	{ 
		content: "Wash van",
		done: false
	},
	{ 
		content: "Wash wall",
		done: false 
	},
	{ 
		content: "Wash cat", 
		done: false
	},
	{ 
		content: "Wash dog", 
		done: false
	},
	{ 
		content: "Wash swimming pool",
		done: false
	}
    ];
 
    db.collection('todos', function(err, collection) {
        collection.insert(todos, {safe:true}, function(err, result) {});
    });
 
};
