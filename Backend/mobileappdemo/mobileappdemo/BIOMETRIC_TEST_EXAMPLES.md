# Biometric Authentication Testing Examples

## Overview
This file contains testing examples specifically for the biometric authentication features (Face ID and Fingerprint) in the Swift Wallet API.

**Base URL:** `http://localhost:8082`

---

## 🔐 Biometric Authentication Testing

### 1. Biometric Setup Test

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

### 2. Biometric Login Test

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

### 3. Get Biometric Devices Test

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

### 4. Check Biometric Status Test

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

### 5. Remove Biometric Device Test

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

## 🧪 Complete Test Scenarios

### Scenario 1: Face ID Setup and Login

1. **Register User:**
```bash
curl -X POST http://localhost:8082/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "faceiduser@example.com",
    "username": "faceiduser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

2. **Setup Face ID:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "faceiduser@example.com",
    "password": "password123",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "iphone_15_pro_003",
    "deviceName": "iPhone 15 Pro"
  }'
```

3. **Login with Face ID:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "faceiduser@example.com",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "iphone_15_pro_003"
  }'
```

### Scenario 2: Fingerprint Setup and Login

1. **Setup Fingerprint:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "faceiduser@example.com",
    "password": "password123",
    "biometricType": "FINGERPRINT",
    "biometricData": "fingerprint_data_base64",
    "deviceId": "samsung_galaxy_001",
    "deviceName": "Samsung Galaxy S24"
  }'
```

2. **Login with Fingerprint:**
```bash
curl -X POST http://localhost:8082/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "faceiduser@example.com",
    "biometricType": "FINGERPRINT",
    "biometricData": "fingerprint_data_base64",
    "deviceId": "samsung_galaxy_001"
  }'
```

### Scenario 3: Multiple Devices

1. **Check All Devices:**
```bash
curl -X GET "http://localhost:8082/api/auth/biometric/devices?emailOrPhone=faceiduser@example.com"
```

2. **Remove One Device:**
```bash
curl -X DELETE "http://localhost:8082/api/auth/biometric/devices/1?emailOrPhone=faceiduser@example.com"
```

---

## 🔒 Error Testing

### Test Invalid Biometric Data

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

### Test Wrong Password During Setup

```bash
curl -X POST http://localhost:8082/api/auth/biometric/setup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "testuser@example.com",
    "password": "wrongpassword",
    "biometricType": "FACE_ID",
    "biometricData": "face_data_base64",
    "deviceId": "new_device",
    "deviceName": "New Device"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid password"
}
```

---

## 📱 Mobile Integration Examples

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

## 🎯 Best Practices

1. **Test both biometric types** (FACE_ID and FINGERPRINT)
2. **Use realistic device IDs** and names
3. **Test with multiple devices** per user
4. **Validate error scenarios** thoroughly
5. **Test biometric data verification** logic
6. **Monitor device management** (add/remove devices)
7. **Test concurrent biometric logins**
8. **Validate security measures**
9. **Test with different biometric data formats**
10. **Document test results** for regression testing

---

## 📊 Biometric Types

- **FACE_ID**: Face recognition authentication
- **FINGERPRINT**: Fingerprint authentication

Users can choose between either or both biometric types for authentication. 