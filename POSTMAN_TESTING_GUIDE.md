# 🚀 Complete Postman Testing Guide for Swift Auth API

## 📋 What You Have

You now have a comprehensive Postman collection with **automated tests** for all your authentication endpoints! The collection includes:

- ✅ **Health Check** - Verify backend status
- ✅ **Valid Authentication Flows** - Successful signup, login, OTP verification
- ✅ **Error Case Testing** - Invalid inputs, duplicate users, wrong credentials
- ✅ **Apple ID Authentication** - Apple ID login testing
- ✅ **Automated Test Scripts** - Each request has built-in validation tests

## 🛠️ Setup Instructions

### Step 1: Import the Collection

1. **Open Postman** (download from [postman.com](https://www.postman.com/downloads/) if needed)
2. **Click "Import"** button (top left)
3. **Select "Upload Files"**
4. **Choose `postman_collection.json`** from your project folder
5. **Click "Import"**

### Step 2: Configure Variables

The collection uses these variables (already set up):

| Variable | Value | Description |
|----------|-------|-------------|
| `baseUrl` | `http://localhost:8082` | Your backend URL |
| `testEmail` | `test@example.com` | Test email for signup/login |
| `testPhone` | `+1234567890` | Test phone number |
| `testUsername` | `testuser` | Test username |
| `testPassword` | `password123` | Test password |
| `otpCode` | `123456` | **IMPORTANT: Replace with actual OTP** |

**To update variables:**
- Right-click collection → "Edit"
- Go to "Variables" tab
- Modify values as needed

## 🧪 Testing Your Endpoints

### **1. Health Check (Start Here)**

**Purpose:** Verify backend is running
**Expected Result:**
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP"
    }
  }
}
```

**Automated Tests:**
- ✅ Status code is 200
- ✅ Response has status field
- ✅ Service status is "UP"

### **2. User Signup Flow**

**Test Order:**
1. **Signup - Email** → Creates new user
2. **Signup - Phone** → Creates phone-based user

**Expected Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Automated Tests:**
- ✅ Status code is 200/201
- ✅ Response has success field
- ✅ Signup is successful
- ✅ Response has message

### **3. User Login Flow**

**Test Order:**
1. **Login - Email** → Logs in with email
2. **Login - Phone** → Logs in with phone

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Login successful. OTP sent to your email."
}
```

**Automated Tests:**
- ✅ Status code is 200
- ✅ Login is successful
- ✅ OTP message is present

**Important:** Check your email (`isrealabefah2005@gmail.com`) for the 6-digit OTP!

### **4. OTP Verification**

**Before Testing:**
1. **Update the `otpCode` variable** with the actual OTP from your email
2. **Run the "Login - Email" request first** to generate OTP

**Expected Success Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "token": "jwt_token_here"
}
```

**Automated Tests:**
- ✅ Status code is 200
- ✅ OTP verification successful
- ✅ Response has JWT token

## 🔍 Error Case Testing

The collection includes comprehensive error testing:

### **Signup Error Cases:**
- ❌ **Duplicate Email** - Try registering same email twice
- ❌ **Password Mismatch** - Different password/confirmPassword
- ❌ **Short Password** - Password less than 8 characters

### **Login Error Cases:**
- ❌ **Wrong Password** - Incorrect password for valid user
- ❌ **Non-existent User** - Login with unregistered email

### **OTP Error Cases:**
- ❌ **Wrong OTP Code** - Invalid 6-digit code

## 🍎 Apple ID Authentication

**Test:** Apple ID Login
**Note:** Requires valid Apple identity token and authorization code
**Update variables:** `appleIdentityToken` and `appleAuthCode`

## 📊 Running Tests

### **Individual Request Testing:**
1. Click on any request in the collection
2. Click **"Send"**
3. View **"Test Results"** tab for automated test results
4. Check **"Console"** for detailed logs

### **Collection Runner (Recommended):**
1. Click **"Runner"** button (top right)
2. Select your collection
3. Choose requests to run
4. Click **"Start Run"**
5. View comprehensive test results

### **Newman (Command Line):**
```bash
# Install Newman
npm install -g newman

# Run collection
newman run postman_collection.json

# Run with environment
newman run postman_collection.json -e environment.json
```

## 🔧 Troubleshooting

### **Backend Not Responding:**
```bash
# Check if backend is running
curl -X GET http://localhost:8082/actuator/health

# Start backend if needed
cd Backend/mobileappdemo/mobileappdemo
mvn spring-boot:run
```

### **Database Issues:**
- Ensure MySQL is running on localhost:3306
- Verify database `auth_db` exists
- Check credentials in `application.properties`

### **Email Issues:**
- Verify Gmail SMTP settings
- Check app password in `application.properties`
- Ensure email account allows less secure apps

### **CORS Issues:**
- Backend has `@CrossOrigin` configured
- Check browser console for CORS errors

## 📈 Test Results Interpretation

### **Passing Tests (✅):**
- All automated tests pass
- Expected responses received
- No errors in console

### **Failing Tests (❌):**
- Check response status codes
- Verify request body format
- Review error messages
- Check backend logs

### **Common Issues:**
- **404 Not Found:** Check endpoint URLs
- **400 Bad Request:** Verify request body format
- **500 Internal Error:** Check backend logs
- **CORS Errors:** Verify CORS configuration

## 🎯 Best Practices

1. **Test Order:** Always run Health Check first
2. **Data Cleanup:** Use different emails for repeated testing
3. **OTP Management:** Update `otpCode` variable with actual OTP
4. **Error Testing:** Run error cases to verify proper validation
5. **Documentation:** Keep test results for reference

## 🚀 Quick Start Checklist

- [ ] Import Postman collection
- [ ] Verify backend is running on port 8082
- [ ] Run Health Check
- [ ] Test Email Signup
- [ ] Test Email Login
- [ ] Check email for OTP
- [ ] Update `otpCode` variable
- [ ] Test OTP Verification
- [ ] Test Error Cases
- [ ] Review all test results

## 📞 Support

If you encounter issues:
1. Check backend logs for errors
2. Verify database connection
3. Test endpoints manually with curl
4. Review Postman console for detailed error messages

Your Postman collection is now ready for comprehensive API testing! 🎉 