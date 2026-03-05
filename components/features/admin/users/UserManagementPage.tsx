"use client";

import type { GenderFilter, SortOption, User, UserFormData } from "@/lib/types/users";
import { useEffect, useMemo, useState } from "react";
import DeleteConfirmModal from "./deleteconfirmmodal";
import Pagination from "./pagination";
import UserDetailsModal from "./userdetailsmodal";
import UserFilterBar from "./userfilterbar";
import UserModal from "./usermodal";
import UserTable from "./usertable";

const DUMMY_USERS: User[] = [
    { id: 1, name: "Budi Santoso", email: "budi@example.com", gender: "male", role: "patient", phone: "08123456789", status: "active", registeredAt: "2023-11-01", bookingCount: 2 },
    { id: 2, name: "Siti Aminah", email: "siti@example.com", gender: "female", role: "patient", phone: "08123456780", status: "active", registeredAt: "2023-11-05", bookingCount: 5 },
    { id: 3, name: "Agus Pratama", email: "agus.p@example.com", gender: "male", role: "psychologist", phone: "08123456781", status: "active", registeredAt: "2023-10-15", bookingCount: 10 },
    { id: 4, name: "Rina Wijaya", email: "rina.w@example.com", gender: "female", role: "patient", phone: "08123456782", status: "inactive", registeredAt: "2023-12-01", bookingCount: 0 },
    { id: 5, name: "Dewi Lestari", email: "dewi.l@example.com", gender: "female", role: "patient", phone: "08123456783", status: "active", registeredAt: "2023-12-10", bookingCount: 1 },
];

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem("oasejiwa_users_v2");
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                setUsers(DUMMY_USERS);
                localStorage.setItem("oasejiwa_users_v2", JSON.stringify(DUMMY_USERS));
            }
        } catch {
            setUsers(DUMMY_USERS);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveUsers = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
        localStorage.setItem("oasejiwa_users_v2", JSON.stringify(updatedUsers));
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleViewDetails = (user: User) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleDeleteClick = () => {
        setIsEditModalOpen(false); // Close edit modal first
        setIsDeleteModalOpen(true);
    };

    const handleEditSubmit = async (data: UserFormData) => {
        if (!selectedUser) return;
        const updatedUsers = users.map((u) => {
            if (u.id === selectedUser.id) {
                return { ...u, role: data.role }; // Only role updates based on modal design
            }
            return u;
        });
        saveUsers(updatedUsers);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;
        const updatedUsers = users.filter((u) => u.id !== selectedUser.id);
        saveUsers(updatedUsers);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleExport = () => {
        // Dummy export logic
        console.log("Exporting to CSV...");
    };

    // Filter and Sort Logic
    const filteredAndSortedUsers = useMemo(() => {
        const result = users.filter((user) => {
            const matchSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchGender = genderFilter === "all" || user.gender === genderFilter;
            return matchSearch && matchGender;
        });

        result.sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            if (sortBy === "most-bookings") return (b.bookingCount || 0) - (a.bookingCount || 0);

            // Since it's string, we can compare string directly for newest/oldest
            if (sortBy === "newest" && a.registeredAt && b.registeredAt) {
                return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
            }
            if (sortBy === "oldest" && a.registeredAt && b.registeredAt) {
                return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
            }
            return 0;
        });

        return result;
    }, [users, searchQuery, genderFilter, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedUsers.length / perPage);
    const currentItems = useMemo(() => {
        const startIdx = (currentPage - 1) * perPage;
        return filteredAndSortedUsers.slice(startIdx, startIdx + perPage);
    }, [filteredAndSortedUsers, currentPage, perPage]);

    // Handle page reset on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, genderFilter, sortBy, perPage]);

    return (
        <div className="flex-1 overflow-y-auto w-full h-full bg-gray-50/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* Header Section */}
                <div>
                    <h1 className="text-2xl md:text-[28px] font-bold text-[#234463] mb-2">Manajemen User</h1>
                    <p className="text-sm text-gray-500">
                        Kelola data semua pengguna di Oase Jiwa.
                    </p>
                </div>

                {/* Filter Bar */}
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
                    totalUsers={filteredAndSortedUsers.length}
                />

                {/* User Table Component */}
                <UserTable
                    users={currentItems}
                    onEdit={handleEdit}
                    onViewDetails={handleViewDetails}
                    loading={isLoading}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>

            {/* Modals */}
            <UserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditSubmit}
                onDelete={handleDeleteClick}
                user={selectedUser}
                mode="edit"
            />

            <UserDetailsModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                userId={selectedUser?.id || null}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                user={selectedUser}
            />
        </div>
    );
}
