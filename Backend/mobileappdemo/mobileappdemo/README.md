# Swift Wallet API

A comprehensive multi-currency wallet system built with Spring Boot, featuring authentication, transactions, and exchange rate management.

## 🚀 Features

- **Multi-Currency Support**: GHS, USD, GBP, EUR
- **User Authentication**: Signup, Login with OTP verification
- **Wallet Management**: Create, view, and manage multiple wallets
- **Money Transfers**: Transfer between wallets with currency conversion
- **Transaction History**: Comprehensive transaction tracking and filtering
- **Exchange Rates**: Real-time currency conversion rates
- **Payment Integration**: Paystack payment gateway integration
- **Database Migrations**: Flyway for schema version control
- **CORS Enabled**: Ready for frontend integration

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Redis (optional, for caching)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend/mobileappdemo/mobileappdemo
   ```

2. **Configure Database**
   - Create MySQL database: `auth_db`
   - Update `application.properties` with your database credentials

3. **Configure Email (for OTP)**
   - Update email settings in `application.properties`
   - Configure SMTP server details

4. **Configure API Keys (Optional)**
   - Add Paystack API keys for payment functionality
   - Add Exchange Rate API key for live rates

5. **Run the Application**
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8082`

## 📚 Documentation

### API Documentation
- **[Complete API Reference](API_DOCUMENTATION.md)** - All endpoints with examples
- **[API Testing Guide](API_TESTING_GUIDE.md)** - How to test the APIs
- **[Database Migrations](FLYWAY_README.md)** - Flyway setup and usage

### Frontend Examples
Check the `Frontend/` directory for HTML test pages:
- `test_api.html` - Basic API testing
- `test_transactions.html` - Transaction testing
- `wallet.html` - Wallet management interface
- `transaction_demo.html` - Transaction history demo

## 🔧 Configuration

### Database Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/auth_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Email Configuration
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

### API Keys
```properties
paystack.secret.key=your_paystack_secret_key
paystack.public.key=your_paystack_public_key
exchange.rate.api.key=your_exchange_rate_api_key
```

## 🏗️ Project Structure

```
src/main/java/com/swift/
├── auth/
│   ├── controller/     # Authentication endpoints
│   ├── dto/           # Request/Response DTOs
│   ├── models/        # User and OTP entities
│   ├── repository/    # Data access layer
│   └── service/       # Business logic
├── wallet/
│   ├── controller/    # Wallet and transaction endpoints
│   ├── dto/          # Wallet DTOs
│   ├── enums/        # Currency and transaction types
│   ├── models/       # Wallet and transaction entities
│   ├── repository/   # Data access layer
│   ├── service/      # Business logic
│   └── config/       # Paystack configuration
└── mobileappdemo/
    └── config/       # CORS and security configuration
```

## 🔐 Authentication Flow

1. **Signup**: Create account with email/phone and username
2. **Login**: Provide credentials to receive OTP
3. **OTP Verification**: Complete login with 6-digit code

## 💰 Wallet Operations

- **Create Wallets**: Automatic wallet creation for each currency
- **View Balances**: Check balance for any currency
- **Transfer Money**: Move funds between wallets
- **Currency Conversion**: Automatic conversion using live rates

## 📊 Transaction Features

- **Transaction History**: View all transactions with pagination
- **Advanced Filtering**: Filter by type, status, date range
- **Transaction Summary**: Statistics and analytics
- **Export Functionality**: CSV export of transaction history
- **Real-time Status**: Track transaction status updates

## 🧪 Testing

### Quick Test
```bash
# Start the application
mvn spring-boot:run

# Test signup
curl -X POST http://localhost:8082/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Comprehensive Testing
See [API Testing Guide](API_TESTING_GUIDE.md) for detailed testing instructions.

## 🚀 Deployment

### Development
```bash
mvn spring-boot:run
```

### Production
```bash
mvn clean package
java -jar target/mobileappdemo-0.0.1-SNAPSHOT.jar
```

### Docker (Optional)
```bash
docker build -t swift-wallet .
docker run -p 8082:8082 swift-wallet
```

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:8082/actuator/health
```

### Application Metrics
- Available at `/actuator/metrics`
- Database connection status
- Application uptime
- Request statistics

## 🛡️ Security

- **CORS Configuration**: Configured for cross-origin requests
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: JPA/Hibernate protection
- **XSS Protection**: Spring Security defaults

## 🔄 Database Migrations

The application uses Flyway for database schema management:

- **Automatic Migration**: Runs on application startup
- **Version Control**: Each change is versioned
- **Rollback Support**: Database state tracking
- **Production Ready**: Safe for production deployments

See [Flyway Documentation](FLYWAY_README.md) for details.

## 📈 Performance

### Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large dataset handling
- **Caching**: Exchange rate caching (30 minutes)
- **Connection Pooling**: HikariCP for database connections

### Monitoring
- **Response Times**: Track API performance
- **Database Queries**: Monitor query performance
- **Memory Usage**: JVM metrics monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Common Issues

1. **Database Connection**
   - Verify MySQL is running
   - Check credentials in `application.properties`
   - Ensure database exists

2. **Email Not Working**
   - Check SMTP configuration
   - Verify email credentials
   - Test with a simple email client

3. **CORS Issues**
   - CORS is configured for all origins
   - Check browser console for errors
   - Verify frontend URL

### Getting Help

- Check the [API Documentation](API_DOCUMENTATION.md)
- Review the [Testing Guide](API_TESTING_GUIDE.md)
- Check application logs for errors
- Verify configuration settings

## 🔮 Roadmap

- [ ] JWT Authentication
- [ ] WebSocket for real-time updates
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Biometric authentication
- [ ] Blockchain integration

## 📊 API Statistics

- **Total Endpoints**: 25+
- **Authentication**: 3 endpoints
- **Wallet Management**: 6 endpoints
- **Transaction Management**: 11 endpoints
- **Payment Integration**: 2 endpoints
- **Exchange Rates**: 1 endpoint

## 🎯 Quick Start Checklist

- [ ] Install Java 17+
- [ ] Install Maven
- [ ] Setup MySQL database
- [ ] Configure `application.properties`
- [ ] Run `mvn spring-boot:run`
- [ ] Test signup endpoint
- [ ] Test login and OTP
- [ ] Create test wallets
- [ ] Make test transfers
- [ ] View transaction history

---

**Happy Coding! 🚀** 