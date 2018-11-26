const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose.connect(
  "mongodb://mruminski:test123@ds115094.mlab.com:15094/module21",
  { useNewUrlParser: true }
);

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});

userSchema.methods.manify = function(next) {
  this.name = this.name + "-boy";
  return next(null, this.name);
};

userSchema.pre("save", function(next) {
  const currentDate = new Date();
  this.updated_at = currentDate;

  if (!this.created_at) this.created_at = currentDate;
  next();
});

const User = mongoose.model("User", userSchema);

const matt = new User({
  name: "Matt",
  username: "mruminski",
  password: "password"
});

matt.manify(function(err, name) {
  if (err) throw err;
  console.log("Your new name is: " + name);
});

const mark = new User({
  name: "Mark",
  username: "marksmith",
  password: "password"
});

mark.manify(function(err, name) {
  if (err) throw err;
  console.log("Your new name is: " + name);
});

const tom = new User({
  name: "Thomas",
  username: "tomadams",
  password: "password"
});

tom.manify(function(err, name) {
  if (err) throw err;
  console.log("Your new name is: " + name);
});

const joe = new User({
  name: "Joe",
  username: "joedoe",
  password: "password"
});

joe.manify(function(err, name) {
  if (err) throw err;
  console.log("Your new name is: ", name);
});

const findAllUsers = () =>
  User.find({}, function(err, res) {
    if (err) throw err;
    console.log("Actual db records: ", res);
  });

const findSpecificRecord = () =>
  User.find({ username: "mruminski" }).exec(function(err, res) {
    if (err) throw err;
    console.log("Finded record ", res);
  });

const updateUserPassword = () =>
  User.findOne({ username: "joedoe" }).then(function(user) {
    console.log("User ", user.name);
    console.log("Old password ", user.password);
    user.password = "aNewPassword";
    console.log("New password ", user.password);

    return user.save(function(err) {
      if (err) throw err;
      console.log("Password for user: ", user.name, "changed");
    });
  });

const updateUsername = () => {
  User.findOneAndUpdate(
    { username: "joedoe" },
    { username: "joe.doe" },
    { new: true },
    function(err, user) {
      if (err) throw err;
      console.log("Username changed", user.name);
    }
  );
};

const findMarkAndDelete = () =>
  User.findOne({ username: "marksmith" }).then(function(user) {
    return user.remove(function() {
      console.log("User deleted");
    });
  });

const findTomAndDelete = () =>
  User.findOne({ username: "tomadams" }).then(function(user) {
    return user.remove(function() {
      console.log("User deleted");
    });
  });

const findJoeAndDelete = () =>
  User.findOne({ username: "joe.doe" }).then(function(user) {
    return user.remove(function() {
      console.log("User deleted");
    });
  });

Promise.all([matt.save(), mark.save(), tom.save(), joe.save()])
  .then(findAllUsers)
  .then(findSpecificRecord)
  .then(updateUserPassword)
  .then(updateUsername)
  .then(findMarkAndDelete)
  .then(findTomAndDelete)
  .then(findJoeAndDelete)
  .catch(console.log.bind(console));
