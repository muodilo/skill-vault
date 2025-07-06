import Link from "next/link";

export function NavItem({
  icon,
  label,
  collapsed,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  href: string;
}) {
  return (
    <Link href={href} passHref>
      <p
        className="flex items-center gap-4 p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
        aria-label={label}
      >
        <span className="text-xl">{icon}</span>
        <span
          className={`transition-opacity duration-200 inline-block ${
            collapsed ? "lg:hidden" : "lg:inline-block"
          }`}
        >
          {label}
        </span>
      </p>
    </Link>
  );
}
