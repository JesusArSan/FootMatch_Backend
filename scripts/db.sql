-- Sintaxis mysql
        
-- Create database
CREATE DATABASE IF NOT EXISTS footmatch;

-- Use database
use footmatch;

-------------------------------------------------
-- USERS TABLES --
-------------------------------------------------
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);
-- Create Friends Table
CREATE TABLE IF NOT EXISTS friends (
    user_id INT NOT NULL,
    friend_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);
-- Create Friends requests Table
CREATE TABLE IF NOT EXISTS friend_requests (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    UNIQUE (sender_id, receiver_id) -- Avoid duplicate requests
);
-------------------------------------------------
-- USERS TABLE DATA --
-------------------------------------------------
-- Insertar usuarios en la tabla users con el campo photo
INSERT INTO users (name, email, username, password, photo)
VALUES ('Admin', 'root@gmail.com', 'root', 'root', 'https://this-person-does-not-exist.com/img/avatar-gen4fa732bb26c3e8561e4c8fd0c62a0e4a.jpg'),
       ('Antonio', 'tone@gmail.com', 'tone', 'tone', 'https://this-person-does-not-exist.com/img/avatar-geneecc00d9abfd151db98367ca0bd570ea.jpg'),
       ('Antonio Tapia', 'Antapia@gmail.com', 'brons', 'brons', 'https://this-person-does-not-exist.com/img/avatar-genfb239b52507ebf268d0387859af88aee.jpg');

-- Insert friends data bidirectional
INSERT INTO friends (user_id, friend_id) VALUES (1, 2);
INSERT INTO friends (user_id, friend_id) VALUES (2, 1);
-- Insert friend requests data
INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES (1, 3, 'pending');

-------------------------------------------------
-- CENTERS TABLES --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS centers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    price DECIMAL(10, 2) CHECK (price >= 0),
    title VARCHAR(255) NOT NULL UNIQUE,
    rating DECIMAL(3, 2) CHECK (rating BETWEEN 0 AND 5),
    address VARCHAR(255) NOT NULL UNIQUE,
    details TEXT,
    services TEXT,  -- Additional services offered by the center
    facilities TEXT  -- Facilities available at the center (in text format)
);
-------------------------------------------------
-- FAVOURITE CENTERS TABLE --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS favourite_centers (
    user_id INT,
    center_id INT,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Almacena cuándo se agregó a favoritos
    PRIMARY KEY (user_id, center_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);
-------------------------------------------------
-- CENTER_IMAGES TABLE --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS center_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uri VARCHAR(255) NOT NULL,
    center_id INT,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);
-------------------------------------------------
-- PITCHES TABLE --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS pitches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(255) NOT NULL,  -- Type of pitch (e.g., 7-a-side, 5-a-side)
    surface VARCHAR(50),  -- Type of surface (e.g., grass, turf)
    status VARCHAR(50) CHECK (status IN ('active', 'closed')),  -- Pitch status
    center_id INT,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);
