# Swift Wallet API Documentation

## Overview
The Swift Wallet API provides a complete multi-currency wallet system with authentication, transactions, and exchange rate management.

**Base URL:** `http://localhost:8082`

## Authentication Flow
1. **Signup** → Create account
2. **Login** → Get OTP sent to email
3. **Verify OTP** → Complete login

---

## 🔐 Authentication APIs

### 1. User Registration
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "emailOrPhone": "user@example.com",
  "username": "john_doe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful!\nUsername: john_doe\nEmail/Phone: user@example.com\nAccount created: 2024-01-15T10:30:00"
}
```

**Validation Rules:**
- Password must be at least 8 characters
- Passwords must match
- Email/Phone must be unique
- Username must be unique

### 2. User Login
**POST** `/api/auth/login`

Login and receive OTP via email.

**Request Body:**
```json
{
  "emailOrPhone": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully to your email"
}
```

### 3. OTP Verification
**POST** `/api/auth/verify-otp`

Complete login by verifying OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful! Welcome john_doe"
}
```

---

## 💰 Wallet APIs

### 1. Get User Wallets
**GET** `/api/wallets/wallets?userId=1`

Get all wallets for a user.

**Response:**
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
  },
  {
    "id": 2,
    "userId": 1,
    "currency": "USD",
    "balance": 500.00,
    "isPrimary": false,
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### 2. Get Wallet by ID
**GET** `/api/wallets/wallets/{walletId}`

Get specific wallet details.

**Example:** `GET /api/wallets/wallets/1`

**Response:**
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

### 3. Get Wallet by Currency
**GET** `/api/wallets/wallets/currency/{currency}?userId=1`

Get user's wallet for specific currency.

**Example:** `GET /api/wallets/wallets/currency/GHS?userId=1`

**Response:** Same as Get Wallet by ID

### 4. Transfer Money
**POST** `/api/wallets/transfer`

Transfer money between wallets.

**Request Body:**
```json
{
  "fromWalletId": 1,
  "toWalletId": 2,
  "amount": 100.00,
  "currency": "GHS",
  "description": "Transfer to USD wallet"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transfer completed successfully"
}
```

### 5. Get Wallet Balance
**GET** `/api/wallets/balance/{walletId}`

Get balance for specific wallet.

**Example:** `GET /api/wallets/balance/1`

**Response:**
```json
{
  "walletId": 1,
  "currency": "GHS",
  "balance": 1000.00,
  "symbol": "₵"
}
```

### 6. Get All Balances
**GET** `/api/wallets/balances?userId=1`

Get all wallet balances for a user.

**Response:**
```json
[
  {
    "walletId": 1,
    "currency": "GHS",
    "balance": 1000.00,
    "symbol": "₵",
    "isPrimary": true
  },
  {
    "walletId": 2,
    "currency": "USD",
    "balance": 500.00,
    "symbol": "$",
    "isPrimary": false
  }
]
```

---

## 📊 Transaction APIs

### 1. Get Wallet Transactions
**GET** `/api/transactions/wallet/{walletId}?page=0&size=10&sortBy=createdAt&sortDir=desc`

Get paginated transactions for a specific wallet.

**Example:** `GET /api/transactions/wallet/1?page=0&size=10`

**Response:**
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
      "description": "Transfer to USD wallet",
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
  "totalItems": 25,
  "totalPages": 3,
  "hasNext": true,
  "hasPrevious": false
}
```

### 2. Get User Transactions
**GET** `/api/transactions/user/{userId}?page=0&size=10&sortBy=createdAt&sortDir=desc`

Get all transactions for a user across all wallets.

**Example:** `GET /api/transactions/user/1?page=0&size=10`

**Response:** Same structure as Get Wallet Transactions

### 3. Get Transaction History (Advanced Filtering)
**GET** `/api/transactions/history?userId=1&walletId=1&type=TRANSFER&status=COMPLETED&startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59&page=0&size=10`

Get filtered transaction history with advanced options.

**Query Parameters:**
- `userId` (required): User ID
- `walletId` (optional): Filter by specific wallet
- `type` (optional): Transaction type (DEPOSIT, WITHDRAWAL, TRANSFER, etc.)
- `status` (optional): Transaction status (PENDING, COMPLETED, FAILED, CANCELLED)
- `startDate` (optional): Start date for filtering
- `endDate` (optional): End date for filtering
- `page` (default: 0): Page number
- `size` (default: 10): Page size
- `sortBy` (default: createdAt): Sort field
- `sortDir` (default: desc): Sort direction (asc/desc)

**Response:** Same structure as Get Wallet Transactions with additional `filters` object

### 4. Get Transaction Summary
**GET** `/api/transactions/summary/{userId}`

Get transaction statistics for a user.

**Example:** `GET /api/transactions/summary/1`

**Response:**
```json
{
  "totalTransactions": 150,
  "totalAmount": 50000.00,
  "averageAmount": 333.33,
  "transactionsByType": {
    "DEPOSIT": 50,
    "WITHDRAWAL": 30,
    "TRANSFER": 70
  },
  "transactionsByStatus": {
    "COMPLETED": 140,
    "PENDING": 5,
    "FAILED": 5
  },
  "transactionsByCurrency": {
    "GHS": 100,
    "USD": 30,
    "EUR": 20
  }
}
```

### 5. Get Transaction by ID
**GET** `/api/transactions/{transactionId}`

Get specific transaction details.

**Example:** `GET /api/transactions/1`

**Response:**
```json
{
  "id": 1,
  "wallet": {
    "id": 1,
    "currency": "GHS"
  },
  "type": "TRANSFER",
  "amount": 100.00,
  "currency": "GHS",
  "description": "Transfer to USD wallet",
  "reference": "TXN123456",
  "status": "COMPLETED",
  "createdAt": "2024-01-15T14:30:00",
  "updatedAt": "2024-01-15T14:30:00"
}
```

### 6. Get Transactions by Reference
**GET** `/api/transactions/reference/{reference}`

Get all transactions with a specific reference.

**Example:** `GET /api/transactions/reference/TXN123456`

**Response:** Array of TransactionHistoryDto objects

### 7. Get Transactions by Status
**GET** `/api/transactions/status/{status}`

Get all transactions with a specific status.

**Example:** `GET /api/transactions/status/COMPLETED`

**Response:** Array of TransactionHistoryDto objects

### 8. Get Transactions by Type
**GET** `/api/transactions/type/{type}`

Get all transactions of a specific type.

**Example:** `GET /api/transactions/type/TRANSFER`

**Response:** Array of TransactionHistoryDto objects

### 9. Get Recent Transactions
**GET** `/api/transactions/recent/{userId}`

Get the 10 most recent transactions for a user.

**Example:** `GET /api/transactions/recent/1`

**Response:** Array of TransactionHistoryDto objects

### 10. Update Transaction Status
**PUT** `/api/transactions/{transactionId}/status?status=COMPLETED`

Update the status of a transaction.

**Example:** `PUT /api/transactions/1/status?status=COMPLETED`

**Response:**
```json
{
  "success": true,
  "message": "Transaction status updated successfully",
  "transaction": {
    "id": 1,
    "status": "COMPLETED"
  }
}
```

### 11. Export Transaction History
**GET** `/api/transactions/export/{userId}?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59`

Export transaction history as CSV.

**Example:** `GET /api/transactions/export/1`

**Response:** CSV file download

---

## 💱 Exchange Rate APIs

### 1. Get Exchange Rate
**GET** `/api/exchange-rates/{fromCurrency}/{toCurrency}`

Get current exchange rate between two currencies.

**Example:** `GET /api/exchange-rates/GHS/USD`

**Response:**
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

## 🏦 Payment APIs (Paystack Integration)

### 1. Initialize Payment
**POST** `/api/payments/initialize`

Initialize a payment transaction.

**Request Body:**
```json
{
  "amount": 1000.00,
  "currency": "GHS",
  "email": "user@example.com",
  "reference": "PAY123456",
  "description": "Wallet funding"
}
```

**Response:**
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

### 2. Verify Payment
**GET** `/api/payments/verify/{reference}`

Verify a completed payment.

**Example:** `GET /api/payments/verify/PAY123456`

**Response:**
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

## 📋 Data Models

### Currency Types
- `GHS` - Ghana Cedi (₵)
- `USD` - US Dollar ($)
- `GBP` - British Pound (£)
- `EUR` - Euro (€)

### Transaction Types
- `DEPOSIT` - Money added to wallet
- `WITHDRAWAL` - Money removed from wallet
- `TRANSFER` - Money moved between wallets
- `CURRENCY_EXCHANGE` - Currency conversion
- `PAYMENT` - External payment

### Transaction Status
- `PENDING` - Transaction is being processed
- `COMPLETED` - Transaction successful
- `FAILED` - Transaction failed
- `CANCELLED` - Transaction cancelled

---

## 🔧 Error Handling

All APIs return appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input or business logic error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 📝 Testing

### Using cURL Examples

**Signup:**
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

**Login:**
```bash
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "password123"
  }'
```

**Get Wallets:**
```bash
curl -X GET "http://localhost:8082/api/wallets/wallets?userId=1"
```

**Transfer Money:**
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

---

## 🚀 Getting Started

1. **Start the application:**
   ```bash
   mvn spring-boot:run
   ```

2. **Database setup:**
   - MySQL database will be automatically created
   - Flyway migrations will run on startup

3. **Test the APIs:**
   - Use the provided cURL examples
   - Or use the frontend test pages in the `Frontend/` directory

4. **Configuration:**
   - Update `application.properties` with your database credentials
   - Add your Paystack API keys for payment functionality
   - Configure email settings for OTP delivery

---

## 📞 Support

For API support or questions, please refer to:
- API documentation: This file
- Database migrations: `FLYWAY_README.md`
- Frontend examples: `Frontend/` directory 