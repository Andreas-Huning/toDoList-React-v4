-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 28. Feb 2024 um 09:43
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `todo`
--
CREATE DATABASE IF NOT EXISTS `todo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `todo`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todocat`
--

DROP TABLE IF EXISTS `todocat`;
CREATE TABLE `todocat` (
  `toDoCatId` int(11) NOT NULL,
  `toDoCatName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `todocat`
--

INSERT INTO `todocat` (`toDoCatId`, `toDoCatName`) VALUES
(1, 'Alle'),
(2, 'in Bearbeitung'),
(3, 'Erledigt');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todolist`
--

DROP TABLE IF EXISTS `todolist`;
CREATE TABLE `todolist` (
  `toDoListId` int(11) NOT NULL,
  `toDoListName` varchar(255) NOT NULL,
  `toDoListStatus` int(11) DEFAULT 0,
  `toDoListDate` datetime DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `toDoCatId` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `userToken` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`userId`, `userEmail`, `userPassword`, `userToken`) VALUES
(1, 'admin@admin.de', '$2y$10$e6guebrB1/1.XoZkrAjpg.2hPRAlF3z8yAF6/ulNI97lq3/b2MfhO', NULL);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `todocat`
--
ALTER TABLE `todocat`
  ADD PRIMARY KEY (`toDoCatId`);

--
-- Indizes für die Tabelle `todolist`
--
ALTER TABLE `todolist`
  ADD PRIMARY KEY (`toDoListId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `toDoCatId` (`toDoCatId`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `todocat`
--
ALTER TABLE `todocat`
  MODIFY `toDoCatId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `todolist`
--
ALTER TABLE `todolist`
  MODIFY `toDoListId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `todolist`
--
ALTER TABLE `todolist`
  ADD CONSTRAINT `todolist_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `todolist_ibfk_2` FOREIGN KEY (`toDoCatId`) REFERENCES `todocat` (`toDoCatId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
