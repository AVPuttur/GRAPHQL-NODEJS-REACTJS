const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

//Event array
const aEvents = [];

//Middleware to pass json
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
	//return lists of events
	//a function, name as argument
	//query - only query data
	//mutation - to manipulate data - create/delete/update
	// ! - cannot be empty

	schema:buildSchema(`

		type Event {
			_id: ID!
			title: String!
			description: String!
			price: Float!
			date: String!
		}

		input EventInput {
			title: String!
			description: String!
			price: Float!
			date: String!
		}

		type RootQuery {
			events: [Event!]! 
		}

		type RootMutation {
			createEvent(eventInput: EventInput): Event 
		}

		schema {
			query:  RootQuery 
			mutation: RootMutation 
		}

	`),

	//also known as the resolver in graphql
	rootValue: {
		events: () => { //query

			//return ['Romantic dinner', 'Sailing', 'Gardening'];
			return aEvents;
		}, 

		createEvent: (args) => {
			//const eventName = args.name;
			const event = {
				_id: Math.random().toString(),
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: args.eventInput.date
			};
			aEvents.push(event);
			return event;

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
