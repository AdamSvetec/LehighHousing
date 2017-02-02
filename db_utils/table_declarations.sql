CREATE TABLE IF NOT EXISTS landlord (
	id INT(10) AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(60),
	phone_num VARCHAR(20),
	email VARCHAR(60),
	website VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS house (
	id INT(10) AUTO_INCREMENT PRIMARY KEY,
	address VARCHAR(60),
	lat NUMERIC(12,8),
	lng NUMERIC(12,8),
	landlord_id INT(10),
	bedroom_cnt INT(2),
	bathroom_cnt INT(2),
	parking_spot_cnt INT(2),
	FOREIGN KEY (landlord_id) REFERENCES landlord (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS user (
	email VARCHAR(60) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS availability (
	house_id INT(10) NOT NULL,
	year VARCHAR(9) NOT NULL,
	available TINYINT(1),
	rent INT(4),
	PRIMARY KEY (house_id, year),
	FOREIGN KEY (house_id) REFERENCES house (id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS review_house (
	id INT(10) AUTO_INCREMENT PRIMARY KEY,
	house_id INT(10),
	user_email VARCHAR(60),
	message VARCHAR(500),
	date DATETIME,
	year_rented VARCHAR(9),
	room_size_rating INT(1),
	cleanliness_rating INT(1),
	overall_rating INT(1),
	FOREIGN KEY (house_id) REFERENCES house (id) ON UPDATE CASCADE,
	FOREIGN KEY (user_email) REFERENCES user (email) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS review_landlord (
	id INT(10) AUTO_INCREMENT PRIMARY KEY,
	landlord_id INT(10),
	user_email VARCHAR(60),
	message VARCHAR(500),
	date DATETIME,
	year_rented VARCHAR(9),
	leniency_rating INT(1),
	fairness_rating INT(1),
	repair_rating INT(1),
	FOREIGN KEY (landlord_id) REFERENCES landlord (id) ON UPDATE CASCADE,
	FOREIGN KEY (user_email) REFERENCES user (email) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS house_attribute (
	house_id INT(10),
	name VARCHAR(30),
	FOREIGN KEY (house_id) REFERENCES house (id) ON UPDATE CASCADE
);
