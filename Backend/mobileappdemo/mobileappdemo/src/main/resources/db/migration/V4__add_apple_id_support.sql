-- Migration: V4__add_apple_id_support.sql
-- Add Apple ID authentication support

-- Add Apple ID related columns to users table
ALTER TABLE users 
ADD COLUMN apple_id VARCHAR(255) UNIQUE,
ADD COLUMN auth_provider VARCHAR(20) DEFAULT 'EMAIL',
ADD COLUMN first_name VARCHAR(100),
ADD COLUMN last_name VARCHAR(100);

-- Add index for Apple ID lookups
CREATE INDEX idx_users_apple_id ON users(apple_id);
CREATE INDEX idx_users_auth_provider ON users(auth_provider);

-- Add constraint for valid auth providers
ALTER TABLE users 
ADD CONSTRAINT chk_auth_provider_valid CHECK (auth_provider IN ('EMAIL', 'PHONE', 'APPLE_ID', 'GOOGLE', 'FACEBOOK')); 