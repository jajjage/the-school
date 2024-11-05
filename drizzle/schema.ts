import { sql } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

// Enums
export const groupPrivacyEnum = pgEnum("GROUP_PRIVACY", ["PUBLIC", "PRIVATE"])
// Tables
export const users = pgTable("User", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  firstname: varchar("firstname", { length: 255 }),
  lastname: varchar("lastname", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  clerkId: varchar("clerkId", { length: 255 }).unique(),
  image: varchar("image", { length: 255 }),
  stripeId: varchar("stripeId", { length: 255 }),
})

export const groups = pgTable("Group", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).unique(),
  category: varchar("category", { length: 255 }),
  thumbnail: varchar("thumbnail", { length: 255 }),
  description: text("description"),
  gallery: jsonb("gallery").array(),
  jsonDescription: jsonb("jsonDescription"),
  htmlDescription: text("htmlDescription"),
  icon: varchar("icon", { length: 255 }),
  privacy: groupPrivacyEnum("privacy").default("PRIVATE"),
  active: boolean("active").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  domain: varchar("domain", { length: 255 }),
})

// Subscription table
export const subscriptions = pgTable("Subscription", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  price: integer("price"),
  active: boolean("active").default(false),
  groupId: uuid("groupId").references(() => groups.id, { onDelete: "cascade" }),
})

// Members table
export const members = pgTable(
  "Members",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    userId: uuid("userId").references(() => users.id),
    groupId: uuid("groupId").references(() => groups.id),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    // Create a unique index on userId and groupId
    uniqueIndex: uniqueIndex("unique_user_group_id").on(
      table.userId,
      table.groupId,
    ),
  }),
)

// Post table
export const posts = pgTable("Post", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  authorId: uuid("authorId").references(() => users.id, {
    onDelete: "cascade",
  }),
  channelId: uuid("channelId").references(() => channels.id, {
    onDelete: "cascade",
  }),
})

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  postId: uuid("postId").references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
})

// Comment table with self-relation
export const comments = pgTable("Comment", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow(),
  content: text("content"),
  postId: uuid("postId").references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("userId").references(() => users.id, { onDelete: "cascade" }),
  replied: boolean("replied").default(false),
  commentId: uuid("commentId").references((): any => comments.id, {
    onDelete: "cascade",
  }),
})

// Infer the type from the schema
// export type Comment = InferModel<typeof comments>;

// Channel table
export const channels = pgTable("Channel", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  icon: varchar("icon", { length: 255 }),
  groupId: uuid("groupId").references(() => groups.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
})

export const modules = pgTable("modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("courseId").references(() => courses.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
})

export const sections = pgTable("sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).default("New Section"),
  icon: varchar("icon", { length: 255 }).default("doc"),
  complete: boolean("complete").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  moduleId: uuid("moduleId").references(() => modules.id, {
    onDelete: "cascade",
  }),
})

// Course table
export const courses = pgTable("Course", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  thumbnail: varchar("thumbnail", { length: 255 }),
  published: boolean("published").default(false),
  privacy: varchar("privacy", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  groupId: uuid("groupId").references(() => groups.id, { onDelete: "cascade" }),
})

// Affiliate table
export const affiliates = pgTable("Affiliate", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  groupId: uuid("groupId")
    .unique()
    .references(() => groups.id),
  // ... other fields as needed
})

// export const affiliateGroupIdIndex = uniqueIndex("affiliate_group_id_idx").on(
//   affiliates.groupId,
// )

// Message table
export const messages = pgTable("Message", {
  id: uuid("id").primaryKey(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow(),
  senderid: uuid("senderid").references(() => users.id, {
    onDelete: "cascade",
  }),
  recieverId: uuid("recieverId"),
})
