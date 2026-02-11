import { notFound } from "next/navigation";
import { chapters } from "@/lib/chapters";
import { LessonContent } from "@/components/LessonContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return chapters.map((chapter) => ({
    id: String(chapter.id),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const chapter = chapters.find((c) => c.id === Number(id));
  if (!chapter) return { title: "Not Found" };
  return {
    title: `${chapter.id}. ${chapter.title} — Prompt Engineering Tutorial`,
    description: chapter.description,
  };
}

export default async function ChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = chapters.find((c) => c.id === Number(id));
  if (!chapter) notFound();
  return <LessonContent chapter={chapter} />;
}
