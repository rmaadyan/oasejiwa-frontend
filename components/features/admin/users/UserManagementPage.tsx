"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/features/admin/users/usertable";
import UserModal from "@/components/features/admin/users/usermodal";
import UserDetailsModal from "@/components/features/admin/users/userdetailsmodal";
import UserFilterBar from "@/components/features/admin/users/userfilterbar";
import Pagination from "@/components/features/admin/users/pagination";
import { getUsers, updateUser } from "@/lib/api/usersAdminSide";
import { downloadToCSV } from "@/lib/utils/csv-export";
import type {
  User,
  UserFormData,
  SortOption,
} from "@/lib/types/users";

export default function UserManagementPage() {
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

  const formatDateForCsv = (date?: string | Date | null) => {
    if (!date) return "";

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      const [year, month, day] = rawDate.split("-").map(Number);

      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1, day));
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRole = (role?: string | null) => {
    if (role === "admin") return "Admin";
    if (role === "psychologist") return "Psikolog";
    if (role === "user" || role === "patient") return "Pasien";
    return role || "";
  };

  const formatStatus = (status?: string | null) => {
    if (status === "active") return "Aktif";
    if (status === "inactive") return "Nonaktif";
    return status || "";
  };

  const formatPhoneForCsv = (phone?: string | null) => {
    if (!phone) return "";

    const cleanedPhone = String(phone).trim();

    /**
     * Format ini sengaja supaya Excel membaca nomor HP sebagai teks,
     * bukan angka scientific notation seperti 8,21E+10.
     */
    return `="${cleanedPhone}"`;
  };

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await getUsers({
        page: currentPage,
        perPage,
        sort: sortBy,
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
  }, [currentPage, perPage, sortBy, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [perPage, sortBy, searchQuery]);

  const handleEditUser = async (data: UserFormData) => {
    if (!selectedUser) return;

    await updateUser(selectedUser.id, data);
    await fetchUsers();

    setSelectedUser(null);
  };

  const handleExport = async () => {
    try {
      const response = await getUsers({
        page: 1,
        perPage: Math.max(totalUsers, 1),
        sort: sortBy,
        search: searchQuery,
      });

      const exportData = response.users.map((user: User, index: number) => ({
        No: index + 1,
        Nama: user.name || "",
        Email: user.email || "",
        Role: formatRole(user.role),
        Status: formatStatus(user.status),
        Telepon: formatPhoneForCsv(user.phone),
        "Tanggal Bergabung": formatDateForCsv(user.registeredAt),
        "Total Booking": user.bookingCount || 0,
      }));

      downloadToCSV(
        exportData,
        `user-oase-jiwa-${new Date().toISOString().split("T")[0]}.csv`,
        {
          delimiter: ";",
          includeBom: true,
          includeExcelSeparatorHint: true,
        }
      );
    } catch (error) {
      console.error("Failed to export users:", error);
      alert("Gagal export data user.");
    }
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
        <h1 className="text-3xl font-bold text-[#2B5379]">
          Manajemen User
        </h1>
        <p className="mt-1 text-gray-600">
          Lihat rincian user dan ubah role pengguna
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total User</p>
          <p className="mt-2 text-3xl font-bold text-[#2B5379]">
            {userStats.totalUsers}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Pasien</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {userStats.totalPatients}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Psikolog</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {userStats.totalPsychologists}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Halaman Ini</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {users.length}
          </p>
        </div>
      </div>

      <UserFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
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