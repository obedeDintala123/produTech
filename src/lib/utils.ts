import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractTextFromHTML(html: any) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() || "";
}

export function parseNoteHTML(htmlText: string) {
  if (!htmlText) return { title: "Sem título", preview: "" };

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, "text/html");

  const titleEl = doc.querySelector("h1, h2, h3, h4, h5, h6");
  const title = titleEl?.textContent?.trim() || "Sem título";

  let preview = "";
  const paragraphEl = doc.querySelectorAll("p, li, div");
  for (const el of paragraphEl) {
    const text = el.textContent?.trim();
    if (text && text !== title) {
      preview = text;
      break;
    }
  }

  const hasImage = !!doc.querySelector("img");
  const hasList = !!doc.querySelector("ul, ol");

  return { title, preview, hasImage, hasList };
}
