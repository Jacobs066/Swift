# Swift API Testing Guide

## Base URL
```
http://localhost:8081
```

## Authentication Endpoints

### 1. User Signup
**POST** `/api/auth/signup`

**Request Body:**
```json
{
  "username": "testuser",
  "emailOrPhone": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email/phone for OTP.",
  "userId": 1
}
```

### 2. User Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "emailOrPhone": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email/phone",
  "userId": 1
}
```

### 3. Verify OTP
**POST** `/api/auth/verify-otp`

**Request Body:**
```json
{
  "emailOrPhone": "test@example.com",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "emailOrPhone": "test@example.com"
  }
}
```

## Wallet Endpoints

### 4. Get User Wallets
**GET** `/api/wallet/wallets?userId=1`

**Expected Response:**
```json
[
  {
    "id": 1,
    "currency": "GHS",
    "balance": 1000.00,
    "isPrimary": true,
    "userId": 1
  },
  {
    "id": 2,
    "currency": "USD",
    "balance": 500.00,
    "isPrimary": false,
    "userId": 1
  },
  {
    "id": 3,
    "currency": "EUR",
    "balance": 400.00,
    "isPrimary": false,
    "userId": 1
  }
]
```

### 5. Get Wallet by ID
**GET** `/api/wallet/wallets/1`

**Expected Response:**
```json
{
  "id": 1,
  "currency": "GHS",
  "balance": 1000.00,
  "isPrimary": true,
  "userId": 1
}
```

### 6. Get Wallet by Currency
**GET** `/api/wallet/wallets/currency/USD?userId=1`

**Expected Response:**
```json
{
  "id": 2,
  "currency": "USD",
  "balance": 500.00,
  "isPrimary": false,
  "userId": 1
}
```

### 7. Transfer Money
**POST** `/api/wallet/transfer`

**Request Body:**
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

### 8. Get Wallet Balance
**GET** `/api/wallet/balance/1`

**Expected Response:**
```json
{
  "walletId": 1,
  "currency": "GHS",
  "balance": 900.00,
  "symbol": "₵"
}
```

### 9. Get All Balances for User
**GET** `/api/wallet/balances?userId=1`

**Expected Response:**
```json
[
  {
    "walletId": 1,
    "currency": "GHS",
    "balance": 900.00,
    "symbol": "₵",
    "isPrimary": true
  },
  {
    "walletId": 2,
    "currency": "USD",
    "balance": 512.00,
    "symbol": "$",
    "isPrimary": false
  },
  {
    "walletId": 3,
    "currency": "EUR",
    "balance": 400.00,
    "symbol": "€",
    "isPrimary": false
  }
]
```

## Transaction Endpoints

### 10. Get Wallet Transactions
**GET** `/api/transactions/wallet/1`

**Expected Response:**
```json
[
  {
    "id": 1,
    "wallet": {
      "id": 1,
      "currency": "GHS"
    },
    "type": "DEBIT",
    "amount": 100.00,
    "currency": "GHS",
    "description": "Transfer to USD wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  }
]
```

### 11. Get User Transactions
**GET** `/api/transactions/user/1`

**Expected Response:**
```json
[
  {
    "id": 1,
    "wallet": {
      "id": 1,
      "currency": "GHS"
    },
    "type": "DEBIT",
    "amount": 100.00,
    "currency": "GHS",
    "description": "Transfer to USD wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  },
  {
    "id": 2,
    "wallet": {
      "id": 2,
      "currency": "USD"
    },
    "type": "CREDIT",
    "amount": 12.00,
    "currency": "USD",
    "description": "Transfer from GHS wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  }
]
```

### 12. Get Transaction by ID
**GET** `/api/transactions/1`

**Expected Response:**
```json
{
  "id": 1,
  "wallet": {
    "id": 1,
    "currency": "GHS"
  },
  "type": "DEBIT",
  "amount": 100.00,
  "currency": "GHS",
  "description": "Transfer to USD wallet",
  "reference": "TXN_001",
  "status": "COMPLETED",
  "timestamp": "2025-06-26T02:45:00"
}
```

### 13. Get Transactions by Reference
**GET** `/api/transactions/reference/TXN_001`

**Expected Response:**
```json
[
  {
    "id": 1,
    "wallet": {
      "id": 1,
      "currency": "GHS"
    },
    "type": "DEBIT",
    "amount": 100.00,
    "currency": "GHS",
    "description": "Transfer to USD wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  },
  {
    "id": 2,
    "wallet": {
      "id": 2,
      "currency": "USD"
    },
    "type": "CREDIT",
    "amount": 12.00,
    "currency": "USD",
    "description": "Transfer from GHS wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  }
]
```

### 14. Get Transactions by Status
**GET** `/api/transactions/status/COMPLETED`

**Expected Response:**
```json
[
  {
    "id": 1,
    "wallet": {
      "id": 1,
      "currency": "GHS"
    },
    "type": "DEBIT",
    "amount": 100.00,
    "currency": "GHS",
    "description": "Transfer to USD wallet",
    "reference": "TXN_001",
    "status": "COMPLETED",
    "timestamp": "2025-06-26T02:45:00"
  }
]
```

### 15. Update Transaction Status
**PUT** `/api/transactions/1/status?status=PENDING`

**Expected Response:**
```json
{
  "success": true,
  "message": "Transaction status updated successfully",
  "transaction": {
    "id": 1,
    "wallet": {
      "id": 1,
      "currency": "GHS"
    },
    "type": "DEBIT",
    "amount": 100.00,
    "currency": "GHS",
    "description": "Transfer to USD wallet",
    "reference": "TXN_001",
    "status": "PENDING",
    "timestamp": "2025-06-26T02:45:00"
  }
}
```

## Testing Tools

### Using cURL

**Example: Test Signup**
```bash
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "emailOrPhone": "test@example.com",
    "password": "password123"
  }'
```

**Example: Test Login**
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "password123"
  }'
```

**Example: Test Transfer**
```bash
curl -X POST http://localhost:8081/api/wallet/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "fromWalletId": 1,
    "toWalletId": 2,
    "amount": 100.00,
    "currency": "GHS",
    "description": "Test transfer"
  }'
```

### Using Postman

1. **Import the collection** (if you have one)
2. **Set base URL** to `http://localhost:8081`
3. **Test each endpoint** with the provided request bodies
4. **Check responses** against expected formats

### Using Frontend

You can also test using the frontend HTML file:
```
Frontend/wallet.html
```

## Testing Flow

1. **Start with Authentication:**
   - Signup a new user
   - Login with the user
   - Verify OTP (check your email/phone for OTP)

2. **Test Wallet Operations:**
   - Get user wallets
   - Check balances
   - Perform transfers (same currency and cross-currency)

3. **Test Transaction History:**
   - View transaction history
   - Filter by status, reference, etc.

## Error Handling

Common error responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid request data"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Notes

- Make sure MySQL and Redis are running
- The backend should be running on port 8081
- All endpoints support CORS for frontend integration
- Exchange rates are fetched from ExchangeRate-API for cross-currency transfers
- OTP is sent via email/phone (configure your email service for production) 