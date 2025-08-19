-- checking tables
 SELECT * FROM Payments;

-- retreval of data from tables where orders are currently progress in descending order
SELECT orderstatus,orderdate,requireddate FROM payments WHERE orderstatus= "pending" ORDER BY orderdate DESC;

-- retreval of data from tables in descending order of employee number
SELECT firstname,lastname,email FROM Employees WHERE jobtitle= "Sales Rep" ORDER BY employee DESC;

-- retreval of all columns and records from the office table
SELECT * FROM Employees,payments;

-- fetching details from tables in sorted form
SELECT product,quantity FROM Product ORDER BY PRICE ASC LIMIT 5;
