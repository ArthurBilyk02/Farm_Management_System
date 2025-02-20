SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Alert_System;
DROP TABLE IF EXISTS Product_Stock;
DROP TABLE IF EXISTS Performance_Metrics;
DROP TABLE IF EXISTS Medical_History;
DROP TABLE IF EXISTS Veterinary_Visits;
DROP TABLE IF EXISTS Health_Issues;
DROP TABLE IF EXISTS Environmental_Conditions;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Supplier;
DROP TABLE IF EXISTS Feeding_Schedule;
DROP TABLE IF EXISTS Animal;
DROP TABLE IF EXISTS Herd;
DROP TABLE IF EXISTS Species;
DROP TABLE IF EXISTS Farm;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Feeding_Type;

SET FOREIGN_KEY_CHECKS = 1;

-- Create database schema
CREATE SCHEMA IF NOT EXISTS farm_management;
USE farm_management;

-- Table: Farm
CREATE TABLE IF NOT EXISTS Farm (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    animal_types VARCHAR(255)
);

-- Table: Species
CREATE TABLE IF NOT EXISTS Species (
    species_id INT AUTO_INCREMENT PRIMARY KEY,
    species_name VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

-- Table: Herd
CREATE TABLE IF NOT EXISTS Herd (
    herd_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_name VARCHAR(255) NOT NULL,
    farm_id INT NOT NULL,
    species_id INT NOT NULL,
    size INT,
    date_created DATE,
    schedule_id INT,
    health_status VARCHAR(255),
    description VARCHAR(255), -- Fixed typo
    FOREIGN KEY (farm_id) REFERENCES Farm(farm_id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE
);

-- Table: Animal
CREATE TABLE IF NOT EXISTS Animal (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    species_id INT NOT NULL,
    farm_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES Farm(farm_id) ON DELETE CASCADE
);

-- Table: Feeding Schedule
CREATE TABLE IF NOT EXISTS Feeding_Schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    food_type VARCHAR(225),
    feeding_interval VARCHAR(255),
    recommended_food VARCHAR(255),
    health VARCHAR(255),
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE
);

-- Table: Transactions
CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    transaction_type ENUM('Stock_Purchase', 'Stock_Sale', 'Animal_Purchase', 'Animal_Sale') NOT NULL,
    quantity INT NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_cost FLOAT NOT NULL
);

-- Table: Users
CREATE TABLE IF NOT EXISTS Users (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(225) NOT NULL,
    role_name VARCHAR(225) NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES Farm(farm_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Medical_History (
    medical_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    visit_id INT NOT NULL,
    health_issue_id INT NOT NULL,
    treatment VARCHAR(255),
    vet_notes TEXT,
    date DATE,
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE
    -- FOREIGN KEY (visit_id) REFERENCES Veterinary_Visits(visit_id) ON DELETE CASCADE,
    -- FOREIGN KEY (health_issue_id) REFERENCES Health_Issues(health_issue_id) ON DELETE CASCADE
);

-- Insert Farms
INSERT INTO Farm (farm_id, location, owner, animal_types) 
VALUES 
(1, 'Farm1', 'John Doe', 'Cattle, Poultry'),
(2, 'Farm2', 'Jane Smith', 'Fish, Shrimp');

-- Insert Species
INSERT INTO Species (species_id, species_name, description) 
VALUES 
(1, 'Dairy Cow', 'High-yield dairy cows suitable for milk production.'),
(2, 'Sheep', 'Sheep bred for wool and meat.');

-- Insert Herds
INSERT INTO Herd (herd_id, herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description) 
VALUES 
(1, 'Angus Herd', 1, 1, 50, '2024-01-01', 1, 'Healthy', 'Angus beef cattle group'),
(2, 'Trout', 2, 2, 100, '2024-02-15', 2, 'Stable', 'School of Trout');

-- Insert Animals
INSERT INTO Animal (animal_id, herd_id, species_id, farm_id, name, dob) 
VALUES 
(1, 1, 1, 1, 'Bessie', '2022-06-12'),
(2, 2, 2, 2, 'Trout', '2023-09-10');

-- Insert Feeding Schedule
INSERT INTO Feeding_Schedule (schedule_id, herd_id, food_type, feeding_interval, recommended_food, health) 
VALUES 
(1, 1, 'Hay', 'Every 6 hours', 'Fresh grass and hay', 'Optimal'),
(2, 2, 'Fish Feed', 'Every 8 hours', 'Fish Feed', 'Good');

-- Insert Transactions
INSERT INTO Transactions (transaction_id, product_id, transaction_type, quantity, transaction_date, total_cost) 
VALUES 
(1, 1, 'Purchase', 500, '2024-02-01', 1500.00),
(2, 2, 'Sale', 2, '2024-02-05', 2200.00);

-- Insert Users
INSERT INTO Users (employee_id, farm_id, email, password, role_name) 
VALUES 
(1, 1, 'admin@farm.com', 'hashedpassword1', 'admin'),
(2, 1, 'employee@farm.com', 'hashedpassword2', 'employee');

INSERT INTO Medical_History (herd_id, visit_id, health_issue_id, treatment, vet_notes, date) 
VALUES 
(1, 1, 1, 'Antibiotics', 'Observed slight improvement', '2024-03-16');
