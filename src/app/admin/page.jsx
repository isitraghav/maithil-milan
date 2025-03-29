"use client";
import { Users, Heart, MessageCircle, TrendingUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCoreInfo,
  getDataServerAdmin,
  handleDeleteUser,
  searchAdmin,
} from "./server";
import Link from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";
import { PiGenderFemale, PiGenderMale } from "react-icons/pi";

export default function AdminDashboard() {
  const [data, setData] = useState({
    userCount: 0,
    matchCount: 0,
    profileCount: 0,
    newUsers: 0,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getDataServerAdmin().then((data) => {
      console.log("Data fetched:", data);
      const { userCount, matchCount, profileCount, newUsers, genderStats } =
        data;
      setData({ userCount, matchCount, profileCount, newUsers, genderStats });
    });
  }, []);

  const handleSearch = async (e) => {
    setPage(1);
    e.preventDefault();
    try {
      const users = await searchAdmin(searchQuery, page);
      setSearchResults(users);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          title="Total Users"
          value={data.userCount}
        />
        <MetricCard
          icon={<Heart className="w-5 h-5" />}
          title="Matches Made"
          value={data.matchCount}
        />
        <MetricCard
          icon={<MessageCircle className="w-5 h-5" />}
          title="Active Profiles"
          value={data.profileCount}
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="New Users"
          value={data.newUsers}
          subtitle="last month"
        />

        {data.genderStats?.map((stat) => (
          <MetricCard
            key={stat.gender + " Members"}
            icon={
              stat.gender === "Male" ? <PiGenderMale /> : <PiGenderFemale />
            }
            title={stat.gender + " Members"}
            value={stat._count.gender}
          />
        ))}
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Search Users</h2>
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {searchQuery ? "Search" : "Show All Users"}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={async () => {
                  await searchAdmin(searchQuery, page - 1).then((val) => {
                    setSearchResults(val);
                  });
                  setPage(page - 1);
                }}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-semibold">Page {page}</span>
              <button
                onClick={async () => {
                  await searchAdmin(searchQuery, page + 1).then((val) => {
                    console.log(val);
                    if (val.length !== 0) {
                      setPage(page + 1);
                      setSearchResults(val);
                    }
                  });
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </>
        )}
        {searchResults.length === 0 && (
          <p className="text-gray-600">No results found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onDelete={async () => {
                const confirmation = await Swal.fire({
                  title: `Delete ${user.profile?.fullName}?`,
                  text: "This action cannot be undone",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#ef4444",
                  cancelButtonColor: "#6b7280",
                });

                if (confirmation.isConfirmed) {
                  await handleDeleteUser(user.id);
                  setSearchResults((results) =>
                    results.filter((u) => u.id !== user.id)
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
const MetricCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="text-indigo-600">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
  </div>
);

// Reusable User Card Component
const UserCard = ({ user, onDelete }) => {
  const profile = user.profile || {};

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-3">
          <Image
            src={profile.image || "/img/user.webp"}
            alt={profile.fullName}
            fill
            className="rounded-full object-cover border-2 border-white"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{profile.fullName}</h4>
          <p className="text-sm text-gray-500">
            {profile.city}, {profile.age} years
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📚</span>
          {profile.education || "N/A"}
        </div>
        <div className="flex items-center text-gray-600">
          <span className="mr-2">💼</span>
          {profile.professionDetails || "N/A"}
        </div>
      </div>

      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex gap-2">
          <Link
            href={`/profile/${profile.userId}`}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            View Profile
          </Link>
          <Link
            href={`/admin/${user.id}`}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            Admin View
          </Link>
        </div>
        <button
          onClick={onDelete}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
