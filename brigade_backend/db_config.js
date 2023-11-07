module.exports = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    ssl: require,
    NODE_TLS_REJECT_UNAUTHORIZED: 0
};

/*
 user: 'backend_user',
    host: 'localhost',
    port: '5432',
    database:'brigade',
    password:'12345'
*/