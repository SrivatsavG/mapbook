const pool = require("../utilities/sql_conn");

// LocationProps SCHEMA
// LocationID SERIAL PRIMARY KEY,
// Name VARCHAR(255) NOT NULL,
// Address VARCHAR(255),
// Location POINT,
// Type VARCHAR(255),
// Info VARCHAR(255)

// CREATE TABLE Locations (
//     UserID INTEGER NOT NULL,
//     LocationID INTEGER NOT NULL,
//     Rating INTEGER,
//     CHECK (Rating >= 0 AND Rating <= 5),
//     PRIMARY KEY (UserID, LocationID)
// );

exports.getLocation = async (req, res, next) => {
  const { locationID } = req.params;
  console.log("LOCATION IS: " + locationID);

  //QUERY TO GET THE LOCATION WITH LOCATIONID
  let query =
    "SELECT Name, Address, Location, Type,Info FROM LocationProps WHERE LocationID = $1";
  let values = [locationID];

  try {
    const { rows } = await pool.query(query, values);
    console.log("Query to getLocation successful");
    //NO LOCATION FOUND
    if (rows.length == 0) {
      res.status(200).json({
        message: "Location not found",
      });
    } else {
      //LOCATION FOUND
      const location = rows[0];
      console.log(location);
      return res.status(200).json({
        Name: location.name,
        Address: location.address,
        Location: location.location,
        Type: location.type,
        Info: location.info,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }
};

exports.postAddLocation = async (req, res, next) => {
  const { name, address, location, type, info, rating } = req.body;
  const { userID } = req.params;
  const locationSplit = location.split(",");
  const lat = locationSplit[0];
  const long = locationSplit[1];
  var locationID = null;

  //INSERTING INTO LOCATION PROPS
  try {
    let query1 =
      "INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES ($1, $2, POINT($3,$4), $5, $6) RETURNING LocationID";
    let values1 = [name, address, lat, long, type, info];
    const { rows } = await pool.query(query1, values1);
    locationID = rows[0].locationid;
    console.log(
      "Query to insert location to LocationProps successful. New location is " +
      locationID
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Database error while inserting into LocationProps" });
  }

  //INSERTING INTO LOCATIONS
  try {
    let query2 =
      "INSERT INTO Locations (UserID, LocationID, Rating) VALUES ($1, $2, $3)";
    let values2 = [userID, locationID, rating];
    const response = await pool.query(query2, values2);
    console.log("Query to insert location to Locations successful");
    return res.status(200).json({ message: "Inserted successfully" });
  } catch (err) {
    console.log(err);
    //DELETE LOCATION FROM LOCATIONPROPS
    let query3 = "DELETE FROM LocationProps WHERE LocationID = $1";
    let values3 = [locationID];
    await pool.query(query3, values3);
    return res
      .status(500)
      .json({ error: "Database error while inserting into Locations" });
  }
};

exports.getMyLocations = async (req, res, next) => {
  const { userID } = req.params;
  const query = "SELECT * FROM LocationProps JOIN Locations ON LocationProps.LocationID = Locations.LocationID WHERE Locations.UserID = $1";
  const values = [userID];

  try {
    const response = await pool.query(query, values);
    const rows = response.rows;
    console.log("getMyLocations query successful");
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Database error while getting myLocations" });
  }
};

exports.getAllLocations = async (req, res, next) => {
  console.log("found");
  const { userID } = req.params;
  const { type, location, distance } = req.body;
  let lat = "", long = "";
  const locationSplit = location.split(",");
  lat = locationSplit[0];
  long = locationSplit[1];
  const query = "SELECT LocationID, Name, Address, Location, Type, Info, ACOS(SIN(RADIANS($2)) * SIN(RADIANS(Location[0])) + COS(RADIANS($2)) * COS(RADIANS(Location[0])) * COS(RADIANS($3) - RADIANS(Location[1]))) * 3959 AS Distance FROM LocationProps WHERE Type = ANY ($1) AND ACOS(SIN(RADIANS($2)) * SIN(RADIANS(Location[0])) + COS(RADIANS($2)) * COS(RADIANS(Location[0])) * COS(RADIANS($3) - RADIANS(Location[1]))) * 3959 <= $4";
  // const query = "SELECT LocationID, Name, Address, Location, Type, Info, Distance FROM ( SELECT LocationID, Name, Address, Location, Type, Info, ACOS(SIN(RADIANS($2)) * SIN(RADIANS(Location[0])) + COS(RADIANS($2)) * COS(RADIANS(Location[0])) * COS(RADIANS($3) - RADIANS(Location[1]))) * 3959 AS Distance FROM LocationProps WHERE Type = ANY ($1) ) AS T WHERE Distance <= $4;"
  const values = [type, lat, long, distance];

  try {
    const response = await pool.query(query, values);
    const rows = response.rows;
    console.log("getAllLocations query successful");
    return res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error in getAllLocations" });
  }
};
