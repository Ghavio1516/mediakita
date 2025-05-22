-- Add JSON column for list of images
ALTER TABLE portfolio
    ADD COLUMN media_list JSON AFTER media_url; 