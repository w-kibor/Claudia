import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 * Allows overriding Tailwind styles properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
