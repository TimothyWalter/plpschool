
import Navbar from "../components/Navbar";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-green-800">Your Profile</h1>
        <p className="mt-4 text-gray-700">Manage your account details, preferences, and settings here.</p>
      </div>
    </div>
  );
}
