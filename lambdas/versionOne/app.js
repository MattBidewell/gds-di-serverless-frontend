const { setup } = require("hmpo-app");
const HmpoFormWizard = require("hmpo-form-wizard");
const serverlessExpress = require('@vendia/serverless-express')

const sessionConfig = {
  cookieName: "service_session",
  cookieOptions: { maxAge: 7200000 },
  secret: "MySuperSecret",
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
    fields: [ "filedName" ],
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