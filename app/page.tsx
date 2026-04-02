import PostList from "@/components/post/post-list";
import getAllPosts from "@/lib/db/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js 15 blog",
  description: "Next.js 15 blog",
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">Welome to the blog</h1>
        {posts.length === 0 ? (
          <div>
            <h2>No Posts yet</h2>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </div>
    </main>
  );
}
