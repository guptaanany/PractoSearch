
USE SearchData;
DROP TABLE Doctor;
DROP Table Clinic;

CREATE TABLE Clinic (
        clinic_id INT NOT NULL AUTO_INCREMENT,
        location VARCHAR(200) NOT NULL,
        city VARCHAR(100) NOT NULL,
        clinic_name VARCHAR(200) NOT NULL,
        clinic_address VARCHAR(400) NOT NULL,
        PRIMARY KEY (clinic_id)
);

CREATE TABLE Doctor (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(200) NOT NULL,
	gender INT NOT NULL,
	qualification VARCHAR(200) NOT NULL,
	experience INT NOT NULL,
	specialization VARCHAR(200) NOT NULL,
	mobilenumber BIGINT NOT NULL,
	clinic INT NOT NULL,
	email VARCHAR(200) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (clinic) REFERENCES Clinic(clinic_id)
);
	
