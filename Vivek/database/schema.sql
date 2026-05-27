-- ==========================================
-- SQL Database Schema for Book Bank Management System
-- Theme: College Student Book Bank (MySQL / PostgreSQL Compatible)
-- ==========================================

CREATE DATABASE IF NOT EXISTS book_bank_db;
USE book_bank_db;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    balance_due DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Books Table
CREATE TABLE IF NOT EXISTS books (
    isbn VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    total_quantity INT NOT NULL DEFAULT 1,
    available_quantity INT NOT NULL DEFAULT 1,
    cover_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Circulation (Borrow) Records Table
CREATE TABLE IF NOT EXISTS circulation_records (
    record_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    isbn VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    fine_applied DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Issued', -- 'Pending', 'Issued', 'Returned'
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (isbn) REFERENCES books(isbn) ON DELETE CASCADE
);

-- 4. Pre-seeded Textbooks (Computer Science, Mechanical, Electrical, Civil)
INSERT INTO books (isbn, title, author, department, total_quantity, available_quantity, cover_url) VALUES
('978-0131103628', 'The C Programming Language', 'Brian W. Kernighan, Dennis M. Ritchie', 'Computer Science', 10, 10, 'https://images-na.ssl-images-amazon.com/images/I/4106nv1g3yL._SX396_BO1,204,203,200_.jpg'),
('978-0262033848', 'Introduction to Algorithms', 'Thomas H. Cormen', 'Computer Science', 8, 8, 'https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX382_BO1,204,203,200_.jpg'),
('978-0136061694', 'Artificial Intelligence: A Modern Approach', 'Stuart Russell, Peter Norvig', 'Computer Science', 6, 6, 'https://images-na.ssl-images-amazon.com/images/I/51d654P6-WL._SX379_BO1,204,203,200_.jpg'),
('978-0135114049', 'Fluid Mechanics', 'Russell C. Hibbeler', 'Mechanical Engineering', 5, 5, 'https://images-na.ssl-images-amazon.com/images/I/51zJ86G-jNL._SX397_BO1,204,203,200_.jpg'),
('978-0132133357', 'Thermodynamics: An Engineering Approach', 'Yunus A. Cengel, Michael A. Boles', 'Mechanical Engineering', 5, 5, 'https://images-na.ssl-images-amazon.com/images/I/41-Kq3H5J7L._SX398_BO1,204,203,200_.jpg'),
('978-0073380575', 'Electric Circuits', 'James W. Nilsson, Susan Riedel', 'Electrical Engineering', 7, 7, 'https://images-na.ssl-images-amazon.com/images/I/51K3W0Jz8QL._SX389_BO1,204,203,200_.jpg'),
('978-0132198011', 'Principles of Geotechnical Engineering', 'Braja M. Das', 'Civil Engineering', 4, 4, 'https://images-na.ssl-images-amazon.com/images/I/51t2hIEX6jL._SX397_BO1,204,203,200_.jpg');
