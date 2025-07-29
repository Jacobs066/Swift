# Paystack Webhook Setup and Testing

## Overview

This document describes the Paystack webhook implementation for handling deposit confirmations and updating user wallet balances.

## Webhook Endpoint

- **URL**: `/api/v1/webhooks/paystack`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Paystack-Signature: <signature>`

## Features

### 1. Signature Verification
- Verifies webhook authenticity using Paystack's HMAC-SHA512 signature
- Uses the secret key from `paystack.secret.key` configuration

### 2. Event Handling
- Currently handles `charge.success` events
- Extracts payment details and user metadata
- Updates user's primary wallet (GHS) balance

### 3. User Identification
The webhook identifies users through:
1. **Metadata**: `user_id` in the payment metadata
2. **Email**: Customer email from the payment
3. **Fallback**: Defaults to user ID 1 for demo purposes

### 4. Wallet Updates
- Finds or creates the user's primary wallet (GHS)
- Converts Paystack amount from kobo to naira
- Updates wallet balance
- Creates transaction record

## Configuration

### Required Properties
```properties
paystack.secret.key=your_paystack_secret_key
paystack.public.key=your_paystack_public_key
paystack.api.url=https://api.paystack.co
```

### Database Requirements
- User table with email field
- Wallet table with user_id, currency, and balance fields
- Transaction table for recording deposits

## Testing

### 1. Test Endpoint
```bash
GET /api/v1/webhooks/paystack/test
```
Returns webhook endpoint status and accessibility.

### 2. Webhook Simulation
```bash
POST /api/v1/webhooks/paystack/test-simulation
Content-Type: application/json

{
  "amount": 100000,
  "reference": "TEST_REF_123",
  "customer": {
    "email": "test@example.com"
  },
  "metadata": {
    "user_id": 1,
    "deposit_type": "wallet_deposit",
    "currency": "GHS"
  }
}
```

### 3. Paystack Dashboard Testing
1. Go to Paystack Dashboard
2. Navigate to Settings > Webhooks
3. Add webhook URL: `https://your-domain.com/api/v1/webhooks/paystack`
4. Select events: `charge.success`
5. Test the webhook using Paystack's test feature

## Integration with Deposit Flow

### Frontend Changes
- Updated `initiateDeposit` API to include `userId` in request
- Defaults to user ID 1 for demo purposes

### Backend Changes
- Updated `DepositController` to include user metadata in Paystack requests
- Updated `PaystackService` to support metadata in payment initialization
- Created `WebhookController` for handling webhook events

## Webhook Payload Structure

```json
{
  "event": "charge.success",
  "data": {
    "amount": 100000,
    "reference": "DEP_123456789",
    "customer": {
      "email": "user@example.com"
    },
    "metadata": {
      "user_id": 1,
      "deposit_type": "wallet_deposit",
      "currency": "GHS"
    }
  }
}
```

## Error Handling

### Signature Verification
- Returns 400 Bad Request if signature is invalid
- Logs verification details for debugging

### User Not Found
- Returns 400 Bad Request if user cannot be identified
- Logs user identification attempts

### Wallet Creation
- Automatically creates user wallets if they don't exist
- Returns 400 Bad Request if wallet creation fails

## Logging

The webhook controller provides detailed logging:
- Webhook payload and signature
- User identification process
- Wallet balance updates
- Transaction creation
- Error details

## Security Considerations

1. **Signature Verification**: Always verify Paystack signatures
2. **Idempotency**: Handle duplicate webhook events
3. **Error Handling**: Graceful handling of malformed payloads
4. **Logging**: Comprehensive logging for debugging
5. **User Validation**: Verify user exists before processing

## Production Deployment

1. **HTTPS**: Ensure webhook endpoint is accessible via HTTPS
2. **Load Balancing**: Configure proper load balancing for webhook endpoints
3. **Monitoring**: Set up monitoring for webhook failures
4. **Rate Limiting**: Implement rate limiting for webhook endpoints
5. **Database Transactions**: Use database transactions for wallet updates

## Troubleshooting

### Common Issues

1. **Invalid Signature**
   - Verify `paystack.secret.key` is correct
   - Check signature calculation logic

2. **User Not Found**
   - Verify user exists in database
   - Check email matching logic
   - Review metadata structure

3. **Wallet Creation Failed**
   - Check database permissions
   - Verify wallet service configuration
   - Review user-wallet relationship

4. **Transaction Creation Failed**
   - Check transaction service configuration
   - Verify database schema
   - Review transaction types

### Debug Steps

1. Check application logs for webhook events
2. Verify webhook endpoint accessibility
3. Test with Paystack's webhook test feature
4. Use the simulation endpoint for local testing
5. Monitor database for wallet balance updates 