-------------------------------------------------
-- OCCUPANCIES TABLE --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS center_occupancies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pitch_id INT,
    date_time DATETIME NOT NULL,  -- Date and time of the occupancy
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE
);
-------------------------------------------------
-- CENTER_REVIEWS TABLE --
-------------------------------------------------
CREATE TABLE IF NOT EXISTS center_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    center_id INT,
    user_id INT,
    rating DECIMAL(3, 2) CHECK (rating BETWEEN 0 AND 5),  -- User rating
    comment TEXT,  -- User comment
    review_date DATE,
    FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE CASCADE
);
-------------------------------------------------
-- CENTERS TABLE DATA --
-------------------------------------------------
-- Insert data into centers table
INSERT INTO centers (id, latitude, longitude, price, title, rating, address, details, services, facilities)
VALUES
(1, 37.18817, -3.60667, 30, 'Granada Sports Complex', 4.5, 'C. Estrellas, 5, Chana, 18015 Granada', 'Granada Sports Complex offers top-notch facilities with a strong focus on football. The arena features several pitches, including 7-a-side, 5-a-side, and indoor futsal courts. Located in the heart of Granada.', 'Parking, Cafeteria', 'Changing rooms, Showers'),
(2, 37.17463, -3.59855, 25, 'Albaicín Sports Center', 4.8, 'C. Luna, 12, Albaicín, 18010 Granada', 'Albaicín Sports Center offers top-notch facilities with a strong focus on football. The arena features several pitches, including 7-a-side, 5-a-side, and indoor futsal courts. Located in the heart of Granada.', 'Gym, Cafeteria', 'Changing rooms, Showers'),
(3, 37.1675, -3.6244, 15, 'Chana Sports Complex', 4.3, 'C. Estrellas, 22, Chana, 18015 Granada', 'Chana Sports Complex offers top-notch facilities with a strong focus on football. The arena features several pitches, including 7-a-side, 5-a-side, and indoor futsal courts. Located in the heart of Granada.', 'Cafeteria, Parking', 'Changing rooms, Showers'),
(4, 37.1629, -3.6158, 10, 'University Sports Center', 4.7, 'C. Luna, 15, Albaicín, 18010 Granada', 'University Sports Center offers a variety of pitches and sports activities. Suitable for university students and the general public.', 'Library, Gym', 'Changing rooms, Showers'),
(5, 37.1021, -4.3901, 20, 'Loja Sports Arena', 4.2, 'C. Estrellas, 3, Chana, 18015 Granada', 'Loja Sports Arena offers sports facilities focusing on team sports such as football.', 'Gym, Cafeteria', 'Changing rooms, Showers'),
(6, 37.0970, -4.3830, 18, 'FitLoja Gym', 4.6, 'C. Luna, 18, Albaicín, 18010 Granada', 'FitLoja Gym is a modern sports complex focusing on fitness and football.', 'Gym, Sauna', 'Changing rooms, Showers'),
(7, 37.0905, -4.3915, 22, 'Loja Arena Sports', 4.9, 'C. Estrellas, 7, Chana, 18015 Granada', 'Loja Arena Sports offers top facilities for all types of football competitions.', 'Cafeteria, Parking', 'Changing rooms, Showers'),
(8, 37.0997, -4.3789, 25, 'Loja Health Club', 4.4, 'C. Luna, 25, Albaicín, 18010 Granada', 'Loja Health Club offers premium sports services focusing on football and gym activities.', 'Spa, Gym', 'Changing rooms, Showers');
-- Insert data into center_images table
INSERT INTO center_images (id, uri, center_id)
VALUES
(1, 'https://almazan.es/wp-content/uploads/2021/04/POLIDEPORTIVO-EL-FERIAL-Almazan-2.jpg', 1),
(2, 'https://via.placeholder.com/600x400', 1),
(3, 'https://via.placeholder.com/600x400', 1),
(4, 'https://elcirculo.es/wp-content/uploads/2022/03/Colegio-Circulo-ESO-BACH-CICLOS-COMEDOR-Y-POLIDEPORTIVO-08282020_081434.jpg', 2),
(5, 'https://via.placeholder.com/600x400', 2),
(6, 'https://via.placeholder.com/600x400', 2),
(7, 'https://almazan.es/wp-content/uploads/2021/04/POLIDEPORTIVO-EL-FERIAL-Almazan-2.jpg', 3),
(8, 'https://via.placeholder.com/600x400', 3),
(9, 'https://via.placeholder.com/600x400', 3),
(10, 'https://elcirculo.es/wp-content/uploads/2022/03/Colegio-Circulo-ESO-BACH-CICLOS-COMEDOR-Y-POLIDEPORTIVO-08282020_081434.jpg', 4),
(11, 'https://via.placeholder.com/600x400', 4),
(12, 'https://via.placeholder.com/600x400', 4),
(13, 'https://almazan.es/wp-content/uploads/2021/04/POLIDEPORTIVO-EL-FERIAL-Almazan-2.jpg', 5),
(14, 'https://www.palco23.com/files/2021/19_fitness/loja-980.jpg', 5),
(15, 'https://www.bpxport.es/wp-content/uploads/2023/04/Pistas.jpg', 5),
(16, 'https://lh5.googleusercontent.com/p/AF1QipPu-bQ78x02RU9zEsq7loaickYnpPBzBeuwC-MR=w426-h240-k-no', 5),
(17, 'https://elcirculo.es/wp-content/uploads/2022/03/Colegio-Circulo-ESO-BACH-CICLOS-COMEDOR-Y-POLIDEPORTIVO-08282020_081434.jpg', 6),
(18, 'https://via.placeholder.com/600x400', 6),
(19, 'https://via.placeholder.com/600x400', 6),
(20, 'https://almazan.es/wp-content/uploads/2021/04/POLIDEPORTIVO-EL-FERIAL-Almazan-2.jpg', 7),
(21, 'https://via.placeholder.com/600x400', 7),
(22, 'https://via.placeholder.com/600x400', 7),
(23, 'https://elcirculo.es/wp-content/uploads/2022/03/Colegio-Circulo-ESO-BACH-CICLOS-COMEDOR-Y-POLIDEPORTIVO-08282020_081434.jpg', 8),
(24, 'https://via.placeholder.com/600x400', 8),
(25, 'https://via.placeholder.com/600x400', 8);
-- Insert data into pitches table
INSERT INTO pitches (id, type, surface, status, center_id)
VALUES
(1, 'Outdoor 7-a-side grass', 'grass', 'active', 1),
(2, 'Outdoor 5-a-side grass', 'grass', 'closed', 1),
(3, 'Indoor 5-a-side', 'indoor', 'active', 1),
(4, 'Outdoor 5-a-side grass', 'grass', 'active', 1),
(5, 'Outdoor 7-a-side grass', 'grass', 'closed', 2),
(6, 'Outdoor 5-a-side grass', 'grass', 'active', 2),
(7, 'Indoor 5-a-side', 'indoor', 'closed', 2),
(8, 'Outdoor 7-a-side grass', 'grass', 'active', 3),
(9, 'Outdoor 5-a-side grass', 'grass', 'closed', 3),
(10, 'Indoor 5-a-side', 'indoor', 'active', 3),
(11, 'Outdoor 7-a-side grass', 'grass', 'closed', 4),
(12, 'Outdoor 5-a-side grass', 'grass', 'closed', 4),
(13, 'Indoor 5-a-side', 'indoor', 'active', 4),
(14, 'Outdoor 7-a-side grass', 'grass', 'active', 5),
(15, 'Outdoor 5-a-side grass', 'grass', 'closed', 5),
(16, 'Indoor 5-a-side', 'indoor', 'active', 5),
(17, 'Outdoor 7-a-side grass', 'grass', 'closed', 6),
(18, 'Outdoor 5-a-side grass', 'grass', 'active', 6),
(19, 'Indoor 5-a-side', 'indoor', 'active', 6),
(20, 'Outdoor 7-a-side grass', 'grass', 'active', 7),
(21, 'Outdoor 5-a-side grass', 'grass', 'active', 7),
(22, 'Indoor 5-a-side', 'indoor', 'closed', 7),
(23, 'Outdoor 7-a-side grass', 'grass', 'active', 8),
(24, 'Outdoor 5-a-side grass', 'grass', 'closed', 8),
(25, 'Indoor 5-a-side', 'indoor', 'active', 8);
-- Insert data into occupancies table with dates between today and this week
INSERT INTO center_occupancies (pitch_id, date_time)
VALUES
(1, '2024-08-18 07:30:00'),
(1, '2024-08-18 09:30:00'),
(1, '2024-08-18 08:30:00'),
(2, '2024-08-19 07:30:00'),
(2, '2024-08-19 09:30:00'),
(2, '2024-08-18 09:30:00'),
(3, '2024-08-21 10:30:00'),
(3, '2024-08-22 07:30:00'),
(3, '2024-08-20 10:30:00'),
(4, '2024-08-19 07:30:00'),
(4, '2024-08-19 09:30:00'),
(4, '2024-08-19 08:30:00'),
(5, '2024-08-19 07:30:00'),
(5, '2024-08-21 09:30:00'),
(5, '2024-08-20 08:30:00'),
(6, '2024-08-21 07:30:00'),
(6, '2024-08-21 09:30:00'),
(6, '2024-08-18 09:30:00'),
(7, '2024-08-18 10:30:00'),
(7, '2024-08-18 07:30:00'),
(7, '2024-08-19 10:30:00'),
(8, '2024-08-18 10:30:00'),
(8, '2024-08-19 07:30:00'),
(8, '2024-08-19 10:30:00'),
(9, '2024-08-19 07:30:00'),
(9, '2024-08-19 09:30:00'),
(9, '2024-08-20 08:30:00'),
(10, '2024-08-21 07:30:00'),
(10, '2024-08-21 09:30:00'),
(10, '2024-08-22 08:30:00'),
(11, '2024-08-18 07:30:00'),
(11, '2024-08-19 09:30:00'),
(11, '2024-08-20 08:30:00'),
(12, '2024-08-18 10:30:00'),
(12, '2024-08-19 07:30:00'),
(12, '2024-08-20 09:30:00'),
(13, '2024-08-21 08:30:00'),
(13, '2024-08-22 09:30:00'),
(13, '2024-08-23 07:30:00'),
(14, '2024-08-18 07:30:00'),
(14, '2024-08-19 09:30:00'),
(14, '2024-08-20 08:30:00'),
(15, '2024-08-21 07:30:00'),
(15, '2024-08-21 09:30:00'),
(15, '2024-08-22 08:30:00'),
(16, '2024-08-18 09:30:00'),
(16, '2024-08-18 10:30:00'),
(16, '2024-08-19 08:30:00'),
(17, '2024-08-20 07:30:00'),
(17, '2024-08-20 09:30:00'),
(17, '2024-08-21 08:30:00'),
(18, '2024-08-22 07:30:00'),
(18, '2024-08-22 09:30:00'),
(18, '2024-08-23 08:30:00'),
(19, '2024-08-18 07:30:00'),
(19, '2024-08-19 09:30:00'),
(19, '2024-08-20 08:30:00'),
(20, '2024-08-21 10:30:00'),
(20, '2024-08-22 07:30:00'),
(20, '2024-08-23 09:30:00'),
(21, '2024-08-18 07:30:00'),
(21, '2024-08-19 09:30:00'),
(21, '2024-08-20 08:30:00'),
(22, '2024-08-21 07:30:00'),
(22, '2024-08-21 09:30:00'),
(22, '2024-08-22 08:30:00'),
(23, '2024-08-18 10:30:00'),
(23, '2024-08-19 07:30:00'),
(23, '2024-08-20 09:30:00'),
(24, '2024-08-21 08:30:00'),
(24, '2024-08-22 09:30:00'),
(24, '2024-08-23 07:30:00'),
(25, '2024-08-18 07:30:00'),
(25, '2024-08-19 09:30:00'),
(25, '2024-08-20 08:30:00');
-- Centros favoritos de usuarios
INSERT INTO favourite_centers (user_id, center_id) VALUES (1, 1);
INSERT INTO favourite_centers (user_id, center_id) VALUES (1, 2);
INSERT INTO favourite_centers (user_id, center_id) VALUES (1, 3);
INSERT INTO favourite_centers (user_id, center_id) VALUES (1, 4);
INSERT INTO favourite_centers (user_id, center_id) VALUES (2, 5);
INSERT INTO favourite_centers (user_id, center_id) VALUES (2, 6);
INSERT INTO favourite_centers (user_id, center_id) VALUES (2, 7);