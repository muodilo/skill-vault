"use client";

import { IoMdAddCircle } from "react-icons/io";

export default function AddSkillButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="border rounded-xl p-5 shadow flex flex-col items-center justify-center">
      <button
        onClick={onClick}
        className="text-primaryColor hover:text-primaryColor/80 flex flex-col items-center "
      >
        <IoMdAddCircle className="text-6xl" />
        <span className="text-black font-semibold">Add New Skill</span>
        <span className="text-sm text-neutral-500">
          Start tracking new learning goal
        </span>
      </button>
    </div>
  );
}
