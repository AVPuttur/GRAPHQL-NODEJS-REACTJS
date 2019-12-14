const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
require('dotenv/config');
const bcrypt = require('bcryptjs');


const app = express();

//Event array
//const aEvents = [];

//import from model
const Event = require('./models/Events');
const User = require('./models/User');

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

		type User {
			_id: ID!,
			email: String!,
			password: String!
		}

		input UserInput {
			email: String!,
			password: String!
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
			createUser(userInput: UserInput): User
		}

		schema {
			query:  RootQuery 
			mutation: RootMutation 
		}

	`),

	//also known as the resolver in graphql
	rootValue: {
		events: () => { //query
			return Event.find()
			.then(events => {
				return events.map(event => {
					return { ...event._doc };
				});
			})
			.catch(err => {
				throw err;
				console.log(err);
			});
			//return ['Romantic dinner', 'Sailing', 'Gardening'];
			//return aEvents;
		}, 

		createEvent: (args) => {
			//const eventName = args.name;
			// const event = {
			// 	_id: Math.random().toString(),
			// 	title: args.eventInput.title,
			// 	description: args.eventInput.description,
			// 	price: +args.eventInput.price,
			// 	date: args.eventInput.date
			// };
			const event = new Event({
				title: args.eventInput.title,
				description: args.eventInput.description,
				price: +args.eventInput.price,
				date: new Date(args.eventInput.date)
			});

			//aEvents.push(event);
			return event
			.save()
			.then(result => {
				console.log(result);
				return { ...result._doc };
			})
			.catch(err => {
				console.log(err);
				throw err;
			});
		},

		createUser: (args) => {
			return bycrpt.hash(args.userInput.password, 12)
			.then(hasedPassword => {
				const user = new User({
					email: args.userInput.email,
					password: hasedPassword
				});
				return user.save();
			})
			.then(result => {
				return { ...result._doc }
			})
			.catch(err => {
				throw err;
			});
			
		}
	},

	graphiql: true, //graphql debuging

})

);




app.get('/', (req, res) => {
	res.send("HELLO GRAPHQL");
});

//CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
	console.log("Connected to DB!!!");
});


//Listen to port
app.listen('3000');
