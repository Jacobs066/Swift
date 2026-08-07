-- Migration: V5__add_notifications.sql
-- Add notifications table (transactional + security/account events)
-- Note: not yet applied by Flyway (spring.flyway.enabled=false) - schema is
-- currently managed by Hibernate ddl-auto=update. Kept here so migration
-- history stays accurate for whenever Flyway is re-enabled.

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

ALTER TABLE notifications
ADD CONSTRAINT chk_notification_type_valid CHECK (type IN (
    'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'SEND', 'CURRENCY_EXCHANGE',
    'SIGNUP', 'LOGIN', 'PASSWORD_CHANGE', 'SECURITY_ALERT'
));
