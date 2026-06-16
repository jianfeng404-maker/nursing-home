CREATE TABLE "clinical_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"elder_id" text NOT NULL,
	"elder_name" text NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	"doctor" text NOT NULL,
	"type" text NOT NULL,
	"notes" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"warehouse" text NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"unit" text NOT NULL,
	"safe_stock" integer DEFAULT 10 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rehab_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"elder_id" text NOT NULL,
	"elder_name" text NOT NULL,
	"description" text NOT NULL,
	"therapist" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text DEFAULT '用户' NOT NULL,
	"role" text DEFAULT 'employee' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
