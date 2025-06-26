-- Migration: V2__add_audit_fields.sql
-- Add audit fields and improve existing tables

-- Add audit fields to users table
ALTER TABLE users 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN last_login_at TIMESTAMP NULL;

-- Add audit fields to otp_entry table
ALTER TABLE otp_entry 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN is_used BOOLEAN DEFAULT FALSE;

-- Add additional indexes for better performance
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_last_login ON users(last_login_at);
CREATE INDEX idx_otp_entry_email_created ON otp_entry(email, created_at);
CREATE INDEX idx_otp_entry_expires_at ON otp_entry(expires_at);

-- Add constraints for data integrity
ALTER TABLE wallets 
ADD CONSTRAINT chk_balance_positive CHECK (balance >= 0),
ADD CONSTRAINT chk_currency_valid CHECK (currency IN ('GHS', 'USD', 'GBP', 'EUR'));

ALTER TABLE transactions 
ADD CONSTRAINT chk_amount_positive CHECK (amount > 0),
ADD CONSTRAINT chk_currency_valid CHECK (currency IN ('GHS', 'USD', 'GBP', 'EUR')),
ADD CONSTRAINT chk_status_valid CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
ADD CONSTRAINT chk_type_valid CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'CURRENCY_EXCHANGE', 'PAYMENT'));

ALTER TABLE exchange_rates 
ADD CONSTRAINT chk_rate_positive CHECK (rate > 0),
ADD CONSTRAINT chk_currencies_different CHECK (from_currency != to_currency); 