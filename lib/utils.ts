import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, "")
    .replace(/ +/g, "-");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
// Step by step:

// clsx(inputs) → sab class values ko single string me merge karta hai, conditional check ke saath

// Example:

// clsx("btn", isActive && "btn-active")
// // output: "btn btn-active" (agar isActive true)
// twMerge(...) → Tailwind classes ko optimize / deduplicate karta hai

// Example:

// twMerge("px-2 px-4") → "px-4"
// twMerge("bg-red-500 bg-blue-500") → "bg-blue-500"

// ✅ Result → clean, deduplicated Tailwind class string ready for className
