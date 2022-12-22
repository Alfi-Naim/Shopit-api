const { NODE_ENV, JWT_SECRET, DB_ADDRESS } = process.env;

const devJwt = 'super-strong-secret';
const devDbAddress = 'mongodb://127.0.0.1/shopitDB';
// const devDbAddress = 'mongodb://localhost:27017/shopitDB';

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  DB_ADDRESS,
  devJwt,
  devDbAddress,
};