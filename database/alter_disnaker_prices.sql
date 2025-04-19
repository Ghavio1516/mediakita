-- Backup the original table structure and data
CREATE TABLE disnaker_items_backup LIKE disnaker_items;
INSERT INTO disnaker_items_backup SELECT * FROM disnaker_items;

-- Rename existing price column to selling_price and add buying_price column
ALTER TABLE disnaker_items 
CHANGE COLUMN price selling_price decimal(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN buying_price decimal(10,2) NOT NULL DEFAULT 0.00 AFTER selling_price;

-- Set initial buying_price values (80% of selling_price)
UPDATE disnaker_items 
SET buying_price = selling_price * 0.8 
WHERE isActive = 1;

-- Add indexes for better query performance
ALTER TABLE disnaker_items
ADD INDEX idx_prices (selling_price, buying_price);

-- Verify the changes
SELECT 
    id,
    name,
    selling_price,
    buying_price,
    unit,
    status
FROM disnaker_items
WHERE isActive = 1
ORDER BY categoryId, name;

-- In case you need to rollback, use these commands:
-- DROP TABLE IF EXISTS disnaker_items;
-- RENAME TABLE disnaker_items_backup TO disnaker_items; 