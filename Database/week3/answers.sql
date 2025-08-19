-- CREATE DATABASE school;

-- USE school;

-- (Q1) creating tables
CREATE TABLE Student(
id INT PRIMARY KEY,
fullname varchar(100) NOT NULL,
age INT NOT NULL );

-- (Q2) inserting values to table
INSERT INTO Student(id,fullname,age)
VALUES (1,'Timothy walter',23),
(2,'Charles Iracoze',27),
(3,'vynill Ruth',25);

-- (Q3) updating tables
UPDATE Student
SET age = 20
WHERE id = 2;
COMMIT;