-- retreval of data from tables where orders are currently progress in descending order
SELECT paymentdates,totalamount FROM payments ORDER BY paymentdates DESC LIMIT 5;

-- finding average credit limit of each customer from the table
SELECT customer,country AVG (credit_limit) AS average_credit_limit FROM customer GROUP BY customer,county;

-- finding total price of product orderd from the table
SELECT product_code,quantity_ordered SUM(quantity_ordered * price) AS total_price FROM orders GROUP BY product_code;

-- finding the highest payment for each product in the table
SELECT check_number, MAX(amount) AS highest_amount FROM payments GROUP BY check_number;