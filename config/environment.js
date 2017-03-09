const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV ||'development';
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/project-2-${env}`;
const sessionSecret = process.env.SESSION_SECRET || 'my awesome secret';
const url = env === 'development' ? 'http://localhost:3000':'https://enigmatic-meadow-18873.herokuapp.com';
module.exports = { port, env, dbURI, sessionSecret, url};
