-- Create categories table for Disnaker
CREATE TABLE `disnaker_categories` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create items table for Disnaker
CREATE TABLE `disnaker_items` (
  `id` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit` varchar(50) NOT NULL,
  `status` enum('available','limited','unavailable') NOT NULL DEFAULT 'available',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `disnaker_items_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `disnaker_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample categories
INSERT INTO `disnaker_categories` (`id`, `name`, `slug`) VALUES
('cat_1', 'Peternakan', 'peternakan'),
('cat_2', 'Pertanian', 'pertanian'),
('cat_3', 'Hasil Hutan', 'hasil-hutan'),
('cat_4', 'Hasil Menjahit', 'hasil-menjahit'),
('cat_5', 'Pertambangan', 'pertambangan'),
('cat_6', 'Daur Ulang', 'daur-ulang');

-- Insert sample items
INSERT INTO `disnaker_items` (`id`, `categoryId`, `name`, `price`, `unit`, `status`) VALUES
-- Peternakan
('item_1', 'cat_1', 'Bulu Ayam', 300.00, '1 pcs', 'available'),
('item_2', 'cat_1', 'Telur Ayam', 300.00, '1 Pcs', 'available'),
('item_3', 'cat_1', 'Susu', 100.00, '1 Botol', 'available'),
('item_4', 'cat_1', 'Kemasan Ayam', 500.00, '1 Pcs', 'available'),
('item_5', 'cat_1', 'Kemasan Sapi', 500.00, '1 Pcs', 'available'),
('item_6', 'cat_1', 'Kulit', 900.00, '1 Pcs', 'available'),
('item_7', 'cat_1', 'Ikan', 0.00, '1 Pcs', 'unavailable'),

-- Pertanian
('item_8', 'cat_2', 'Kemasan Beras', 2800.00, '1 Karung', 'available'),
('item_9', 'cat_2', 'Kemasan Cabe', 2800.00, '1 Karung', 'available'),
('item_10', 'cat_2', 'Kemasan Kentang', 2800.00, '1 Karung', 'available'),
('item_11', 'cat_2', 'Kemasan Strawberry', 2800.00, '1 Karung', 'available'),
('item_12', 'cat_2', 'Kemasan Jeruk', 2800.00, '1 Karung', 'available'),
('item_13', 'cat_2', 'Kemasan Teh', 2800.00, '1 Karung', 'available'),
('item_14', 'cat_2', 'Kemasan Kopi', 2800.00, '1 Karung', 'available'),
('item_15', 'cat_2', 'Kemasan Anggur', 2800.00, '1 Karung', 'available'),

-- Hasil Hutan
('item_16', 'cat_3', 'Potongan Kayu', 250.00, '1 Pcs', 'available'),
('item_17', 'cat_3', 'Serbuk Kayu', 25.00, '1 Pcs', 'available'),

-- Hasil Menjahit
('item_18', 'cat_4', 'Pakaian', 1000.00, '1 Pcs', 'available'),

-- Pertambangan
('item_19', 'cat_5', 'Tembaga', 250.00, '1 Pcs', 'available'),
('item_20', 'cat_5', 'Besi', 100.00, '1 Pcs', 'limited'),
('item_21', 'cat_5', 'Emas', 250.00, '1 Pcs', 'available'),
('item_22', 'cat_5', 'Berlian', 100.00, '1 Pcs', 'limited'),
('item_23', 'cat_5', 'Kristal', 250.00, '1 Pcs', 'available'),

-- Daur Ulang
('item_24', 'cat_6', 'Besi Tua', 350.00, '1 Pcs', 'available'),
('item_25', 'cat_6', 'Kaca', 350.00, '1 Pcs', 'available'),
('item_26', 'cat_6', 'Karet', 350.00, '1 Pcs', 'available'),
('item_27', 'cat_6', 'Botol', 350.00, '1 Pcs', 'available'),
('item_28', 'cat_6', 'Baja', 350.00, '1 Pcs', 'available'); 