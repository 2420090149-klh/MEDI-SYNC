CREATE TABLE doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(50) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    experience_years INTEGER NOT NULL,
    bio TEXT,
    profile_image TEXT,
    languages TEXT,
    consultation_fee DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    availability_hours TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Sample doctor data
INSERT INTO doctors (name, email, specialization, qualification, experience_years, bio, profile_image, languages, consultation_fee, rating) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@medisync.com', 'Cardiologist', 'MD, FACC', 15, 'Experienced cardiologist specializing in preventive cardiology and heart disease management.', '/images/doctors/sarah-johnson.jpg', 'English, Spanish', 150.00, 4.8),
('Dr. James Chen', 'james.chen@medisync.com', 'Pediatrician', 'MD, FAAP', 12, 'Dedicated pediatrician with focus on developmental pediatrics and preventive care.', '/images/doctors/james-chen.jpg', 'English, Mandarin', 120.00, 4.9),
('Dr. Maria Garcia', 'maria.garcia@medisync.com', 'Dermatologist', 'MD, FAAD', 10, 'Board-certified dermatologist specializing in medical and cosmetic dermatology.', '/images/doctors/maria-garcia.jpg', 'English, Spanish', 140.00, 4.7);