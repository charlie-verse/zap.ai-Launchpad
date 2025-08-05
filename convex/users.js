import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user already exists 
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
      
      console.log("Existing user check:", existingUser);

      // If user doesn't exist, create new user
      if (!existingUser) {
        const result = await ctx.db.insert("users", {
          name: args.name,
          picture: args.picture,
          email: args.email,
          uid: args.uid,
          token: 50000,
        });
        console.log("New user created:", result);
        return result;
      } else {
        console.log("User already exists, returning existing user");
        return existingUser._id;
      }
    } catch (error) {
      console.error("Error in CreateUser mutation:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first(); 
      
      return user;
    } catch (error) {
      console.error("Error in GetUser query:", error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.patch(args.userId, {
        token: args.token,
      });
      return result;
    } catch (error) {
      console.error("Error in UpdateToken mutation:", error);
      throw new Error(`Failed to update token: ${error.message}`);
    }
  },
});