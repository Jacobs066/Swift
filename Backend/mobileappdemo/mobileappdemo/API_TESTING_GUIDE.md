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

# Swift Wallet API Testing Guide

## Overview
This guide provides comprehensive testing examples for the Swift Wallet API, including both OTP and biometric authentication methods.

**Base URL:** `http://localhost:8082`

---

## 🔐 Authentication Testing

### 1. User Registration Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/auth/signup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "emailOrPhone": "testuser@example.com",
  "username": "testuser",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Registration successful!\nUsername: testuser\nEmail/Phone: testuser@example.com\nAccount created: 2024-01-15T10:30:00"
}
```

### 2. OTP Login Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "password": "password123"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "emailOrPhone": "testuser@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "OTP sent successfully to your email"
}
```

### 3. OTP Verification Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "otp": "123456"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/auth/verify-otp`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "testuser@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "message": "Login successful! Welcome testuser"
}
```

### 4. Biometric Setup Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "password": "password123",
    "biometricType": "FACE_ID",
    "biometricData": "base64_encoded_face_data_here",
    "deviceId": "iphone_15_pro_001",
    "deviceName": "iPhone 15 Pro"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/auth/biometric/setup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "emailOrPhone": "testuser@example.com",
  "password": "password123",
  "biometricType": "FACE_ID",
  "biometricData": "base64_encoded_face_data_here",
  "deviceId": "iphone_15_pro_001",
  "deviceName": "iPhone 15 Pro"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Face ID setup successful",
  "deviceName": "iPhone 15 Pro",
  "biometricType": "Face ID"
}
```

### 5. Biometric Login Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "base64_encoded_face_data_here",
    "deviceId": "iphone_15_pro_001"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/auth/biometric/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "emailOrPhone": "testuser@example.com",
  "biometricType": "FACE_ID",
  "biometricData": "base64_encoded_face_data_here",
  "deviceId": "iphone_15_pro_001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Biometric login successful! Welcome testuser",
  "user": {
    "id": 1,
    "username": "testuser",
    "emailOrPhone": "testuser@example.com"
  }
}
```

### 6. Get Biometric Devices Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/auth/biometric/devices?emailOrPhone=testuser@example.com"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/auth/biometric/devices?emailOrPhone=testuser@example.com`

**Expected Response:**
```json
{
  "success": true,
  "devices": [
    {
      "id": 1,
      "biometricType": "Face ID",
      "deviceName": "iPhone 15 Pro",
      "deviceId": "iphone_15_pro_001",
      "createdAt": "2024-01-15T10:30:00",
      "lastUsedAt": "2024-01-15T14:30:00"
    }
  ]
}
```

### 7. Check Biometric Status Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/auth/biometric/status?emailOrPhone=testuser@example.com"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/auth/biometric/status?emailOrPhone=testuser@example.com`

**Expected Response:**
```json
{
  "success": true,
  "hasBiometric": true,
  "biometricCount": 1
}
```

### 8. Remove Biometric Device Test

**cURL:**
```bash
curl -X DELETE "http://localhost:8082/api/auth/biometric/devices/1?emailOrPhone=testuser@example.com"
```

**Postman:**
- Method: `DELETE`
- URL: `http://localhost:8082/api/auth/biometric/devices/1?emailOrPhone=testuser@example.com`

**Expected Response:**
```json
{
  "success": true,
  "message": "Biometric device removed successfully"
}
```

---

## 💰 Wallet Testing

### 1. Get User Wallets Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/wallets/wallets?userId=1"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/wallets/wallets?userId=1`

**Expected Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "currency": "GHS",
    "balance": 1000.00,
    "isPrimary": true,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### 2. Get Wallet by ID Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/wallets/wallets/1"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/wallets/wallets/1`

**Expected Response:**
```json
{
  "id": 1,
  "userId": 1,
  "currency": "GHS",
  "balance": 1000.00,
  "isPrimary": true,
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### 3. Transfer Money Test

**cURL:**
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

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/wallets/transfer`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "fromWalletId": 1,
  "toWalletId": 2,
  "amount": 100.00,
  "currency": "GHS",
  "description": "Test transfer"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transfer completed successfully"
}
```

---

## 📊 Transaction Testing

### 1. Get Wallet Transactions Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/transactions/wallet/1?page=0&size=10&sortBy=createdAt&sortDir=desc"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/transactions/wallet/1?page=0&size=10&sortBy=createdAt&sortDir=desc`

