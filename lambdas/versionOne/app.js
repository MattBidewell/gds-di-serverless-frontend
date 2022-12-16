const { setup } = require("hmpo-app");
const HmpoFormWizard = require("hmpo-form-wizard");
const serverlessExpress = require('@vendia/serverless-express')

const sessionConfig = {
  cookieName: "service_session",
  cookieOptions: { maxAge: 7200000 },
  secret: "MySuperSecret",
};

// const loggerConfig = {
//   console: true,
//   consoleJSON: true,
//   app: true,
// };

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

router.use("/", wizard)

router.post("/*", (req, res)  => {
  console.log(req);
  console.log("progress! 3");
  res.json({"test": true})
});

router.get("/*", (req, res)  => {
  console.log(req);
  console.log("progress! 4");
  res.json({"test": true})
});


module.exports.handler = serverlessExpress({app});