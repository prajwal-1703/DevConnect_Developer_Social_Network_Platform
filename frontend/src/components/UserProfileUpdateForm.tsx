import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function UserProfileUpdateForm() {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState(user?.bio || "");
  const [github, setGithub] = useState(user?.github || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [location, setLocation] = useState(user?.location || "");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const form = new FormData();
      if (bio) form.append("bio", bio);
      if (github) form.append("github", github);
      if (website) form.append("website", website);
      if (location) form.append("location", location);
      if (profilePic) form.append("profilePic", profilePic);

      await updateUser(form);
      setSuccess("Profile updated successfully");
    } catch (e: any) {
      setError(e?.response?.data?.msg || e?.response?.data?.message || e.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto p-4 space-y-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Update Profile</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}

      <div>
        <label className="block text-sm text-gray-700 mb-1">Bio</label>
        <textarea className="w-full border rounded p-2" value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">GitHub</label>
          <input className="w-full border rounded p-2" value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Website</label>
          <input className="w-full border rounded p-2" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Location</label>
        <input className="w-full border rounded p-2" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files?.[0] || null)} />
      </div>

      <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}


