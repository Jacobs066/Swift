-- Migration: V3__add_biometric_authentication.sql
-- Add biometric authentication support

-- Create biometric_data table
CREATE TABLE biometric_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    biometric_type VARCHAR(20) NOT NULL,
    biometric_data TEXT NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_biometric_data_user_id ON biometric_data(user_id);
CREATE INDEX idx_biometric_data_type ON biometric_data(biometric_type);
CREATE INDEX idx_biometric_data_device_id ON biometric_data(device_id);
CREATE INDEX idx_biometric_data_active ON biometric_data(is_active);
CREATE INDEX idx_biometric_data_user_type_device ON biometric_data(user_id, biometric_type, device_id);

-- Add constraints for data integrity
ALTER TABLE biometric_data 
ADD CONSTRAINT chk_biometric_type_valid CHECK (biometric_type IN ('FACE_ID', 'FINGERPRINT'));

-- Add audit fields to users table if not already present
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP NULL;

-- Create index for user audit fields
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at); 