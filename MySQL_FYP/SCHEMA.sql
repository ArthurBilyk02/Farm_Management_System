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
    description VARCHAR(255),
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
    farm_id INT NOT NULL,
    food_type VARCHAR(225),
    feeding_interval VARCHAR(255),
    recommended_food VARCHAR(255),
    health VARCHAR(255),
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES Farm(farm_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Supplier (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    product_type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Product_Stock (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    food_type VARCHAR(255) NOT NULL,
    stock_level FLOAT NOT NULL DEFAULT 0,
    reorder_threshold FLOAT NOT NULL DEFAULT 5,
    supplier_id INT NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES Supplier(supplier_id) ON DELETE CASCADE
);

-- Table: Transactions
CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    transaction_type ENUM('Stock_Purchase', 'Stock_Sale', 'Animal_Purchase', 'Animal_Sale') NOT NULL,
    quantity FLOAT NOT NULL,
    transaction_date DATE DEFAULT (CURRENT_DATE),
    total_cost FLOAT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Product_Stock(product_id) ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS Veterinary_Visits (
    visit_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    vet_name VARCHAR(255),
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    purpose VARCHAR(255),
    treatment TEXT,
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE
);

-- Table: Health_Issues
CREATE TABLE IF NOT EXISTS Health_Issues (
    health_issue_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    issue_description VARCHAR(255) NOT NULL,
    severity ENUM('Mild', 'Moderate', 'Severe') NOT NULL,
    resolution_status ENUM('Ongoing', 'Resolved', 'Critical') NOT NULL DEFAULT 'Ongoing',
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Medical_History (
    medical_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    visit_id INT NOT NULL,
    health_issue_id INT NOT NULL,
    treatment VARCHAR(255),
    vet_notes TEXT,
    date DATE,
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE,
    FOREIGN KEY (visit_id) REFERENCES Veterinary_Visits(visit_id) ON DELETE CASCADE
    -- FOREIGN KEY (health_issue_id) REFERENCES Health_Issues(health_issue_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Environmental_Conditions (
    env_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    temperature FLOAT,
    humidity FLOAT,
    water_quality VARCHAR(255),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES Farm(farm_id) ON DELETE CASCADE
);

-- Table: Performance_Metrics
CREATE TABLE IF NOT EXISTS Performance_Metrics (
    metric_id INT AUTO_INCREMENT PRIMARY KEY,
    herd_id INT NOT NULL,
    metric_type VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL, 
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (herd_id) REFERENCES Herd(herd_id) ON DELETE CASCADE
);

-- Table: Alert_System
CREATE TABLE IF NOT EXISTS Alert_System (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    alert_type ENUM('Low Stock', 'Expired Stock', 'System Alert') NOT NULL,
    alert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
    FOREIGN KEY (product_id) REFERENCES Product_Stock(product_id) ON DELETE CASCADE
);

-- Table: Feeding_Type
CREATE TABLE IF NOT EXISTS Feeding_Type (
    feeding_type_id INT AUTO_INCREMENT PRIMARY KEY,
    food_type VARCHAR(255) NOT NULL,
    schedule_id INT NOT NULL,
    species_id INT NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (schedule_id) REFERENCES Feeding_Schedule(schedule_id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE
);

-- Insert Farms
INSERT INTO Farm (farm_id, location, owner, animal_types) 
VALUES 
(1, 'Field A', 'Alice', 'Cattle'),
(2, 'River Site', 'Bob', 'Fish'),
(3, 'Barnyard', 'Charlie', 'Pigs, Chickens'),
(4, 'Back Pasture', 'Diana', 'Buffalo');

-- Insert Species
INSERT INTO Species (species_id, species_name, description) 
VALUES 
(1, 'Dairy Cow', 'High-yield dairy cows suitable for milk production.'),
(2, 'Sheep', 'Sheep bred for wool and meat.'),
(3, 'Chicken', 'Poultry farming for eggs and meat'),
(4, 'Pig', 'Domesticated pigs for meat production'),
(5, 'Chicken', 'Layers and broilers'),
(6, 'Other', 'Other');

-- Insert Herds
INSERT INTO Herd (herd_name, farm_id, species_id, size, date_created, schedule_id, health_status, description) 
VALUES 
('Angus Herd', 1, 1, 50, '2024-01-01', 1, 'Healthy', 'Angus beef cattle group'),
('Trout', 2, 2, 100, '2024-02-15', 2, 'Stable', 'School of Trout'),
('Dairy Herd Alpha', 1, 1, 25, NOW(), NULL, 'Healthy', 'Dairy cattle group'),
('Goat Group Bravo', 1, 2, 12, NOW(), NULL, 'Stable', 'Goats for cheese production'),
('Sheep Flock Charlie', 2, 3, 30, NOW(), NULL, 'Needs Attention', 'Lambs bred for wool'),
('Beef Herd Delta', 2, 1, 40, NOW(), NULL, 'Healthy', 'Grass-fed beef herd'),
('Pig Pen Echo', 3, 4, 18, NOW(), NULL, 'Stable', 'Herd of pigs raised for meat'),
('Chicken Coop Zulu', 3, 5, 60, NOW(), NULL, 'Healthy', 'Egg-laying hens'),
('Cow Group Omega', 4, 6, 10, NOW(), NULL, 'Critical', 'Cow herd with feeding issues');

-- Insert Animals
INSERT INTO Animal (animal_id, herd_id, species_id, farm_id, name, dob) 
VALUES 
(3, 1, 1, 1, 'MooMoo', '2022-07-01'),
(4, 1, 1, 3, 'Daisy', '2021-11-15'),
(5, 2, 2, 2, 'Splashy', '2023-08-25'),
(6, 2, 2, 3, 'Ripple', '2023-09-30'),
(7, 3, 3, 1, 'Wooly', '2022-01-05'),
(8, 3, 3, 3, 'Fluffy', '2022-03-18'),
(9, 4, 2, 2, 'Finn', '2023-10-12'),
(10, 4, 2, 2, 'Bubbles', '2023-07-20');

-- Insert Feeding Schedule
INSERT INTO Feeding_Schedule (schedule_id, herd_id, farm_id, food_type, feeding_interval, recommended_food, health) 
VALUES 
(1, 1, 1, 'Hay', 'Every 6 hours', 'Fresh grass and hay', 'Optimal'),
(2, 2, 2, 'Fish Feed', 'Every 8 hours', 'Fish Feed', 'Good'),
(3, 8, 3, 'Grains', 'Every 12 hours', 'Balanced grains for poultry', 'Good');

INSERT INTO Supplier (supplier_name, contact_info, product_type)
VALUES 
    ('Agro Feeds', 'contact@agrofeeds.com', 'Animal Feed'),
    ('Farm Supplies Ltd', 'info@farmsupplies.com', 'Feed'),
    ('Aquaculture Inc.', 'support@aqua.com', 'Fish Feed'),
    ('Poultry Experts', 'contact@poultryx.com', 'Chicken Feed'),
    ('Livestock Solutions', 'info@livestock.com', 'Animals'),
    ('Sheep Breeders', 'support@sheepbreeders.com', 'Animals'),
    ('Veterinary Medics', 'vetmed@vets.com', 'Medicine');
    
INSERT INTO Product_Stock (food_type, stock_level, reorder_threshold, supplier_id)
VALUES 
    ('Cattle Feed', 200, 50, 1),
    ('Goat Feed', 100, 20, 2),
    ('Fish Pellets', 500, 100, 3),
    ('Chicken Grain', 300, 50, 4),
    ('Cow', 10, 2, 5),
    ('Sheep', 5, 1, 6);


-- Insert Transactions
INSERT INTO Transactions (product_id, transaction_type, quantity, transaction_date, total_cost)
VALUES 
    (1, 'Stock_Purchase', 100, NOW(), 500.00),
    (2, 'Stock_Sale', 50, NOW(), 300.00),
    (3, 'Animal_Purchase', 5, NOW(), 2500.00),
    (4, 'Animal_Sale', 2, NOW(), 1000.00);

-- Insert Users
INSERT INTO Users (employee_id, farm_id, email, password, role_name) 
VALUES 
(1, 1, 'admin@farm.com', 'hashedpassword1', 'admin'),
(2, 1, 'employee@farm.com', 'hashedpassword2', 'employee');

INSERT INTO Veterinary_Visits (herd_id, vet_name, purpose, treatment)
VALUES 
(1, 'Dr. Smith', 'Routine Checkup', 'General inspection and deworming'),
(2, 'Dr. Brown', 'Vaccination', 'Annual shots and health assessment');

INSERT INTO Health_Issues (herd_id, issue_description, severity, resolution_status)
VALUES 
(1, 'Foot and Mouth Disease detected', 'Severe', 'Ongoing'),
(2, 'Mild dehydration observed', 'Mild', 'Resolved'),
(1, 'Respiratory infection outbreak', 'Moderate', 'Ongoing');

INSERT INTO Medical_History (herd_id, visit_id, health_issue_id, treatment, vet_notes, date) 
VALUES 
(1, 1, 1, 'Antibiotics', 'Observed slight improvement', '2024-03-16');

INSERT INTO Environmental_Conditions (farm_id, temperature, humidity, water_quality)
VALUES 
    (1, 25.5, 60.2, 'Good'),
    (2, 18.3, 75.0, 'Moderate'),
    (1, 30.1, 50.5, 'Excellent'),
    (2, 22.7, 80.1, 'Poor');
    
INSERT INTO Performance_Metrics (herd_id, metric_type, value)
VALUES 
    (1, 'Feed Conversion Rate', 2.5),
    (2, 'Weight Gain Rate', 1.2),
    (1, 'Milk Production', 30.0),
    (2, 'Egg Production', 200.0);

INSERT INTO Alert_System (product_id, alert_type, status) 
VALUES 
    (1, 'Low Stock', 'Pending'),
    (2, 'Expired Stock', 'Pending'),
    (3, 'System Alert', 'Resolved');
    
INSERT INTO Feeding_Type (food_type, schedule_id, species_id, description) 
VALUES 
    ('Grass', 1, 1, 'Cattle grass feeding'),
    ('Pellets', 2, 2, 'Fish pellet feeding'),
    ('Grains', 3, 3, 'Chicken grain feeding');



