-- Modify the role enum to include disnaker role
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'user', 'disnaker') NOT NULL;
