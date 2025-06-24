// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },  // hashed password
//   createdAt: { type: Date, default: Date.now },
//   twoFactorEnabled: { type: Boolean, default: false },
// twoFactorSecret: { type: String }
// });

// module.exports = mongoose.model('User', UserSchema);



// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String }, // nullable for OAuth users
//   phone: String,
//   oauthProvider: String,
//   oauthId: String,
//   photo: String,
//   createdAt: { type: Date, default: Date.now },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String }
// });

// module.exports = mongoose.model('User', UserSchema);

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String }, // nullable for OAuth users
//   phone: String,
//   oauthProvider: String,
//   oauthId: String,
//   photo: String,
//   createdAt: { type: Date, default: Date.now },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String }
// });

// module.exports = mongoose.model('User', UserSchema);



const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // nullable for OAuth users
  phone: String,
  oauthProvider: String,
  oauthId: String,
  photo: String,
  createdAt: { type: Date, default: Date.now },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String }
});

module.exports = mongoose.model('User', UserSchema);