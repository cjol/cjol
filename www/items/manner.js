
module.exports =
{
	"name": "Manner",
	"slug": "manner",
	"language": ["javascript"],
	"img": "/img/screenshots/manner.png",
	"desc": "Advanced A/B testing and analytics platform, built to automatically optimise chatbot conversations",
	"description": `
	<p>
		At EF, I met a talented co-founder, and we started Manner - an <strong>AI-driven chatbot optimisation platform</strong>.
		We have built an incredibly sophisticated analytics dashboard to test, personalise and optimise automated chatbot conversation.
		My co-founder provided a machine learning background, and I "productised" his work by building out the interface from front-to-back.
		I used <strong>Node, React and Relay</strong>, and deployed the whole thing to <strong>Google Cloud Platform</strong>, where we were
		particularly careful to manage scalability to handle millions of latency-sensitive queries for each conversation.
	</p>
	<p>
		We successfully raised pre-seed funding, but as we continued it became clear that the chatbot ecosystem is not yet mature enough to benefit
		from our advanced tooling. As our sales pipeline slowly emptied, we agreed to both move on from Manner.
	</p>
`,
	"code": `
/* @flow */

import { globalIdField, connectionDefinitions, connectionFromArray } from 'graphql-relay';
import { GraphQLString, GraphQLObjectType, GraphQLInt } from 'graphql';

import NodeInterface from "../../../graphql/NodeInterface";

import GoalEvent from '../model/GoalEvent';
import GoalEventTypeEnum from './GoalEventTypeEnum';
import GoalType from '../../goals/type/GoalType'
import ConversationType from "../../conversations/type/ConversationType";

const GoalEventType = new GraphQLObjectType( {
	name: 'GoalEvent',
	interfaces: [ NodeInterface ],
	isTypeOf: object => object instanceof GoalEvent,
	fields: () => ( {
		id: globalIdField( 'GoalEvent' ),
		// conversation_id: { type: GraphQLString, resolve: ( obj ) => obj.conversation_id },
		type: {
			type: GoalEventTypeEnum,
			resolve: ( obj ) => obj.type
		},
		time: { type: GraphQLInt, resolve: ( obj ) => obj.time },

		Goal: {
			type: GoalType,
			resolve: ( obj, {...args }, context, { rootValue: objectManager } ) =>
				objectManager.get( {
					id: obj.goal_id,
					entityName: "Goal",
					ancestorPath: [{id: objectManager.getActiveAgentId() }]
				} )
		},

		Parent: {
			type: GoalEventType,
			resolve: ( obj, {...args }, context, { rootValue: objectManager } ) =>
				( obj.parent_id ?
					objectManager.get( { entityName: "GoalEvent", id: obj.parent_id } ) : Promise.resolve( [] ) )
		},

		Conversation: {
			type: ConversationType,
			resolve: ( obj, {...args }, context, { rootValue: objectManager } ) =>
				objectManager.get( { entityName: "Conversation", id: obj.conversation_id } )
		},
	} ),
} );

export default GoalEventType;
`,
	"codeDescription": "Manner was my first in-depth exploration into ES6. I also set up extensive linting, type-checking and enforced a strict code style. Below, I have included a sample of my code following this style.",
	order: 2
}
