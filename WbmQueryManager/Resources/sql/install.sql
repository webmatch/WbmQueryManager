CREATE TABLE IF NOT EXISTS `wbm_query_manager` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sql_string` longtext NOT NULL,
  `has_cronjob` BOOLEAN DEFAULT '0',
  `next_run` DATETIME DEFAULT NULL,
  `last_run` DATETIME DEFAULT NULL,
  `interval_int` INT(11) DEFAULT '0',
  `last_log` MEDIUMTEXT DEFAULT NULL,
  `clear_cache` BOOLEAN DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT IGNORE INTO `wbm_query_manager` (`id`, `name`, `sql_string`, `has_cronjob`, `next_run`, `last_run`, `interval_int`, `last_log`, `clear_cache`) VALUES
  (1, 'Zufällige Artikelbewertung generieren', '/*\nSchreibt je eine Bewertung pro Artikel mit zufälliger \nAnzahl an Sternen. Dummy-Werte zur Vorschau von Bewertungen\nin der Entwicklungsphase.\n*/\n\nINSERT INTO `s_articles_vote` (`articleID`, `name`, `headline`, `comment`, `points`, `datum`, `active`, `email`, `answer`, `answer_date`) \nSELECT `id`, ''test'', ''test'', ''test'', FLOOR(1 + (RAND() * 5)), ''2016-04-06 00:00:00'', ''1'', ''test@test.test'', '''', ''''\nFROM s_articles;', 0, NULL, NULL, 0, '', 0),
  (2, 'SEO URLs mit und ohne abschließendem Slash schreiben', '/*\nSchreibt für alle bestehenden SEO-URLs ein Alias ohne bzw mit\nabschließendem Slash, je nachdem ob das Original mit Slash endet\noder nicht.\n*/\n\nINSERT IGNORE INTO `s_core_rewrite_urls` (`org_path`, `path`, `main`, `subshopID`)\nSELECT `org_path`, CONCAT(path, ''/''), 0, `subshopID` FROM `s_core_rewrite_urls` WHERE `path` NOT LIKE ''%/'';\n\nINSERT IGNORE INTO `s_core_rewrite_urls` (`org_path`, `path`, `main`, `subshopID`)\nSELECT `org_path`, TRIM(TRAILING ''/'' FROM `path`), 0, `subshopID` FROM `s_core_rewrite_urls` WHERE `path` LIKE ''%/'';', 0, NULL, NULL, 0, '', 0),
  (3, 'Kategorien ohne Artikel deaktivieren', '/*\nDeaktiviert alle Waren-Kategorien (nicht Blog-Kategorien),\ndenen keine Artikel zugeordnet sind.\n*/\n\nUPDATE `s_categories`\nSET `active` = 0\nWHERE `id` NOT IN (SELECT `categoryID` FROM `s_articles_categories_ro`)\nAND `blog` = 0 AND `id` > 1;', 0, NULL, NULL, 0, '', 0),
  (4, 'Vorkasse-Bestellungen stornieren', '/* \nFrist in Tagen \n*/\n\nSET @deadline=20;\n\n/* \nVorkasse-Bestellungen mit Zahlungsstatus "Offen"\nwerden nach Ablauf der Frist auf den Bestellstatus\n"Storniert / Abgelehnt" gesetzt.\n*/\n\nUPDATE `s_order` \nSET `status` = 4\nWHERE `cleared` = 17 \nAND `ordertime` < (NOW() - INTERVAL @deadline DAY) \nAND `paymentID` = 5;', 0, NULL, NULL, 0, '', 0);

INSERT IGNORE INTO `s_crontab` (`name`, `action`, `elementID`, `data`, `next`, `start`, `interval`, `active`, `disable_on_error`, `end`, `inform_template`, `inform_mail`, `pluginID`) VALUES
  ('Query Manager', 'WbmQueryManagerCron', NULL, '', NOW(), NULL, 1, 1, 1, NOW(), '', '', null);