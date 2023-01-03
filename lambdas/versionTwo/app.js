const { setup } = require("hmpo-app");
const AWS = require("aws-sdk");
const HmpoFormWizard = require("hmpo-form-wizard");
const serverlessExpress = require('@vendia/serverless-express')

const session = require("express-session");
const DynamoDBStore = require("connect-dynamodb")(session);

const SESSION_TABLE_NAME = process.env.SESSION_TABLE_NAME

AWS.config.update({
  region: "eu-west-2",
});
const dynamodb = new AWS.DynamoDB();
const dynamoDBSessionStore = new DynamoDBStore({
  client: dynamodb,
  table: SESSION_TABLE_NAME,
});

const sessionConfig = {
  cookieName: "service_session",
  cookieOptions: { maxAge: 7200000 },
  secret: "MySuperSecret",
  ...(SESSION_TABLE_NAME && { sessionStore: dynamoDBSessionStore }),
};

const PORT = 3000;

const { app, router } = setup({
  config: { APP_ROOT: __dirname },
  port: PORT,
  session: sessionConfig,
});

const steps = {
  "/": {
    entryPoint: true,
    fields: [ "fieldName" ],
    next: "done"
  },
  "/done": {}
}

const fields = {
  "fieldName": {
    type: "text",
    validate: ["required"]
  }
}

const wizard = new HmpoFormWizard(steps, fields, {
  name: "serverless frontend form!"
});

router.use("/test", wizard)

module.exports.handler = serverlessExpress({app});