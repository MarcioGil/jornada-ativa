CREATE TABLE `accessibilityScans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`location` varchar(255) NOT NULL,
	`imageUrl` text,
	`barriersIdentified` text,
	`suggestedSolutions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accessibilityScans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `caseDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`documentType` varchar(64) NOT NULL,
	`documentUrl` text NOT NULL,
	`extractedData` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caseDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`approved` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `communityComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `communityPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`category` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`approved` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communityPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exerciseLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`duration` int,
	`postureFeedback` text,
	`completed` int DEFAULT 0,
	`loggedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exerciseLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`diagnosis` text NOT NULL,
	`exercisePlan` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legalCases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`caseTitle` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','submitted','received','analyzing','resolved') DEFAULT 'draft',
	`protocolNumber` varchar(64),
	`defensoryState` varchar(2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `legalCases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `painDiary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`painLevel` int NOT NULL,
	`moodLevel` int NOT NULL,
	`medication` text,
	`notes` text,
	`loggedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `painDiary_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accessibilityScans` ADD CONSTRAINT `accessibilityScans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseDocuments` ADD CONSTRAINT `caseDocuments_caseId_legalCases_id_fk` FOREIGN KEY (`caseId`) REFERENCES `legalCases`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityComments` ADD CONSTRAINT `communityComments_postId_communityPosts_id_fk` FOREIGN KEY (`postId`) REFERENCES `communityPosts`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityComments` ADD CONSTRAINT `communityComments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `communityPosts` ADD CONSTRAINT `communityPosts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exerciseLogs` ADD CONSTRAINT `exerciseLogs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exerciseLogs` ADD CONSTRAINT `exerciseLogs_exerciseId_exercises_id_fk` FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exercises` ADD CONSTRAINT `exercises_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `legalCases` ADD CONSTRAINT `legalCases_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `painDiary` ADD CONSTRAINT `painDiary_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;