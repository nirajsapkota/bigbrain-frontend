const file = require('../config.json');
const data = JSON.parse(JSON.stringify(file));

const url = `http://localhost:${data.BACKEND_PORT}`;

export default url;
