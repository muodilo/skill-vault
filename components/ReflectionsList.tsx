"use client";

import { useState } from "react";
import { Reflection } from "@/types/skill";
import EditReflectionModal from "./EditReflectionModal";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function ReflectionsList({
  reflections: initialReflections,
  skillId,
}: {
  reflections: Reflection[];
  skillId: string;
}) {
  const [reflections, setReflections] = useState(initialReflections);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingReflection, setEditingReflection] = useState<Reflection | null>(
    null
  );

  const handleAddReflection = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, content }),
      });

      if (!response.ok) {
        console.error("Failed to add reflection");
        return;
      }

      setContent("");
      await refreshReflections();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReflection = async (id: string) => {
    if (!confirm("Delete this reflection?")) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/reflections/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete reflection");
        return;
      }

      await refreshReflections();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const refreshReflections = async () => {
    const response = await fetch(`/api/reflections?skillId=${skillId}`);
    if (!response.ok) {
      console.error("Failed to fetch reflections");
      return;
    }

    const data = await response.json();
    setReflections(data);
  };

  return (
    <div className="p-4 rounded">
      <h2 className="text-lg font-bold mb-4">Learning Reflections</h2>

      <textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded p-3 mb-2"
      />

      <button
        onClick={handleAddReflection}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Reflection"}
      </button>

      <ul className="mt-6 space-y-4">
        {reflections.map((r) => (
          <li key={r.id} className="border rounded p-3">
            <div className="flex items-center justify-between">
            <p className="mb-2">{r.content}</p>
                        <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditingReflection(r)}
                className="cursor-pointer"
              >
                <FaEdit/>
              </button>
              <button
                onClick={() => handleDeleteReflection(r.id)}
                className="cursor-pointer"
              >
                {deleteLoading?<MdDelete className="text-neutral-500"/>: <MdDelete />}
              </button>
            </div>

            </div>
            <p className="text-xs text-neutral-500">
              {r.createdAt
                ? new Date(r.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date unknown"}
            </p>


          </li>
        ))}
      </ul>

      {editingReflection && (
        <EditReflectionModal
          reflection={editingReflection}
          onClose={() => setEditingReflection(null)}
          onUpdated={refreshReflections}
        />
      )}
    </div>
  );
}
