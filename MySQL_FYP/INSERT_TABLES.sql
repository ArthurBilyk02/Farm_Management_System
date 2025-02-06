-- Insert Species
INSERT INTO Species (type_id, species_name, description) VALUES 
(1, 'Dairy Cow', 'High-yield dairy cows suitable for milk production.'),
(2, 'Sheep', 'Sheep bred for wool and meat.');

-- Insert Animals
INSERT INTO Animal (species_id, age, health_status) VALUES 
(1, 5, 'Healthy'),
(2, 3, 'Recovering from illness');

-- Insert Feeding Schedules
INSERT INTO Feeding_Schedule (species_id, feeding_interval, recommended_food) VALUES 
(1, 'Every 6 hours', 'Fresh grass and hay'),
(2, 'Every 8 hours', 'Grain mix');

-- Insert Feeding Records
INSERT INTO Feeding (animal_id, feeding_time, food_type) VALUES 
(1, NOW(), 'Hay'),
(2, NOW(), 'Grain');

-- Insert Transactions
INSERT INTO Transactions (transaction_date, transaction_type, amount, description) VALUES 
('2024-02-01', 'purchase', 1500.00, 'Purchased 500kg of cattle feed'),
('2024-02-05', 'sale', 2200.00, 'Sold 2 dairy cows to a local farm');

-- Insert Medical History
INSERT INTO Medical_History (animal_id, date, treatment, vet_notes) VALUES 
(1, '2024-02-10', 'Vaccination', 'Routine vaccination.'),
(2, '2024-02-15', 'Antibiotics', 'Treatment for respiratory infection.');

INSERT INTO Users (username, password, role) 
VALUES 
('admin1', 'hashedpassword1', 'admin'),
('employee1', 'hashedpassword2', 'employee'),
('public1', NULL, 'public');

