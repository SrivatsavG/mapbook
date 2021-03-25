const pool = require("../utilities/sql_conn");

// CREATE TABLE Users (
//  UserID SERIAL PRIMARY KEY,
//   FirstName VARCHAR(255) NOT NULL,
//   LastName VARCHAR(255) NOT NULL,
//   Username VARCHAR(255) NOT NULL UNIQUE,
//   Email VARCHAR(255) NOT NULL UNIQUE,
//   Password VARCHAR(255) NOT NULL,
//   Location POINT
// );

// CREATE TABLE Friends (
//   UserID_A INTEGER NOT NULL,
//   UserID_B INTEGER NOT NULL,
//   Relationship VARCHAR(255) NOT NULL,
//   CHECK (UserID_A < UserID_B),
//   PRIMARY KEY (UserID_A, UserID_B)
// );

exports.getMyProfile = async (req, res, next) => {
  const { userID } = req.params;
  console.log("USER IS: " + userID);

  //QUERY TO GET THE USER WITH USERID
  let query =
    "SELECT FirstName, LastName, Username , Email, Location FROM Users WHERE UserID = $1";
  let values = [userID];

  try {
    const { rows } = await pool.query(query, values);
    console.log("Query for getMyProfile successfully");
    //NO USER FOUND
    if (rows.length == 0) {
      res.status(200).json({
        message: "User not found",
      });
    } else {
      //USER FOUND
      const user = rows[0];
      res.status(200).json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        location: user.location,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.getUserProfile = async (req, res, next) => {
  const { userID, user2ID } = req.params;

  //QUERY TO GET THE USER WITH USERID
  let query =
    "SELECT FirstName, LastName, Username , Email, Location FROM Users WHERE UserID = $1";
  let values = [user2ID];

  try {
    const { rows } = await pool.query(query, values);
    console.log("Query for getUserProfile successfully");
    //NO USER FOUND
    if (rows.length == 0) {
      res.status(200).json({
        message: "User not found",
      });
    } else {
      //USER FOUND
      const user = rows[0];
      res.status(200).json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        location: user.location,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.postEdit = async (req, res, next) => {
  const { firstname, lastname, location, visible } = req.body;
  const { userID } = req.params;
  const locationSplit = location.split(",");
  const latitude = locationSplit[0];
  const longitude = locationSplit[1];

  console.log(firstname + " " + lastname + " " + latitude + " " + longitude + " " + userID + " " + visible);

  //QUERY TO CHANGE THE ABOVE DETAILS FOR USER WITH USERID = userID
  //`UPDATE table_name SET my_point = POINT($1,$2) WHERE id = $3 RETURNING my_point`;
  let query =
    "UPDATE Users SET FirstName = $1, LastName = $2, Location = POINT($3,$4), Visible = $5 WHERE UserID = $6";
  let values = [firstname, lastname, latitude, longitude, visible, userID];

  try {
    const { rows } = await pool.query(query, values);
    console.log("Query for postEdit successfully");
    console.log(rows);
    res.status(200).json({ message: "Edited successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }
};


exports.getAllUsers = async (req, res, next) => {
  const { userID } = req.params;
  const { location, distance } = req.body;
  let lat = "", long = "";
  const locationSplit = location.split(",");
  lat = locationSplit[0];
  long = locationSplit[1];
  // const query = "SELECT * FROM Users";
  // const values = [];
  const query = "SELECT * FROM Users WHERE Visible = true  AND ACOS(SIN(RADIANS($1)) * SIN(RADIANS(Location[0])) + COS(RADIANS($1)) * COS(RADIANS(Location[0])) * COS(RADIANS($2) - RADIANS(Location[1]))) * 3959 <= $3;";
  const values = [lat, long, distance];

  try {
    const response = await pool.query(query, values);
    const rows = response.rows;
    console.log("getAllUsers query successful");
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error in getAllLocations" });
  }
};

exports.postAddFriend = async (req, res, next) => {
  const { userID } = req.params;
  const { friendID } = req.body;
  const user = parseInt(userID);
  const friend = parseInt(friendID)
  user1 = Math.min(user, friend);
  user2 = Math.max(user, friend);
  const query = "INSERT INTO Friends (UserID_A,UserID_B,Relationship) VALUES ($1,$2,$3)";
  const values = [user1, user2, "friend"];

  try {
    const response = await pool.query(query, values);
    const rows = response.rows;
    console.log("postAddFriend query successful");
    return res.status(200).json({ message: "You've got a new friend!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error in postAddFriend" });
  }
};

exports.getMyFriends = async (req, res, next) => {
  const { userID } = req.params;
  const query = "SELECT Users.FirstName, Users.LastName,Users.Email,Users.Username,Users.Location FROM USERS INNER JOIN FRIENDS ON (($1 = Friends.UserID_B AND Users.UserID = Friends.UserID_A) OR ($1 = Friends.UserID_A AND Friends.UserID_B = Users.UserID))";
  const values = [userID];


  try {
    const response = await pool.query(query, values);
    const rows = response.rows;
    console.log("getMyFriends query successful");
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error in getMyFriends" });
  }
};

// CREATE TABLE Friends (
//   UserID_A INTEGER NOT NULL,
//   UserID_B INTEGER NOT NULL,
//   Relationship VARCHAR(255) NOT NULL,
//   CHECK (UserID_A < UserID_B),
//   PRIMARY KEY (UserID_A, UserID_B)
// );