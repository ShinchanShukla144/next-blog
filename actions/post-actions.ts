"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { success } from "zod";

export default async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user) {
      return {
        success: false,
        message: "Must login to create post",
      };
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    const slug = slugify(title);

    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existingPost) {
      return {
        success: false,
        message: "Already used same title for posts, please try other!",
      };
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    revalidatePath("/");
    revalidatePath(`/path/${slug}`);
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Post failed to create",
    };
  }
}

export async function updatePost(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session?.user) {
      return {
        success: false,
        message: "Must login to edit post",
      };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    const slug = slugify(title);

    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.slug, slug), ne(posts.id, postId)),
    });

    if (existingPost) {
      return {
        success: false,
        message: "Title already exists, try other",
      };
    }

    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (post?.authorId !== session.user.id) {
      return {
        success: false,
        message: "Please edit your own post!",
      };
    }

    await db
      .update(posts)
      .set({
        title,
        description,
        content,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    (revalidatePath("/"), revalidatePath(`/post/${slug}`));
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post edited successfully...",
      slug,
    };
  } catch (e) {
    console.log(e, "Failed to edit post");

    return {
      success: false,
      message: "Failed to create new post",
    };
  }
}

export async function deletePost(postId: number) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session?.user) {
      return {
        success: false,
        message: "Must login to edit post",
      };
    }

    const postToDelete = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!postToDelete) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    if (postToDelete?.authorId !== session.user.id) {
      return {
        success: false,
        message: "Please DELETE your own post!",
      };
    }

    await db.delete(posts).where(eq(posts.id, postId));

    revalidatePath("/");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (e) {
    console.log(e, "Failed to delete post");

    return {
      success: false,
      message: "Failed to delete new post",
    };
  }
}
