"use client";

import z from "zod";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useTransition } from "react";
import createPost, { updatePost } from "@/actions/post-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "atleast 3 characters long")
    .max(255, "must be less than 255 characters"),

  description: z
    .string()
    .min(5, "atleast 5 characters long")
    .max(255, "must be less than 255 characters"),

  content: z.string().min(10, "atleast 10 characters long"),
});

type PostFormValues = z.infer<typeof postSchema>;

interface PostFormProps {
  isEditing: boolean;
  post?: {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
  };
}

function PostForm({ isEditing, post }: PostFormProps) {
  const [isPending, setIsPending] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues:
      isEditing && post
        ? {
            title: post.title,
            description: post.description,
            content: post.content,
          }
        : {
            title: "",
            description: "",
            content: "",
          },
  });

  const onFormSubmit = async (data: PostFormValues) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("content", data.content);

        let res;

        if (isEditing && post) {
          res = await updatePost(post.id, formData);
        } else {
          res = await createPost(formData);
        }

        if (res.success) {
          toast(
            isEditing ? "Post Edited successfuly" : "Post created successfully",
          );
          router.push("/");
        } else {
          toast(res.message);
        }
      } catch (error) {
        toast("Failed to create post");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="sapce-y-2">
        <label htmlFor="title">Title </label>
        <Input
          id="title"
          placeholder="Enter your title..."
          {...register("title")}
          disabled={isPending}
        />
        {errors?.title && (
          <p className="text-sm text-red-700">{errors.title.message}</p>
        )}
      </div>
      <div className="sapce-y-2">
        <label htmlFor="description">Description </label>
        <Textarea
          id="description"
          placeholder="Enter your description..."
          {...register("description")}
          disabled={isPending}
        />
        {errors?.description && (
          <p className="text-sm text-red-700">{errors.description.message}</p>
        )}
      </div>
      <div className="sapce-y-2">
        <label htmlFor="content">Content </label>
        <Textarea
          id="content"
          placeholder="Enter your content..."
          className="min-h-62.5 resize-none"
          {...register("content")}
          disabled={isPending}
        />
        {errors?.content && (
          <p className="text-sm text-red-700">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="mt-5 w-full">
        {isPending
          ? "Saving Post..."
          : isEditing
            ? "Update Post"
            : "Create Post"}
      </Button>
    </form>
  );
}

export default PostForm;
