CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "account" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" serial PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"user_id" integer NOT NULL,
	"impersonated_by" integer,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" text,
	"last_sign_in_at" timestamp with time zone,
	"polar_customer_id" uuid,
	"role" "user_roles" DEFAULT 'user',
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deactivated_at" timestamp with time zone,
	CONSTRAINT "user_polarCustomerId_unique" UNIQUE("polar_customer_id")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "polar_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"polar_id" text NOT NULL,
	"polar_created_at" timestamp with time zone NOT NULL,
	"polar_modified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"subscription_id" integer,
	"status" text NOT NULL,
	"paid" boolean DEFAULT false NOT NULL,
	"billing_reason" text NOT NULL,
	"subtotal_amount" integer NOT NULL,
	"discount_amount" integer NOT NULL,
	"net_amount" integer NOT NULL,
	"tax_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"applied_balance_amount" integer NOT NULL,
	"due_amount" integer NOT NULL,
	"refunded_amount" integer NOT NULL,
	"refunded_tax_amount" integer NOT NULL,
	"platform_fee_amount" integer NOT NULL,
	"currency" text NOT NULL,
	"billing_name" text,
	"billing_address" jsonb,
	"invoice_number" text NOT NULL,
	"is_invoice_generated" boolean DEFAULT false NOT NULL,
	"polar_customer_id" text NOT NULL,
	"polar_product_id" text NOT NULL,
	"polar_subscription_id" text,
	"polar_discount_id" text,
	"polar_checkout_id" text,
	"seats" integer,
	"description" text NOT NULL,
	"items" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"discount" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"custom_field_data" jsonb,
	CONSTRAINT "polar_order_polarId_unique" UNIQUE("polar_id")
);
--> statement-breakpoint
CREATE TABLE "polar_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"polar_id" text NOT NULL,
	"polar_created_at" timestamp with time zone NOT NULL,
	"polar_modified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"trial_interval" text,
	"trial_interval_count" integer,
	"name" text NOT NULL,
	"description" text,
	"recurring_interval" text,
	"recurring_interval_count" integer,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"organization_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"medias" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"prices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "polar_product_polarId_unique" UNIQUE("polar_id")
);
--> statement-breakpoint
CREATE TABLE "polar_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"polar_id" text NOT NULL,
	"polar_created_at" timestamp with time zone NOT NULL,
	"polar_modified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"status" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"recurring_interval" text NOT NULL,
	"recurring_interval_count" integer NOT NULL,
	"current_period_start" timestamp with time zone NOT NULL,
	"current_period_end" timestamp with time zone,
	"trial_start" timestamp with time zone,
	"trial_end" timestamp with time zone,
	"started_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"canceled_at" timestamp with time zone,
	"customer_cancellation_reason" text,
	"customer_cancellation_comment" text,
	"polar_customer_id" text NOT NULL,
	"polar_product_id" text NOT NULL,
	"polar_discount_id" text,
	"polar_checkout_id" text,
	"seats" integer,
	"prices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"meters" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"discount" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"custom_field_data" jsonb,
	CONSTRAINT "polar_subscription_polarId_unique" UNIQUE("polar_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_impersonated_by_user_id_fk" FOREIGN KEY ("impersonated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_order" ADD CONSTRAINT "polar_order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_order" ADD CONSTRAINT "polar_order_product_id_polar_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."polar_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_order" ADD CONSTRAINT "polar_order_subscription_id_polar_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."polar_subscription"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_subscription" ADD CONSTRAINT "polar_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polar_subscription" ADD CONSTRAINT "polar_subscription_product_id_polar_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."polar_product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "user" USING btree (lower("email"));