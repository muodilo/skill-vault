"use client";

import { useState } from "react";
import { Reflection } from "@/types/skill";

export default function EditReflectionModal({
  reflection,
  onClose,
  onUpdated,
}: {
  reflection: Reflection;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [content, setContent] = useState(reflection.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/reflections/${reflection.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        console.error("Failed to update reflection");
        return;
      }

      onClose();
      onUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Reflection</h3>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-3 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-neutral-500 px-3 py-1 rounded text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-primaryColor px-3 py-1 rounded text-white"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
