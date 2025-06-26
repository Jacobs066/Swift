-- Initial database schema for Swift Wallet Application
-- Migration: V1__init.sql

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email_or_phone VARCHAR(255) UNIQUE,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create otp_entry table
CREATE TABLE otp_entry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    otp VARCHAR(10),
    expires_at TIMESTAMP
);

-- Create wallets table
CREATE TABLE wallets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create transactions table
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(19,6),
    converted_amount DECIMAL(19,2),
    converted_currency VARCHAR(10),
    description VARCHAR(500),
    reference VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);

-- Create exchange_rates table
CREATE TABLE exchange_rates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_currency VARCHAR(10) NOT NULL,
    to_currency VARCHAR(10) NOT NULL,
    rate DECIMAL(19,6) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email_or_phone ON users(email_or_phone);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_currency ON wallets(currency);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_exchange_rates_expires_at ON exchange_rates(expires_at);

-- Insert initial exchange rates (optional - can be populated by the application)
INSERT INTO exchange_rates (from_currency, to_currency, rate, expires_at) VALUES
('GHS', 'USD', 0.083, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('USD', 'GHS', 12.05, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('GHS', 'GBP', 0.065, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('GBP', 'GHS', 15.38, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('GHS', 'EUR', 0.076, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('EUR', 'GHS', 13.16, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('USD', 'GBP', 0.78, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('GBP', 'USD', 1.28, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('USD', 'EUR', 0.91, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('EUR', 'USD', 1.10, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('GBP', 'EUR', 1.17, DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
('EUR', 'GBP', 0.85, DATE_ADD(NOW(), INTERVAL 30 MINUTE)); 