"use client";

import { useState, useEffect } from "react";
import { X, Calendar, CreditCard, User, Phone, Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { getUserDetails } from "@/lib/api/usersAdminSide";
import type { UserDetails } from "@/lib/types/users";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

export default function UserDetailsModal({ isOpen, onClose, userId }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "bookings" | "transactions">("info");

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  const fetchUserDetails = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const details = await getUserDetails(userId);
      setUserDetails(details);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      upcoming: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700",
      pending: "bg-orange-100 text-orange-700",
    };

    const labels = {
      completed: "Selesai",
      upcoming: "Akan Datang",
      cancelled: "Dibatalkan",
      paid: "Lunas",
      pending: "Pending",
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Detail User</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : userDetails ? (
          <>
            {/* Summary Cards */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Total Booking</p>
                  <p className="text-2xl font-bold text-gray-900">{userDetails.totalBookings || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Selesai</p>
                  <p className="text-2xl font-bold text-green-600">{userDetails.completedBookings || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Total Transaksi</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(userDetails.totalSpent || 0)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-1">Booking Terakhir</p>
                  <p className="text-sm font-semibold text-gray-900">{userDetails.lastBooking || "-"}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "info"
                    ? "border-[#2B5379] text-[#2B5379]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Informasi
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-[#2B5379] text-[#2B5379]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Riwayat Booking
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "transactions"
                    ? "border-[#2B5379] text-[#2B5379]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Riwayat Transaksi
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Tab: Info */}
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Nama Lengkap</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Nomor Telepon</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.phone || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Bergabung</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.registeredAt}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      userDetails.status === "active" 
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {userDetails.status === "active" ? "Aktif" : "Nonaktif"}
                    </span>
                    <span className="ml-4 text-sm text-gray-600">Role:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      userDetails.role === "psychologist"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {userDetails.role === "psychologist" ? "Psikolog" : "Pasien"}
                    </span>
                  </div>
                </div>
              )}

              {/* Tab: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-3">
                  {userDetails.bookingHistory && userDetails.bookingHistory.length > 0 ? (
                    userDetails.bookingHistory.map((booking) => (
                      <div key={booking.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">{booking.service}</p>
                            <p className="text-sm text-gray-600">{booking.psychologist}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1 ml-auto font-semibold text-gray-900">
                            {formatCurrency(booking.price)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Belum ada riwayat booking</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Transactions */}
              {activeTab === "transactions" && (
                <div className="space-y-3">
                  {userDetails.transactionHistory && userDetails.transactionHistory.length > 0 ? (
                    userDetails.transactionHistory.map((transaction) => (
                      <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                            {transaction.paymentMethod && (
                              <p className="text-xs text-gray-500 mt-1">via {transaction.paymentMethod}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>Belum ada riwayat transaksi</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-12 text-gray-500">
            <p>Data user tidak ditemukan</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
