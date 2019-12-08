const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

//Middleware to pass json
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
	//return lists of events
	//a function, name as argument
	//only query data
	//to manipulate data - create/delete/update

	schema:buildSchema(`

		type RootQuery {
			events: [String!]! 
		}

		type RootMutation {
			createEvent(name :String): String 
		}

		schema {
			query:  RootQuery 
			mutation: RootMutation 
		}

	`),

	//also known as the resolver in graphql
	rootValue: {
		events: () => { //query
			return ['Romantic dinner', 'Sailing', 'Gardening'];
		}, 

		createEvent: (args) => {
			const eventName = args.name;
			return eventName;
		}
	},

	graphiql: true, //graphql debuging

})

);




app.get('/', (req, res) => {
	res.send("HELLO GRAPHQL");
});


//Listen to port
app.listen('3000');
