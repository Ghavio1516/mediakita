-- Create live_streams table
CREATE TABLE `live_streams` (
  `id` varchar(191) NOT NULL,
  `youtube_url` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial empty stream
INSERT INTO `live_streams` (`id`, `youtube_url`, `title`, `is_active`) 
VALUES ('stream_1', '', 'Default Stream', 0); 