// src/components/layout/UserDropdown.tsx
export default function UserDropdown({ user }: { user: any }) {
  return (
    <div className="bg-gray-100 px-4 py-2 rounded-full font-semibold">
      {user.email || "User"}
    </div>
  );
}
