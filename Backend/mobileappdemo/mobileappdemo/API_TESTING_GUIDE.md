# API Testing Guide

## Quick Start Testing

### 1. Start the Application
```bash
cd Backend/mobileappdemo/mobileappdemo
mvn spring-boot:run
```

The application will start on `http://localhost:8082`

### 2. Test Authentication Flow

#### Step 1: Create Account
```bash
curl -X POST http://localhost:8082/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Registration successful!\nUsername: testuser\nEmail/Phone: test@example.com\nAccount created: 2024-01-15T10:30:00"
}
```

#### Step 2: Login (Get OTP)
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "OTP sent successfully to your email"
}
```

#### Step 3: Verify OTP
```bash
curl -X POST http://localhost:8082/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful! Welcome testuser"
}
```

### 3. Test Wallet Operations

#### Get User Wallets
```bash
curl -X GET "http://localhost:8082/api/wallets/wallets?userId=1"
```

#### Get Wallet Balance
```bash
curl -X GET "http://localhost:8082/api/wallets/balance/1"
```

#### Transfer Money
```bash
curl -X POST http://localhost:8082/api/wallets/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromWalletId": 1,
    "toWalletId": 2,
    "amount": 100.00,
    "currency": "GHS",
    "description": "Test transfer"
  }'
```

### 4. Test Transaction Operations

#### Get Wallet Transactions
```bash
curl -X GET "http://localhost:8082/api/transactions/wallet/1?page=0&size=10"
```

#### Get User Transactions
```bash
curl -X GET "http://localhost:8082/api/transactions/user/1?page=0&size=10"
```

#### Get Transaction History with Filters
```bash
curl -X GET "http://localhost:8082/api/transactions/history?userId=1&type=TRANSFER&status=COMPLETED&page=0&size=10"
```

#### Get Transaction Summary
```bash
curl -X GET "http://localhost:8082/api/transactions/summary/1"
```

## Using Postman

### Import Collection
1. Open Postman
2. Create a new collection called "Swift Wallet API"
3. Add the following requests:

### Authentication Requests

#### 1. Signup
- **Method:** POST
- **URL:** `http://localhost:8082/api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "emailOrPhone": "test@example.com",
  "username": "testuser",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### 2. Login
- **Method:** POST
- **URL:** `http://localhost:8082/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "emailOrPhone": "test@example.com",
  "password": "password123"
}
```

#### 3. Verify OTP
- **Method:** POST
- **URL:** `http://localhost:8082/api/auth/verify-otp`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "otp": "123456"
}
```

### Wallet Requests

#### 4. Get User Wallets
- **Method:** GET
- **URL:** `http://localhost:8082/api/wallets/wallets?userId=1`

#### 5. Get Wallet Balance
- **Method:** GET
- **URL:** `http://localhost:8082/api/wallets/balance/1`

#### 6. Transfer Money
- **Method:** POST
- **URL:** `http://localhost:8082/api/wallets/transfer`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "fromWalletId": 1,
  "toWalletId": 2,
  "amount": 100.00,
  "currency": "GHS",
  "description": "Test transfer"
}
```

### Transaction Requests

#### 7. Get Wallet Transactions
- **Method:** GET
- **URL:** `http://localhost:8082/api/transactions/wallet/1?page=0&size=10`

#### 8. Get User Transactions
- **Method:** GET
- **URL:** `http://localhost:8082/api/transactions/user/1?page=0&size=10`

#### 9. Get Transaction History
- **Method:** GET
- **URL:** `http://localhost:8082/api/transactions/history?userId=1&type=TRANSFER&status=COMPLETED&page=0&size=10`

#### 10. Get Transaction Summary
- **Method:** GET
- **URL:** `http://localhost:8082/api/transactions/summary/1`

## Using Frontend Test Pages

The project includes HTML test pages in the `Frontend/` directory:

1. **`test_api.html`** - Basic API testing interface
2. **`test_transactions.html`** - Transaction-specific testing
3. **`test_enhanced_transactions.html`** - Advanced transaction testing
4. **`transaction_demo.html`** - Transaction history demo
5. **`wallet.html`** - Wallet management interface

### How to Use Frontend Test Pages

1. Start the backend application
2. Open any HTML file in your browser
3. Click the test buttons to execute API calls
4. View responses in the interface

## Common Test Scenarios

### Scenario 1: Complete User Journey
1. Create account
2. Login and verify OTP
3. Check wallet balances
4. Make a transfer
5. View transaction history

### Scenario 2: Error Handling
1. Try to register with existing email
2. Try to login with wrong password
3. Try to transfer more than available balance
4. Try to access non-existent wallet

### Scenario 3: Transaction Filtering
1. Create multiple transactions
2. Filter by transaction type
3. Filter by date range
4. Filter by status
5. Export transaction history

## Testing Checklist

### Authentication
- [ ] User registration with valid data
- [ ] User registration with invalid data (password mismatch, existing email)
- [ ] User login with valid credentials
- [ ] User login with invalid credentials
- [ ] OTP verification with valid OTP
- [ ] OTP verification with invalid/expired OTP

### Wallets
- [ ] Get user wallets
- [ ] Get specific wallet by ID
- [ ] Get wallet by currency
- [ ] Get wallet balance
- [ ] Get all balances for user
- [ ] Transfer money between wallets
- [ ] Transfer with insufficient balance

### Transactions
- [ ] Get wallet transactions with pagination
- [ ] Get user transactions with pagination
- [ ] Get transaction history with filters
- [ ] Get transaction summary
- [ ] Get transaction by ID
- [ ] Get transactions by reference
- [ ] Get transactions by status
- [ ] Get transactions by type
- [ ] Get recent transactions
- [ ] Update transaction status
- [ ] Export transaction history

### Error Cases
- [ ] Invalid user ID
- [ ] Invalid wallet ID
- [ ] Invalid transaction ID
- [ ] Invalid currency
- [ ] Invalid transaction type
- [ ] Invalid status
- [ ] Invalid date format
- [ ] Missing required fields

## Performance Testing

### Load Testing with Apache Bench (ab)

#### Test Authentication Endpoint
```bash
ab -n 100 -c 10 -p signup_data.json -T application/json http://localhost:8082/api/auth/signup
```

#### Test Wallet Endpoint
```bash
ab -n 100 -c 10 http://localhost:8082/api/wallets/wallets?userId=1
```

#### Test Transaction Endpoint
```bash
ab -n 100 -c 10 http://localhost:8082/api/transactions/user/1?page=0&size=10
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure the application is running on port 8082
   - Check if the port is not in use by another application

2. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `auth_db` exists

3. **Email Not Sent**
   - Check email configuration in `application.properties`
   - Verify SMTP settings
   - Check if email service is accessible

4. **CORS Issues**
   - CORS is configured to allow all origins
   - If issues persist, check browser console for errors

5. **Validation Errors**
   - Check request body format
   - Ensure all required fields are provided
   - Verify data types match expected format

### Debug Mode

To enable debug logging, add to `application.properties`:
```properties
logging.level.com.swift=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Health Check

Check application health:
```bash
curl -X GET http://localhost:8082/actuator/health
```

## API Response Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing:
- Request rate limiting
- API key authentication
- Request throttling
- IP-based restrictions 