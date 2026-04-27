"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/features/admin/users/usertable";
import UserModal from "@/components/features/admin/users/usermodal";
import UserDetailsModal from "@/components/features/admin/users/userdetailsmodal";
import UserFilterBar from "@/components/features/admin/users/userfilterbar";
import Pagination from "@/components/features/admin/users/pagination";
import { getUsers, updateUser, deleteUser } from "@/lib/api/users";
import { downloadToCSV } from "@/lib/utils/csv-export";
import type {
  User,
  UserFormData,
  SortOption,
  GenderFilter,
} from "@/lib/types/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalPsychologists: 0,
    totalAdmins: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await getUsers({
        page: currentPage,
        perPage,
        sort: sortBy,
        gender: genderFilter,
        search: searchQuery,
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalUsers(response.total);

      setUserStats({
        totalUsers: response.meta?.totalUsers ?? response.total ?? 0,
        totalPatients: response.meta?.totalPatients ?? 0,
        totalPsychologists: response.meta?.totalPsychologists ?? 0,
        totalAdmins: response.meta?.totalAdmins ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, perPage, sortBy, genderFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, sortBy, genderFilter, searchQuery]);

  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    await updateUser(selectedUser.id, data);
    await fetchUsers();

    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    await deleteUser(selectedUser.id);
    await fetchUsers();

    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleExport = () => {
    const exportData = users.map((user) => ({
      ID: user.id,
      Nama: user.name,
      Email: user.email,
      "Jenis Kelamin": user.gender === "male" ? "Laki-laki" : "Perempuan",
      Role: user.role === "psychologist" ? "Psikolog" : "Pasien",
      Telepon: user.phone || "-",
      "Tanggal Bergabung": user.registeredAt || "-",
      Status: user.status === "active" ? "Aktif" : "Nonaktif",
      "Total Booking": user.bookingCount || 0,
    }));

    downloadToCSV(
      exportData,
      `users-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#2B5379]">Manajemen User</h1>
        <p className="text-gray-600 mt-1">
          Lihat rincian user, ubah role, atau hapus user
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Total User</p>
          <p className="text-3xl font-bold text-[#2B5379] mt-2">
            {userStats.totalUsers}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Pasien</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {userStats.totalPatients}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Psikolog</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {userStats.totalPsychologists}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600">Halaman Ini</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {users.length}
          </p>
        </div>
      </div>

      <UserFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        genderFilter={genderFilter}
        onGenderFilterChange={setGenderFilter}
        perPage={perPage}
        onPerPageChange={setPerPage}
        onExport={handleExport}
        totalUsers={totalUsers}
      />

      <UserTable
        users={users}
        onEdit={openEditModal}
        onViewDetails={openDetailsModal}
        loading={loading}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditUser}
        onDelete={handleDeleteUser}
        user={selectedUser}
        mode="edit"
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        userId={selectedUser?.id || null}
      />
    </div>
  );
}