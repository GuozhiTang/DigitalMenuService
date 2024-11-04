import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  // ENUM
  MenuSessionStatus: a.enum([
    "OPEN",
    "COMPLETE",
    "EXPIRED"
  ]),

  // Data Models
  MenuSession: a
    .model({
      url: a.string().required(),
      userName: a.string().required(),
      targetDate: a.date().required(),
      status: a.ref("MenuSessionStatus"),
      createdOrder: a.hasOne("Order", "sessionId"),
      categories: a.hasMany("MenuCategory", "sessionId"),
    }),
  MenuCategory: a
    .model({
      name: a.string().required(),
      description: a.string(),
      categoryItems: a.hasMany("CategoryItem", "categoryId"),
      sessionId: a.id(),
      menuSession: a.belongsTo("MenuSession", "sessionId"),
    }),
  CategoryItem: a
    .model({
      name: a.string().required(),
      description: a.string(),
      imageLink: a.string(),
      ingredients: a.string().array(),
      categoryId: a.id(),
      menuCategory: a.belongsTo("MenuCategory", "categoryId"),
    }),
  Order: a
    .model({
      targetDate: a.date().required(),
      userName: a.string().required(),
      sessionId: a.id(),
      menuSession: a.belongsTo("MenuSession", "sessionId"),
    }),

  // Queries
  menuSessionById: a
    .query()
    .arguments({
      id: a.string().required()
    })
    .returns(a.ref("MenuSession"))
    .authorization((allow) => [allow.guest()]),

  // Mutations
  createNewMenuSession: a
    .mutation()
    .arguments({
      userName: a.string().required(),
      targetDate: a.date().required()
    })
    .returns(a.ref("MenuSession"))
    .authorization((allow) => [allow.guest()]),
  finalizeMenuSession: a
    .mutation()
    .arguments({
      sessionId: a.string().required()
    })
    .returns(a.ref("MenuSession"))
    .authorization((allow) => [allow.guest()])
}).authorization((allow) => [allow.guest()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
