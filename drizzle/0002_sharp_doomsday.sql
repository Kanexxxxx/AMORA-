ALTER TABLE `orders` ADD `customerName` varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `customerEmail` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `customerPhone` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `shippingAddress` text NOT NULL;