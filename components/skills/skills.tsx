"use client";

import React, { useState } from "react";
import AddSkillButton from "@/components/skills/AddSkillButton";
import AddSkillModal from "./AddSkillModal";
import SkillCard from "./skillCard";
import useSkills from "@/hooks/useSkills";
import { Skill } from "@/types/skill";

export default function Skills() {
  const { skills, isLoading, error, mutate } = useSkills();
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete skill");
      }
      await mutate(); 
    } catch (err) {
      console.error("Error deleting skill:", err);
      alert("Failed to delete skill. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse h-32 rounded-lg shadow"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error.message || "Error loading skills"}</p>;
  }

  return (
    <div className="py-5">
      <p className="text-lg font-semibold mb-3">Your skills</p>

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

      {showModal && (
        <AddSkillModal
          skill={editingSkill}
          onClose={() => setShowModal(false)}
          onSkillUpdated={() => mutate()} 
        />
      )}
    </div>
  );
}
