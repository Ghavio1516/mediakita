-- --------------------------------------------------------
-- Host:                         103.127.139.133
-- Server version:               10.11.8-MariaDB-0ubuntu0.24.04.1 - Ubuntu 24.04
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for news
CREATE DATABASE IF NOT EXISTS `news` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `news`;

-- Dumping structure for table news.news
CREATE TABLE IF NOT EXISTS `news` (
  `id` varchar(191) NOT NULL,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `thumbnail` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table news.news: ~1 rows (approximately)
INSERT INTO `news` (`id`, `title`, `content`, `thumbnail`, `createdAt`) VALUES
	('cm7ncqzth0002dex8gl5a87wg', 'Gene Hackman and his wife found dead at their home', 'Oscar-winning US actor Gene Hackman, his wife Betsy Arakawa and their dog have been found dead at their home in Santa Fe, New Mexico.  In a career spanning more than six decades, Hackman received two Academy Awards for his work on the movies The French Connection and Unforgiven.  A statement from the Santa Fe County Sheriff in New Mexico said: "We can confirm that both Gene Hackman and his wife were found deceased Wednesday afternoon at their residence on Sunset Trail.', 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/b254/live/46cfaba0-f4f3-11ef-8c03-7dfdbeeb2526.jpg.webp', '2025-02-27 13:00:23.381');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
