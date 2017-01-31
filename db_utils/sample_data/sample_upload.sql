LOAD DATA LOCAL INFILE 'landlord.csv'
	IGNORE
	INTO TABLE landlord
   	FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'house.csv'
	IGNORE
   	INTO TABLE house
    FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'user.csv'
    IGNORE
    INTO TABLE user
    FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'availability.csv'
    IGNORE
    INTO TABLE availability
    FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'review_house.csv'
    IGNORE
    INTO TABLE review_house
    FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'review_landlord.csv'
    IGNORE
    INTO TABLE review_landlord
    FIELDS TERMINATED BY ',';

LOAD DATA LOCAL INFILE 'house_attribute.csv'
    IGNORE
    INTO TABLE house_attribute
    FIELDS TERMINATED BY ',';