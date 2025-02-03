"use client";
import { Users, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCoreInfo,
  getDataServerAdmin,
  handleDeleteUser,
  searchAdmin,
} from "./server";
import LinkNext from "next/link";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState({
    userCount: 0,
    matchCount: 0,
    profileCount: 0,
    newUsers: 0, // added new metric for demonstration
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDataServerAdmin().then(
      ({ userCount, matchCount, profileCount, newUsers }) => {
        console.log("Updated data:", {
          userCount,
          matchCount,
          profileCount,
          newUsers,
        });
        setData({ userCount, matchCount, profileCount, newUsers });
      }
    );
  }, []);

  // Handles the search form submission.
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const users = await searchAdmin(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 mt-2">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="card shadow-md border rounded-lg bg-white p-4">
          <div className="card-header flex flex-row items-center justify-between pb-2">
            <h2 className="card-title text-sm font-medium">Total Users</h2>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{data.userCount}</div>
          </div>
        </div>

        {/* Matches Made Card */}
        <div className="card shadow-md border rounded-lg bg-white p-4">
          <div className="card-header flex flex-row items-center justify-between pb-2">
            <h2 className="card-title text-sm font-medium">Matches Made</h2>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{data.matchCount}</div>
          </div>
        </div>

        {/* Active Profiles Card */}
        <div className="card shadow-md border rounded-lg bg-white p-4">
          <div className="card-header flex flex-row items-center justify-between pb-2">
            <h2 className="card-title text-sm font-medium">Active Profiles</h2>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{data.profileCount}</div>
          </div>
        </div>

        {/* New Users Card */}
        <div className="card shadow-md border rounded-lg bg-white p-4">
          <div className="card-header flex flex-row items-center justify-between pb-2">
            <h2 className="card-title text-sm font-medium">New Users</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="card-content">
            <div className="text-2xl font-bold">{data.newUsers}</div>
            <div className="text-xs opacity-50">added last month</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold">Search All Users</h2>
        <form onSubmit={handleSearch}>
          <div className="mt-4 flex items-center space-x-4">
            <input
              type="search"
              className="input w-full max-w-lg rounded-xl"
              placeholder="Search by name, email, or phone number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn bg-blue-600 px-3 p-2 rounded-xl hover:bg-blue-700 text-white"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((result) => {
            if (!result.profile) return null;
            return (
              <div key={result.id}>
                <div className="border bg-white border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <Image
                      height={50}
                      width={50}
                      src={result.profile.image || "/img/user.webp"}
                      alt=""
                      className="rounded-full mr-4 aspect-square object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-lg text-gray-800">
                        {result.profile.fullName}
                      </h4>
                      <p className="text-gray-600">
                        {result.age} years, {result.profile.profession}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {result.height} cm, {result.profile.education}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <LinkNext href={`/profile/${result.profile.userId}`}>
                        <button className="bg-gray-100 py-1 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                          View Profile
                        </button>
                      </LinkNext>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/${result.id}`}>
                        <button className="bg-yellow-100 py-1 text-yellow-600 p-2 rounded-full hover:bg-yellow-200 transition-colors duration-200">
                          Get Inf
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          console.log(result);
                          Swal.fire({
                            title: "Confirm Deletion",
                            text: "Are you sure you want to delete this user?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Yes, delete user",
                          }).then(async (result) => {
                            if (result.isConfirmed) {
                              const res = await handleDeleteUser(result.id);
                              if (res) {
                                Swal.fire(
                                  "Deleted!",
                                  "User has been deleted.",
                                  "success"
                                );
                              }
                            }
                          });
                        }}
                        className="bg-red-100 py-1 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors duration-200"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
