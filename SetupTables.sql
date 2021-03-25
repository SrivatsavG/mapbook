DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Friends;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS LocationProps;


CREATE TABLE Users (UserID SERIAL PRIMARY KEY,
                   FirstName VARCHAR(255) NOT NULL,
                   LastName VARCHAR(255) NOT NULL,
                   Username VARCHAR(255) NOT NULL UNIQUE,
                   Email VARCHAR(255) NOT NULL UNIQUE,
                   Password VARCHAR(255) NOT NULL,
                   Location POINT,
                   Visible BOOLEAN
);


CREATE TABLE Friends (
    UserID_A INTEGER NOT NULL,
    UserID_B INTEGER NOT NULL,
    Relationship VARCHAR(255) NOT NULL,
    CHECK (UserID_A < UserID_B),
    PRIMARY KEY (UserID_A, UserID_B),
    CONSTRAINT FK_FriendsA
        FOREIGN KEY(UserID_A)
            REFERENCES Users(UserID),
    CONSTRAINT FK_FriendsB
        FOREIGN KEY(UserID_B)
            REFERENCES Users(UserID)
);





CREATE TABLE LocationProps (
    LocationID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Location POINT,
    Type VARCHAR(255),
    Info VARCHAR(255)
);



CREATE TABLE Locations (
    UserID INTEGER NOT NULL,
    LocationID INTEGER NOT NULL,
    Rating INTEGER,
    CHECK (Rating >= 0 AND Rating <= 5),
    PRIMARY KEY (UserID, LocationID),
    CONSTRAINT FK_Location
        FOREIGN KEY(LocationID)
            REFERENCES LocationProps(LocationID)
);



CREATE FUNCTION user_rule() RETURNS TRIGGER
AS $$
BEGIN
IF NEW.username IS NULL OR length(NEW.username) < 4 OR length(NEW.username) > 20 THEN
    RAISE EXCEPTION 'Username must be between 4 and 20 characters';
END IF;
IF NEW.Location[0] > 90 OR NEW.Location[0] < -90 THEN
    RAISE EXCEPTION 'Latitude invalid';
END IF;
IF NEW.Location[1] > 180 OR NEW.Location[1] < -180 THEN
    RAISE EXCEPTION 'Longitude invalid';
END IF;

RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER user_trigger BEFORE INSERT OR UPDATE ON Users
FOR EACH ROW EXECUTE PROCEDURE user_rule();


CREATE FUNCTION locationprops_rule() RETURNS TRIGGER
AS $$
BEGIN
IF NEW.Location[0] > 90 OR NEW.Location[0] < -90 THEN
    RAISE EXCEPTION 'Latitude invalid';
END IF;
IF NEW.Location[1] > 180 OR NEW.Location[1] < -180 THEN
    RAISE EXCEPTION 'Longitude invalid';
END IF;

RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER locationprops_trigger BEFORE INSERT OR UPDATE ON LocationProps
FOR EACH ROW EXECUTE PROCEDURE locationprops_rule();

INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Bill','Burr','bill','burr@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.6084,-122.3405),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Dave','Chappelle','dave','chappelle@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.6096,-122.342148),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('George','Clooney','george','clooney@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.6201,-122.3485),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Brad','Pitt','brad','pitt@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.6201,-122.34),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Jeff','Bezos','jeff','bezos@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.6101,-122.34),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('John','Krasinski','john','krasinski@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.5901,-122.34),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Chris','Rock','chris','rock@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.61,-122.305),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Nicholas','Cage','nicholas','cage@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.61,-122.325),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Margot','Robie','margot','robie@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.605,-122.325),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Anne','Hathaway','anne','hathaway@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.605,-122.33),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Gal','Gadot','gal','gadot@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.28088,-122.36901),TRUE);
INSERT INTO Users (FirstName, LastName, Username, Email, Password, Location, Visible) VALUES('Kate','Beckinsale','kate','beckinsale@gmail.com','$2a$12$mADnxqrlLx3m5IKp036Zf.kjvNaBD.NaJoB2pDiKzHKTEHieTDnv6',POINT(47.27972,-122.31794),TRUE);

INSERT INTO Friends VALUES(1,2,'friend');
INSERT INTO Friends VALUES(1,3,'friend');
INSERT INTO Friends VALUES(1,4,'friend');
INSERT INTO Friends VALUES(1,5,'friend');
INSERT INTO Friends VALUES(1,6,'friend');
INSERT INTO Friends VALUES(4,11,'friend');
INSERT INTO Friends VALUES(4,12,'friend');
INSERT INTO Friends VALUES(5,9,'friend');
INSERT INTO Friends VALUES(5,8,'friend');
INSERT INTO Friends VALUES(7,9,'friend');
INSERT INTO Friends VALUES(7,10,'friend');
INSERT INTO Friends VALUES(10,11,'friend');

INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Space Needle','305 Harrison St',POINT(47.6205,-122.3493), 'parks','Seattle famous skyscraper');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Olympic Sculpture Park','2901 Western Avenue',POINT(47.6166,-122.3553), 'parks','Famous tourist park');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Volunteer Park','1247 15th Ave E',POINT(47.6311,-122.3164), 'parks','Popular park in Capitol Hill');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Seattle Gym','1530 Queen Anne Ave',POINT(47.5687,-122.31031), 'gym','Lifting iron');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Canlis','2576 Aurora Ave N',POINT(47.6431,-122.3468), 'restaurant','');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Marymoor Park','6046 West Lake Sammamish Pkwy NE',POINT(47.66,-122.1079), 'parks','');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Capital One ATM','Capitol One ATM',POINT(47.6226,-122.3385), 'atm','');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('Bank of America','Bank of America',POINT(47.606,-122.3268), 'bank','');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('McDonalds','McDonalds',POINT(47.622,-122.3377), 'restaurant','');
INSERT INTO LocationProps (Name, Address, Location, Type, Info) VALUES('KFC','KFC',POINT(47.6305,-122.3435), 'restaurant','');

INSERT INTO Locations VALUES(1,2,5);
INSERT INTO Locations VALUES(1,3,4);
INSERT INTO Locations VALUES(1,4,5);
INSERT INTO Locations VALUES(1,5,4);
INSERT INTO Locations VALUES(1,6,5);
INSERT INTO Locations VALUES(4,11,3);
INSERT INTO Locations VALUES(4,12,3);
INSERT INTO Locations VALUES(5,9,5);
INSERT INTO Locations VALUES(5,8,4);
INSERT INTO Locations VALUES(7,9,3);
INSERT INTO Locations VALUES(7,10,2);
INSERT INTO Locations VALUES(10,11,2);
