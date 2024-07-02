-- Sintaxis mysql
        
-- Create database
CREATE DATABASE IF NOT EXISTS footmatch;

-- Use database
use footmatch;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Table Data
INSERT INTO users (name, email, username, password) VALUES ('Admin', 'root@gmail.com', 'root', 'root');
INSERT INTO users (name, email, username, password) VALUES ('Antonio', 'juan@gmail.com', 'Tone', 'tone');
INSERT INTO users (name, email, username, password) VALUES ('Antonio Tapia', 'pedro@gmail.com', 'Brons', 'brons');