**Expected Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "transactionType": "TRANSFER",
      "displayType": "Sent",
      "amount": 100.00,
      "currency": "GHS",
      "currencySymbol": "₵",
      "description": "Test transfer",
      "reference": "TXN123456",
      "status": "COMPLETED",
      "formattedDate": "Jan 15, 2024",
      "formattedTime": "14:30",
      "recipientName": "USD Wallet",
      "senderName": null,
      "walletName": "GHS Wallet",
      "isIncoming": false
    }
  ],
  "currentPage": 0,
  "totalItems": 1,
  "totalPages": 1,
  "hasNext": false,
  "hasPrevious": false
}
```

### 2. Get User Transactions Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/transactions/user/1?page=0&size=10&sortBy=createdAt&sortDir=desc"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/transactions/user/1?page=0&size=10&sortBy=createdAt&sortDir=desc`

**Expected Response:** Same structure as Get Wallet Transactions

### 3. Get Transaction History with Filters Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/transactions/history?userId=1&type=TRANSFER&status=COMPLETED&page=0&size=10"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/transactions/history?userId=1&type=TRANSFER&status=COMPLETED&page=0&size=10`

**Expected Response:** Same structure as Get Wallet Transactions with additional `filters` object

---

## 💱 Exchange Rate Testing

### 1. Get Exchange Rate Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/exchange-rates/GHS/USD"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/exchange-rates/GHS/USD`

**Expected Response:**
```json
{
  "fromCurrency": "GHS",
  "toCurrency": "USD",
  "rate": 0.083,
  "createdAt": "2024-01-15T14:30:00",
  "expiresAt": "2024-01-15T15:00:00"
}
```

---

## 🏦 Payment Testing (Paystack)

### 1. Initialize Payment Test

**cURL:**
```bash
curl -X POST http://localhost:8082/api/payments/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000.00,
    "currency": "GHS",
    "email": "testuser@example.com",
    "reference": "PAY123456",
    "description": "Wallet funding"
  }'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:8082/api/payments/initialize`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "amount": 1000.00,
  "currency": "GHS",
  "email": "testuser@example.com",
  "reference": "PAY123456",
  "description": "Wallet funding"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "authorization_url": "https://checkout.paystack.com/0x123456",
    "access_code": "0x123456",
    "reference": "PAY123456"
  }
}
```

### 2. Verify Payment Test

**cURL:**
```bash
curl -X GET "http://localhost:8082/api/payments/verify/PAY123456"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:8082/api/payments/verify/PAY123456`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "amount": 1000.00,
    "currency": "GHS",
    "reference": "PAY123456"
  }
}
```

---

## 🧪 Complete Test Flow

### Test Scenario: Full User Journey with Biometric Authentication

1. **Register a new user**
2. **Setup biometric authentication**
3. **Login with biometric**
4. **Check wallet balance**
5. **Perform a transfer**
6. **View transaction history**

**Step 1: Register**
```bash
curl -X POST http://localhost:8082/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "biometricuser@example.com",
    "username": "biometricuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Step 2: Setup Face ID**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "biometricuser@example.com",
    "password": "password123",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "iphone_15_pro_002",
    "deviceName": "iPhone 15 Pro"
  }'
```

**Step 3: Setup Fingerprint (Alternative)**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "biometricuser@example.com",
    "password": "password123",
    "biometricType": "FINGERPRINT",
    "biometricData": "fingerprint_data_base64",
    "deviceId": "samsung_galaxy_001",
    "deviceName": "Samsung Galaxy S24"
  }'
```

**Step 4: Login with Face ID**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "biometricuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "iphone_15_pro_002"
  }'
```

**Step 5: Check Biometric Devices**
```bash
curl -X GET "http://localhost:8082/api/auth/biometric/devices?emailOrPhone=biometricuser@example.com"
```

**Step 6: Get Wallets**
```bash
curl -X GET "http://localhost:8082/api/wallets/wallets?userId=1"
```

**Step 7: Transfer Money**
```bash
curl -X POST http://localhost:8082/api/wallets/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromWalletId": 1,
    "toWalletId": 2,
    "amount": 50.00,
    "currency": "GHS",
    "description": "Biometric user transfer"
  }'
```

**Step 8: View Transactions**
```bash
curl -X GET "http://localhost:8082/api/transactions/user/1?page=0&size=10"
```

---

## 🔧 Error Testing

### Test Invalid Biometric Data

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "invalid_data",
    "deviceId": "unknown_device"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Biometric data not found for this device"
}
```

### Test Duplicate Biometric Setup

**cURL:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "password": "password123",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "iphone_15_pro_001",
    "deviceName": "iPhone 15 Pro"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Biometric data already exists for this device and type"
}
```

---

## 📱 Mobile App Integration Examples

### React Native Example

```javascript
// Biometric Setup
const setupBiometric = async (emailOrPhone, password, biometricType, biometricData, deviceId, deviceName) => {
  try {
    const response = await fetch('http://localhost:8082/api/auth/biometric/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone,
        password,
        biometricType,
        biometricData,
        deviceId,
        deviceName
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Biometric setup failed:', error);
    throw error;
  }
};

// Biometric Login
const biometricLogin = async (emailOrPhone, biometricType, biometricData, deviceId) => {
  try {
    const response = await fetch('http://localhost:8082/api/auth/biometric/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone,
        biometricType,
        biometricData,
        deviceId
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Biometric login failed:', error);
    throw error;
  }
};
```

