
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (UserID SERIAL PRIMARY KEY,
                   FirstName VARCHAR(255) NOT NULL,
                   LastName VARCHAR(255) NOT NULL,
                   Username VARCHAR(255) NOT NULL UNIQUE,
                   Email VARCHAR(255) NOT NULL UNIQUE,
                   Password VARCHAR(255) NOT NULL,
                   Location POINT
);

DROP TABLE IF EXISTS Friends;

CREATE TABLE Friends (
    UserID_A INTEGER NOT NULL,
    UserID_B INTEGER NOT NULL,
    Relationship VARCHAR(255) NOT NULL,
    CHECK (UserID_A < UserID_B),
    PRIMARY KEY (UserID_A, UserID_B)
);

DROP TABLE IF EXISTS Locations;

CREATE TABLE Locations (
    UserID INTEGER NOT NULL,
    LocationID INTEGER NOT NULL,
    Rating INTEGER,
    CHECK (Rating >= 0 AND Rating <= 5),
    PRIMARY KEY (UserID, LocationID)
);

DROP TABLE IF EXISTS LocationProps;

CREATE TABLE LocationProps (
    LocationID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Location POINT,
    Type VARCHAR(255),
    Info VARCHAR(255)
);