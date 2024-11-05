DO $$ BEGIN
 CREATE TYPE "public"."GROUP_PRIVACY" AS ENUM('PUBLIC', 'PRIVATE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Affiliate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"groupId" uuid,
	CONSTRAINT "Affiliate_groupId_unique" UNIQUE("groupId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Channel" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"icon" varchar(255),
	"groupId" uuid,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Comment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"content" text,
	"postId" uuid,
	"userId" uuid,
	"replied" boolean DEFAULT false,
	"commentId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Course" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"thumbnail" varchar(255),
	"published" boolean DEFAULT false,
	"privacy" varchar(255),
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"groupId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"category" varchar(255),
	"thumbnail" varchar(255),
	"description" text,
	"gallery" jsonb[],
	"jsonDescription" jsonb,
	"htmlDescription" text,
	"icon" varchar(255),
	"privacy" "GROUP_PRIVACY" DEFAULT 'PRIVATE',
	"active" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"userId" uuid,
	"domain" varchar(255),
	CONSTRAINT "Group_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"groupId" uuid,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Message" (
	"id" uuid PRIMARY KEY NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now(),
	"senderid" uuid,
	"recieverId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"title" varchar(255),
	"content" text,
	"authorId" uuid,
	"channelId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"price" integer,
	"active" boolean DEFAULT false,
	"groupId" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstname" varchar(255),
	"lastname" varchar(255),
	"createdAt" timestamp DEFAULT now(),
	"clerkId" varchar(255),
	"image" varchar(255),
	"stripeId" varchar(255),
	CONSTRAINT "User_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_groupId_Group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Channel" ADD CONSTRAINT "Channel_groupId_Group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_Post_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_Comment_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Course" ADD CONSTRAINT "Course_groupId_Group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Members" ADD CONSTRAINT "Members_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Members" ADD CONSTRAINT "Members_groupId_Group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Message" ADD CONSTRAINT "Message_senderid_User_id_fk" FOREIGN KEY ("senderid") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_User_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_channelId_Channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."Channel"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_groupId_Group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_group_id" ON "Members" USING btree ("userId","groupId");