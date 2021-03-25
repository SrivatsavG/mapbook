const pool = require("../utilities/sql_conn");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CREATE TABLE Users (UserID SERIAL PRIMARY KEY,
//   FirstName VARCHAR(255) NOT NULL,
//   LastName VARCHAR(255) NOT NULL,
//   Username VARCHAR(255) NOT NULL UNIQUE,
//   Email VARCHAR(255) NOT NULL UNIQUE,
//   Password VARCHAR(255) NOT NULL,
//   SALT VARCHAR(255),
//   Location POINT
// );

exports.postSignIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("retrieved: ");
  console.log(email, password);
  let response = null;
  let rows = null;
  let match = false;
  let token;

  let query =
    "SELECT Password, UserID, Username, FirstName, LastName, Location, Email FROM Users WHERE Email = $1";
  let values = [email];

  try {
    response = await pool.query(query, values);
    rows = response.rows;
    console.log("Query to get user in postSignIn successful");

    //User found with email address
    if (rows.length != 0) {
      const user = rows[0];
      match = await bcrypt.compare(password, user.password);
      if (match) {
        token = jwt.sign({ userID: user.userid, email: user.email }, process.env.JWT_KEY);
        return res.status(200).json({
          firstname: user.firstname,
          lastname: user.lastname,
          location: user.location,
          userID: user.userid,
          email: user.email,
          token: token
        });
      } else {
        console.log("Password does not match");
      }
    } else {
      console.log("User with email id not found");
    }
    //EITHER USER NOT FOUND OR PASSWORD DOESNT MATCH
    return res.status(422).json({ message: "Incorrect Email id or Password" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Sign in error" });
  }
};

exports.postSignUp = async (req, res, next) => {
  console.log("REACHED POST SIGN UP");

  const { username, email, password, firstname, lastname, location } = req.body;

  let userID = null;
  let response = null;
  let rows = null;

  try {
    //FIND IF USER ALREADY EXISTS
    let query1 = "SELECT * from Users WHERE Email = $1";
    let values1 = [email];
    response = await pool.query(query1, values1);
    rows = response.rows;
    if (rows.length > 0) {
      return res
        .status(422)
        .json({ message: "User with this EmailId already exists" });
    }

    //USER DOES NOT EXIST
    let locationSplit = location.split(",");
    let latitude = locationSplit[0];
    let longitude = locationSplit[1];
    let salt = await bcrypt.genSalt(12);
    let hashedPassword = await bcrypt.hash(password, salt);
    let query2 =
      "INSERT INTO Users (FirstName,LastName,Username,Email,Location,Password) VALUES ($1,$2,$3,$4,POINT($5,$6),$7) RETURNING UserID";
    let values2 = [
      firstname,
      lastname,
      username,
      email,
      latitude,
      longitude,
      hashedPassword,
    ];
    response = await pool.query(query2, values2);
    rows = response.rows;
    userID = rows[0].userid;
    return res.status(200).json({
      message: "Sign up successful",
      userID: userID,
      username: username,
      email: email,
      firstname: firstname,
      latitude: latitude,
      longitude: longitude,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not sign up user" });
  }
};
