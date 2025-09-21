import { useState, useEffect } from "react";
import User from "../api/User";
import { useAuth } from "../Context/AuthContext";
import Loader from "../Components/Loader";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const { auth } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await User.getProfile();
        setProfileData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isLogged) {
      fetchProfile();
    }
  }, [auth.isLogged]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      const response = await User.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      }
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (passwordError) setPasswordError("");
    if (passwordSuccess) setPasswordSuccess("");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">No Profile Data</h2>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  const isFaculty = profileData.role === "faculty";
  const isStudent = profileData.role === "student";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            View and manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">
                User Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {profileData.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <span
                    className={`ms-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      isFaculty
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {profileData.role?.charAt(0).toUpperCase() +
                      profileData.role?.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-500">
                    Password
                  </label>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      ••••••••
                    </p>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Form */}
            {showPasswordForm && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {passwordError && (
                    <div className="text-red-600 text-sm">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="text-green-600 text-sm">
                      {passwordSuccess}
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Role-Specific Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div
                className={`p-3 rounded-full ${
                  isFaculty ? "bg-purple-100" : "bg-green-100"
                }`}
              >
                <svg
                  className={`w-8 h-8 ${
                    isFaculty ? "text-purple-600" : "text-green-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isFaculty ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  )}
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">
                {isFaculty ? "Faculty Information" : "Student Information"}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Department */}
              {profileData.department && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Department
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.department}
                    </p>
                  </div>
                </div>
              )}

              {/* Faculty specific fields */}
              {isFaculty && profileData.designation && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Designation
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.designation}
                    </p>
                  </div>
                </div>
              )}

              {/* Student specific fields */}
              {isStudent && profileData.enrollment_no && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Enrollment Number
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.enrollment_no}
                    </p>
                  </div>
                </div>
              )}

              {isStudent && profileData.batch && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Batch
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.batch}
                    </p>
                  </div>
                </div>
              )}

              {isStudent && profileData.batch_id && (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">
                      Batch ID
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {profileData.batch_id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {profileData.user_id}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium text-gray-500">
                Account Status
              </label>
              <span className="ms-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
