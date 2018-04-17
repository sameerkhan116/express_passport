/*
  User schema setup.
  Require mongoos for exporting the model that our app will use
  Require bcrypt for hashing the password.
*/
import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const userSchema = mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  github: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

// Hashing schema using bcrypt and 8 rounds of salt.
userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

// comparing the encrypted password in db and the local password user provides
// on login.
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
};

export default mongoose.model('User', userSchema);