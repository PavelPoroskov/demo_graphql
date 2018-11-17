const fetch = require("node-fetch");
const path = require("path");

const dotenv = require('dotenv');
const {
  buildClientSchema,
  printSchema,
  introspectionQuery
} = require("graphql");

const fs = require("fs");

const arrOptions = [
  '.env.development',
//  '../.env.production.local',
  '.env.production',
//  '../.env.local'
]

let urlSchema
//const paramName = 'REACT_APP_GRAPHQL_SCHEMA'
const paramName = 'REACT_APP_GRAPHQL_ENDPOINT'
for (let i=0; i < arrOptions.length; i++) {
  let sLocalConfig = arrOptions[i]
  if (fs.existsSync(sLocalConfig)) {
    const envConfig = dotenv.parse(fs.readFileSync(sLocalConfig))
    if (paramName in envConfig) {
      urlSchema = envConfig[paramName];
      break;
    }
  }
  if (urlSchema) {
    break;
  }
}

//console.log('urlSchema')
//console.log(urlSchema)

async function main() {
  const res = await fetch( urlSchema, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ query: introspectionQuery })
  });
  const introspectionSchemaResult = await res.json();
  const clientSchema = buildClientSchema(introspectionSchemaResult.data);
  const sdl = printSchema(clientSchema);
  fs.writeFileSync(path.join(__dirname, "schema.graphql"), sdl);

  // const res = await fetch( urlSchema, {
  //   method: "GET",
  //   headers: { 
  //     "Content-Type": "application/json" 
  //   },
  //   body: JSON.stringify({ query: introspectionQuery })
  //   }
  // );
  // const introspectionSchemaResult = await res.text();
  // fs.writeFileSync(path.join(__dirname, "schema.graphql"), introspectionSchemaResult);
}

main().catch(e => {
  console.error("ERROR", e);
});
