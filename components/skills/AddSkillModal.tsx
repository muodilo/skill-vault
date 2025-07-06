"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Skill } from "@/types/skill"; 

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export default function AddSkillModal({
  skill,
  onClose,
  onSkillUpdated,
}: {
  skill: Skill | null;
  onClose: () => void;
  onSkillUpdated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setTitle(skill.title);
      setDescription(skill.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setError(null);
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ title, description });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        skill ? `/api/skills/${skill.id}` : "/api/skills",
        {
          method: skill ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        }
      );

      if (!res.ok) {
        throw new Error("Request failed");
      }

      onSkillUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
        <h2 className="text-lg font-semibold mb-4">
          {skill ? "Edit Skill" : "Add New Skill"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Skill title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Skill description (optional)"
            ></textarea>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primaryColor text-white rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : skill ? "Update Skill" : "Create Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
