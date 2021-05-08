const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
  email: {
    // Trim and lowercase
    type: String, 
    required: true, 
    index: { unique: true }, 
    lowercase: true, 
    trim: true,
  },
  password: {
    type: String, required: true, trim: true,
  },
}, { timestamps: true });

async function generateHash(password) {
  const COST = 12;
  return bcrypt.hash(password, COST);
}

UserSchema.pre('save', function preSave(next) { // this is needed when the password is provided it is pre saved and goes through the hash function and creates hash representation of our password before saving the password to the database
  const user = this;

  // Only create a new password hash if the field was updated
  if(user.isModified('password')) {
    return generateHash(user.password).then(hash => {
      user.password = hash;
      return next();
    }).catch(error => {
      return next(error);
    });
  }
  return next();
});

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) { // this will compare the plain text password given by user with the hash function password and let the user have access or not depending on the result
  // it takes the plain text and the salt string of the password and run the hash function again with the password given and create an hash password and them comapre if the resulted hash password and the stored hash password are match and return true or false
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);