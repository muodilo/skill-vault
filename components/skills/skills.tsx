"use client";

import React, { useEffect, useState } from "react";
import AddSkillButton from "@/components/skills/AddSkillButton";
import AddSkillModal from "./AddSkillModal";
import SkillCard from "./skillCard";
import { Skill } from "@/types/skill";

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/skills");
      if (!res.ok) {
        throw new Error(`Failed to fetch skills: ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }
      setSkills(data);
    } catch (err:unknown) {
      console.error("Error fetching skills:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setSkills([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete skill");
      }
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill:", err);
      alert("Failed to delete skill. Please try again.");
    }
  };

  return (
    <div className="py-5">
      <p className="text-lg font-semibold mb-3">Your skills</p>

      {loading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse h-32 rounded-lg shadow"
            ></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => {
                setEditingSkill(skill);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(skill.id)}
            />
          ))}
          <AddSkillButton
            onClick={() => {
              setEditingSkill(null);
              setShowModal(true);
            }}
          />
        </div>
      )}

      {showModal && (
        <AddSkillModal
          skill={editingSkill}
          onClose={() => setShowModal(false)}
          onSkillUpdated={fetchSkills}
        />
      )}
    </div>
  );
}
