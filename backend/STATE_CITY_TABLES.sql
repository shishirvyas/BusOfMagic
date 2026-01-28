-- ========================================================================
-- MAGIC BUS - State and City Master Tables for India
-- ========================================================================
-- Execute this script to create state and city master tables
-- ========================================================================

-- Drop existing tables if any
DROP TABLE IF EXISTS city CASCADE;
DROP TABLE IF EXISTS state CASCADE;

-- ========================================================================
-- 1. STATE TABLE - Indian States Master
-- ========================================================================
CREATE TABLE IF NOT EXISTS state (
    id BIGSERIAL PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_state_code ON state(state_code);
CREATE INDEX IF NOT EXISTS idx_state_name ON state(state_name);
CREATE INDEX IF NOT EXISTS idx_state_active ON state(is_active);

-- ========================================================================
-- 2. CITY TABLE - Indian Cities Master
-- ========================================================================
CREATE TABLE IF NOT EXISTS city (
    id BIGSERIAL PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    state_id BIGINT NOT NULL,
    pincode VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (state_id) REFERENCES state(id) ON DELETE CASCADE,
    UNIQUE(city_name, state_id)
);

CREATE INDEX IF NOT EXISTS idx_city_name ON city(city_name);
CREATE INDEX IF NOT EXISTS idx_city_state ON city(state_id);
CREATE INDEX IF NOT EXISTS idx_city_active ON city(is_active);

-- ========================================================================
-- SEED DATA - Indian States
-- ========================================================================
INSERT INTO state (state_code, state_name) VALUES
('AN', 'Andaman and Nicobar Islands'),
('AP', 'Andhra Pradesh'),
('AR', 'Arunachal Pradesh'),
('AS', 'Assam'),
('BR', 'Bihar'),
('CH', 'Chandigarh'),
('CG', 'Chhattisgarh'),
('DN', 'Dadra and Nagar Haveli and Daman and Diu'),
('DL', 'Delhi'),
('GA', 'Goa'),
('GJ', 'Gujarat'),
('HR', 'Haryana'),
('HP', 'Himachal Pradesh'),
('JK', 'Jammu and Kashmir'),
('JH', 'Jharkhand'),
('KA', 'Karnataka'),
('KL', 'Kerala'),
('LA', 'Ladakh'),
('LD', 'Lakshadweep'),
('MP', 'Madhya Pradesh'),
('MH', 'Maharashtra'),
('MN', 'Manipur'),
('ML', 'Meghalaya'),
('MZ', 'Mizoram'),
('NL', 'Nagaland'),
('OD', 'Odisha'),
('PY', 'Puducherry'),
('PB', 'Punjab'),
('RJ', 'Rajasthan'),
('SK', 'Sikkim'),
('TN', 'Tamil Nadu'),
('TS', 'Telangana'),
('TR', 'Tripura'),
('UP', 'Uttar Pradesh'),
('UK', 'Uttarakhand'),
('WB', 'West Bengal')
ON CONFLICT (state_code) DO NOTHING;

-- ========================================================================
-- SEED DATA - Major Indian Cities
-- ========================================================================
-- Maharashtra
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Mumbai', id, '400001' FROM state WHERE state_code = 'MH'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Pune', id, '411001' FROM state WHERE state_code = 'MH'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Nagpur', id, '440001' FROM state WHERE state_code = 'MH'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Thane', id, '400601' FROM state WHERE state_code = 'MH'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Nashik', id, '422001' FROM state WHERE state_code = 'MH'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Delhi
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'New Delhi', id, '110001' FROM state WHERE state_code = 'DL'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Delhi', id, '110002' FROM state WHERE state_code = 'DL'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Karnataka
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Bangalore', id, '560001' FROM state WHERE state_code = 'KA'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Mysore', id, '570001' FROM state WHERE state_code = 'KA'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Hubli', id, '580001' FROM state WHERE state_code = 'KA'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Tamil Nadu
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Chennai', id, '600001' FROM state WHERE state_code = 'TN'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Coimbatore', id, '641001' FROM state WHERE state_code = 'TN'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Madurai', id, '625001' FROM state WHERE state_code = 'TN'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Gujarat
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Ahmedabad', id, '380001' FROM state WHERE state_code = 'GJ'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Surat', id, '395001' FROM state WHERE state_code = 'GJ'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Vadodara', id, '390001' FROM state WHERE state_code = 'GJ'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Rajkot', id, '360001' FROM state WHERE state_code = 'GJ'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Telangana
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Hyderabad', id, '500001' FROM state WHERE state_code = 'TS'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Warangal', id, '506001' FROM state WHERE state_code = 'TS'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Kerala
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Kochi', id, '682001' FROM state WHERE state_code = 'KL'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Thiruvananthapuram', id, '695001' FROM state WHERE state_code = 'KL'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Kozhikode', id, '673001' FROM state WHERE state_code = 'KL'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- West Bengal
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Kolkata', id, '700001' FROM state WHERE state_code = 'WB'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Howrah', id, '711101' FROM state WHERE state_code = 'WB'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Uttar Pradesh
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Lucknow', id, '226001' FROM state WHERE state_code = 'UP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Kanpur', id, '208001' FROM state WHERE state_code = 'UP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Varanasi', id, '221001' FROM state WHERE state_code = 'UP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Agra', id, '282001' FROM state WHERE state_code = 'UP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Noida', id, '201301' FROM state WHERE state_code = 'UP'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Rajasthan
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Jaipur', id, '302001' FROM state WHERE state_code = 'RJ'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Jodhpur', id, '342001' FROM state WHERE state_code = 'RJ'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Udaipur', id, '313001' FROM state WHERE state_code = 'RJ'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Punjab
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Chandigarh', id, '160001' FROM state WHERE state_code = 'PB'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Ludhiana', id, '141001' FROM state WHERE state_code = 'PB'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Amritsar', id, '143001' FROM state WHERE state_code = 'PB'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Haryana
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Gurgaon', id, '122001' FROM state WHERE state_code = 'HR'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Faridabad', id, '121001' FROM state WHERE state_code = 'HR'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Bihar
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Patna', id, '800001' FROM state WHERE state_code = 'BR'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Madhya Pradesh
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Bhopal', id, '462001' FROM state WHERE state_code = 'MP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Indore', id, '452001' FROM state WHERE state_code = 'MP'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Andhra Pradesh
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Visakhapatnam', id, '530001' FROM state WHERE state_code = 'AP'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Vijayawada', id, '520001' FROM state WHERE state_code = 'AP'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- Goa
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Panaji', id, '403001' FROM state WHERE state_code = 'GA'
ON CONFLICT (city_name, state_id) DO NOTHING;
INSERT INTO city (city_name, state_id, pincode) 
SELECT 'Margao', id, '403601' FROM state WHERE state_code = 'GA'
ON CONFLICT (city_name, state_id) DO NOTHING;

-- ========================================================================
-- VERIFICATION QUERIES
-- ========================================================================
-- SELECT COUNT(*) as total_states FROM state;
-- SELECT COUNT(*) as total_cities FROM city;
-- SELECT s.state_name, COUNT(c.id) as city_count 
-- FROM state s LEFT JOIN city c ON s.id = c.state_id 
-- GROUP BY s.state_name ORDER BY s.state_name;
