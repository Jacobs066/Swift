# Flyway Database Migrations

This project uses Flyway for database schema management and version control.

## Overview

Flyway automatically manages database schema changes by applying migration scripts in order. Each migration is versioned and tracked in the `flyway_schema_history` table.

## Migration Files

### V1__init.sql
- Creates the initial database schema
- Includes all main tables: `users`, `otp_entry`, `wallets`, `transactions`, `exchange_rates`
- Adds performance indexes
- Inserts initial exchange rate data

### V2__add_audit_fields.sql
- Adds audit fields to existing tables
- Adds data integrity constraints
- Improves indexing for better performance

## Configuration

The Flyway configuration is in `application.properties`:

```properties
# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
spring.flyway.validate-on-migrate=true

# JPA Configuration (set to validate when using Flyway)
spring.jpa.hibernate.ddl-auto=validate
```

## Migration Naming Convention

Migration files must follow this naming pattern:
```
V<version>__<description>.sql
```

Examples:
- `V1__init.sql`
- `V2__add_audit_fields.sql`
- `V3__add_user_roles.sql`

## How It Works

1. **Application Startup**: Flyway automatically runs on application startup
2. **Version Tracking**: Each migration is tracked in `flyway_schema_history` table
3. **Ordered Execution**: Migrations run in version order (V1, V2, V3, etc.)
4. **One-Time Execution**: Each migration runs only once per database

## Adding New Migrations

1. Create a new SQL file in `src/main/resources/db/migration/`
2. Use the next version number (e.g., `V3__add_new_feature.sql`)
3. Write your SQL statements
4. Restart the application

## Important Notes

- **Never modify existing migration files** - they are immutable once applied
- **Always test migrations** on a copy of production data
- **Backup your database** before running migrations in production
- **Use transactions** in your migration scripts when possible

## Database Schema

### Users Table
- `id`: Primary key
- `email_or_phone`: Unique identifier
- `username`: Unique username
- `password`: Encrypted password
- `email`: Email address
- `phone`: Phone number
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp
- `is_active`: Account status
- `last_login_at`: Last login timestamp

### Wallets Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `currency`: Currency type (GHS, USD, GBP, EUR)
- `balance`: Current balance
- `is_primary`: Primary wallet flag
- `created_at`: Wallet creation timestamp
- `updated_at`: Last update timestamp

### Transactions Table
- `id`: Primary key
- `wallet_id`: Foreign key to wallets
- `type`: Transaction type
- `amount`: Transaction amount
- `currency`: Transaction currency
- `exchange_rate`: Exchange rate used
- `converted_amount`: Converted amount
- `converted_currency`: Target currency
- `description`: Transaction description
- `reference`: Transaction reference
- `status`: Transaction status
- `created_at`: Transaction timestamp
- `updated_at`: Last update timestamp

### Exchange Rates Table
- `id`: Primary key
- `from_currency`: Source currency
- `to_currency`: Target currency
- `rate`: Exchange rate
- `created_at`: Rate creation timestamp
- `expires_at`: Rate expiration timestamp

## Troubleshooting

### Common Issues

1. **Migration fails**: Check the `flyway_schema_history` table for failed migrations
2. **Version conflicts**: Ensure migration versions are sequential
3. **SQL errors**: Validate SQL syntax before running migrations

### Useful Commands

```sql
-- Check migration history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- Check current schema version
SELECT version FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 1;
```

## Best Practices

1. **Keep migrations small and focused**
2. **Use descriptive names** for migration files
3. **Test migrations thoroughly** before deployment
4. **Document complex migrations** with comments
5. **Use transactions** for data consistency
6. **Backup before running** in production environments 