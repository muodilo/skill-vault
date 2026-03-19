import useSWR from "swr";
import { Skill } from "@/types/skill";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch skills");
  const data = await res.json();


  if (!Array.isArray(data)) return [];
  return data;
};

export default function useSkills() {
  const { data, error, isLoading, mutate } = useSWR<Skill[]>("/api/skills", fetcher);

  return {
    skills: data || [], 
    error,
    isLoading,
    mutate,
  };
}
