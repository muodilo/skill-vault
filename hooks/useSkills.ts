import useSWR from "swr";
import { Skill } from "@/types/skill";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function useSkills() {
  const { data, error, isLoading, mutate } = useSWR<Skill[]>("/api/skills", fetcher);
  return {
    skills: data || [],
    error,
    isLoading,
    mutate,
  };
}