### Flutter Example

```dart
// Biometric Setup
Future<Map<String, dynamic>> setupBiometric({
  required String emailOrPhone,
  required String password,
  required String biometricType,
  required String biometricData,
  required String deviceId,
  required String deviceName,
}) async {
  try {
    final response = await http.post(
      Uri.parse('http://localhost:8082/api/auth/biometric/setup'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'emailOrPhone': emailOrPhone,
        'password': password,
        'biometricType': biometricType,
        'biometricData': biometricData,
        'deviceId': deviceId,
        'deviceName': deviceName,
      }),
    );
    
    return jsonDecode(response.body);
  } catch (e) {
    print('Biometric setup failed: $e');
    rethrow;
  }
}

// Biometric Login
Future<Map<String, dynamic>> biometricLogin({
  required String emailOrPhone,
  required String biometricType,
  required String biometricData,
  required String deviceId,
}) async {
  try {
    final response = await http.post(
      Uri.parse('http://localhost:8082/api/auth/biometric/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'emailOrPhone': emailOrPhone,
        'biometricType': biometricType,
        'biometricData': biometricData,
        'deviceId': deviceId,
      }),
    );
    
    return jsonDecode(response.body);
  } catch (e) {
    print('Biometric login failed: $e');
    rethrow;
  }
}
```

---

## 🚀 Performance Testing

### Load Testing with Apache Bench

**Test Biometric Login Endpoint:**
```bash
ab -n 100 -c 10 -p biometric_login.json -T application/json http://localhost:8082/api/auth/biometric/login
```

**biometric_login.json:**
```json
{
  "emailOrPhone": "testuser@example.com",
  "biometricType": "FACE_ID",
  "biometricData": "base64_encoded_data",
  "deviceId": "test_device"
}
```

### Concurrent User Testing

**Test Multiple Biometric Logins:**
```bash
for i in {1..10}; do
  curl -X POST http://localhost:8082/api/auth/biometric/login \
    -H "Content-Type: application/json" \
    -d "{
      \"emailOrPhone\": \"user$i@example.com\",
      \"biometricType\": \"FACE_ID\",
      \"biometricData\": \"data$i\",
      \"deviceId\": \"device$i\"
    }" &
done
wait
```

---

## 📊 Monitoring and Logging

### Check Application Logs

```bash
# View Spring Boot logs
tail -f logs/application.log

# Monitor database connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check Redis connections
redis-cli info clients
```

### Health Check Endpoints

```bash
# Application health
curl -X GET "http://localhost:8082/actuator/health"

# Database health
curl -X GET "http://localhost:8082/actuator/health/db"

# Redis health
curl -X GET "http://localhost:8082/actuator/health/redis"
```

---

## 🔒 Security Testing

### Test Biometric Data Validation

```bash
# Test with null biometric data
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": null,
    "deviceId": "test_device"
  }'

# Test with empty biometric data
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "",
    "deviceId": "test_device"
  }'
```

### Test Device ID Validation

```bash
# Test with invalid device ID
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "valid_data",
    "deviceId": "invalid_device_id"
  }'
```

---

## 📝 Test Data Management

### Create Test Users Script

```bash
#!/bin/bash

# Create multiple test users
for i in {1..5}; do
  curl -X POST http://localhost:8082/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{
      \"emailOrPhone\": \"testuser$i@example.com\",
      \"username\": \"testuser$i\",
      \"password\": \"password123\",
      \"confirmPassword\": \"password123\"
    }"
  
  echo "Created user testuser$i"
done
```

### Cleanup Test Data

```sql
-- Clean up test biometric data
DELETE FROM biometric_data WHERE device_id LIKE 'test_%';

-- Clean up test users
DELETE FROM users WHERE email_or_phone LIKE 'testuser%@example.com';

-- Clean up test transactions
DELETE FROM transactions WHERE description LIKE 'Test%';
```

---

## 🎯 Best Practices

1. **Always test both authentication methods** (OTP and Biometric)
2. **Use realistic biometric data** for testing
3. **Test error scenarios** thoroughly
4. **Monitor performance** under load
5. **Validate security** measures
6. **Keep test data** separate from production
7. **Document test results** for regression testing
8. **Use environment variables** for configuration
9. **Test on multiple devices** and platforms
10. **Validate data integrity** after operations

---

## 📞 Support

For testing support or questions:
- Check the main API documentation
- Review database migration logs
- Monitor application logs for errors
- Test with different biometric types and devices 