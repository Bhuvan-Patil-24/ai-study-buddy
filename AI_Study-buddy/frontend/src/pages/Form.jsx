import React, { useState } from "react";

const professions = [
  "Student",
  "Engineer",
  "Doctor",
  "Teacher",
  "Business",
  "Other",
];

const Form = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    dob: "",
    gender: "",
    address: "",
    profession: "",
    experience: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare form data for multer
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (profilePic) data.append("profilePic", profilePic);

    try {
      const res = await fetch("http://localhost:5000/api/v1/profile", {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await res.json();
      if (res.ok && result.status === "success") {
        alert("Profile updated successfully!");
        window.location.href = "/profile"; // Redirect after alert
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (err) {
      alert("Error submitting form");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Edit Profile
        </h2>
        {/* Profile Picture Preview */}
        <div className="flex flex-col items-center mb-4">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 border"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            name="profilePic"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="profilePic"
            className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded cursor-pointer text-sm hover:bg-indigo-700 transition"
          >
            Choose File
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="w-full px-3 py-2 border rounded"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 border rounded"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="dob"
            className="w-full px-3 py-2 border rounded"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            className="w-full px-3 py-2 border rounded"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Address</label>
          <input
            type="text"
            name="address"
            className="w-full px-3 py-2 border rounded"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Profession</label>
          <select
            name="profession"
            className="w-full px-3 py-2 border rounded"
            value={form.profession}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            {professions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Experience (Years)</label>
          <input
            type="number"
            name="experience"
            className="w-full px-3 py-2 border rounded"
            value={form.experience}
            onChange={handleChange}
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Form;
