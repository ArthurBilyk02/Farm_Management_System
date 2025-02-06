-- Species Table: Stores different species of animals
CREATE TABLE IF NOT EXISTS Species (
    species_id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT NOT NULL, 
    species_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Animal Table: Represents individual animals
CREATE TABLE IF NOT EXISTS Animal (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    species_id INT NOT NULL,
    age INT NOT NULL,
    health_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE
);

-- Feeding Schedule Table: Defines species specific feeding schedules
CREATE TABLE IF NOT EXISTS Feeding_Schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    species_id INT NOT NULL,
    feeding_interval VARCHAR(100) NOT NULL,
    recommended_food VARCHAR(255) NOT NULL,
    FOREIGN KEY (species_id) REFERENCES Species(species_id) ON DELETE CASCADE
);

-- Feeding Table: Tracks actual feeding events
CREATE TABLE IF NOT EXISTS Feeding (
    feeding_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    feeding_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    food_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id) ON DELETE CASCADE
);

-- Transactions Table: Manages financial records
CREATE TABLE IF NOT EXISTS Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATE NOT NULL,
    transaction_type ENUM('purchase', 'sale') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT
);

-- Medical History Table: Stores medical records for animals
CREATE TABLE IF NOT EXISTS Medical_History (
    medical_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    date DATE NOT NULL,
    treatment TEXT NOT NULL,
    vet_notes TEXT,
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id) ON DELETE CASCADE
);

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'public') NOT NULL DEFAULT 'public',
    api_key VARCHAR(255) UNIQUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



