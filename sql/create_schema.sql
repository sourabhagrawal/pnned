DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) NOT NULL,
  `strategy` varchar(128) NOT NULL,
  `identifier` varchar(1024) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `notes`;
CREATE TABLE `notes` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `date` datetime NOT NULL,
  `body` text NOT NULL,
  `word_count` int NOT NULL DEFAULT 0,
  `orality` int NOT NULL DEFAULT 0,
	`anality` int NOT NULL DEFAULT 0,
	`sex` int NOT NULL DEFAULT 0,
	`touch` int NOT NULL DEFAULT 0,
	`taste` int NOT NULL DEFAULT 0,
	`odor` int NOT NULL DEFAULT 0,
	`gen_sensation` int NOT NULL DEFAULT 0,
	`sound` int NOT NULL DEFAULT 0,
	`vision` int NOT NULL DEFAULT 0,
	`cold` int NOT NULL DEFAULT 0,
	`hard` int NOT NULL DEFAULT 0,
	`soft` int NOT NULL DEFAULT 0,
	`passivity` int NOT NULL DEFAULT 0,
	`voyage` int NOT NULL DEFAULT 0,
	`random_movement` int NOT NULL DEFAULT 0,
	`diffusion` int NOT NULL DEFAULT 0,
	`chaos` int NOT NULL DEFAULT 0,
	`unknow` int NOT NULL DEFAULT 0,
	`timelessnes` int NOT NULL DEFAULT 0,
	`counscious` int NOT NULL DEFAULT 0,
	`brink_passage` int NOT NULL DEFAULT 0,
	`narcissism` int NOT NULL DEFAULT 0,
	`concreteness` int NOT NULL DEFAULT 0,
	`ascend` int NOT NULL DEFAULT 0,
	`height` int NOT NULL DEFAULT 0,
	`descent` int NOT NULL DEFAULT 0,
	`depth` int NOT NULL DEFAULT 0,
	`fire` int NOT NULL DEFAULT 0,
	`water` int NOT NULL DEFAULT 0,
	`abstract_thought` int NOT NULL DEFAULT 0,
	`social_behavior` int NOT NULL DEFAULT 0,
	`instru_behavior` int NOT NULL DEFAULT 0,
	`restraint` int NOT NULL DEFAULT 0,
	`order` int NOT NULL DEFAULT 0,
	`temporal_repere` int NOT NULL DEFAULT 0,
	`moral_imperative` int NOT NULL DEFAULT 0,
	`positive_affect` int NOT NULL DEFAULT 0,
	`anxiety` int NOT NULL DEFAULT 0,
	`sadness` int NOT NULL DEFAULT 0,
	`affection` int NOT NULL DEFAULT 0,
	`aggression` int NOT NULL DEFAULT 0,
	`expressive_beh` int NOT NULL DEFAULT 0,
	`glory` int NOT NULL DEFAULT 0,
	`shared` int NOT NULL DEFAULT 0
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;