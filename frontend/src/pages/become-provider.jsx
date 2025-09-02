import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import {
  Phone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  FileText,
  CreditCard,
} from "lucide-react";

const SERVICES = ["Mechanic", "Plumber", "Electrician", "Painter", "Carpenter", "Cleaner", "Technician"];

const LOCATIONS = [
  "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Tirupati",
  "Nellore",
  "Kurnool",
  "Rajahmundry",
  "Kakinada",
  "Eluru",
  "Anantapur"
];

export default function BecomeProvider() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ moved inside component
  const location = useLocation(); 

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    location: "",
    phone: "",
    otp: "",
    documents: {
      photo: null,
      aadhaar: null,
      pancard: null,
    },
    paymentSuccess: false,
  });

  // Handle input changes
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, documents: { ...formData.documents, [name]: files[0] } });
  };

  // Send OTP
  const sendOTP = async () => {
    if (!formData.phone) return alert("Enter phone number");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { phone: formData.phone });
      alert("OTP sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  // Verify OTP
  const verifyOTP = async () => {
    if (!formData.otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { phone: formData.phone, otp: formData.otp });
      alert("OTP verified!");
      setStep(5);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };

  // Submit provider data including documents
  const submitDocuments = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("service", formData.service);
    data.append("location", formData.location);
    data.append("phone", formData.phone);
    data.append("photo", formData.documents.photo);
    data.append("aadhaar", formData.documents.aadhaar);
    data.append("pancard", formData.documents.pancard);

    try {
      await axios.post("http://localhost:5000/api/providers", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStep(6);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload documents");
    }
  };

  // Dummy payment simulation
  const handlePayment = () => {
    // simulate payment success
    setFormData({ ...formData, paymentSuccess: true });
    setStep(7);
  };

  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Service Type" },
    { id: 3, title: "Location" },
    { id: 4, title: "Phone Verification" },
    { id: 5, title: "Upload Documents" },
    { id: 6, title: "Membership Payment" },
    { id: 7, title: "Done" },
  ];

  return (
    <div className="w-screen min-h-screen flex items-center justify-center p-6 bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8">
        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((s) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  step >= s.id ? "bg-green-400 border-green-400" : "border-gray-300"
                }`}
              >
                {step > s.id ? "✓" : s.id}
              </div>
              <p className="text-xs mt-2 text-center">{s.title}</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-4">Your Info</h2>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 mb-4 rounded-lg border"
              />
              <button onClick={() => setStep(2)} className="w-full bg-blue-500 text-white py-3 rounded-lg">Next</button>
            </motion.div>
          )}

          {/* Step 2: Service Type */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-4">Select Service</h2>
              <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 mb-4 rounded-lg border">
                <option value="">Select</option>
                {SERVICES.map((srv) => <option key={srv}>{srv}</option>)}
              </select>
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2">Back</button>
                <button onClick={() => setStep(3)} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location */}
{step === 3 && (
  <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h2 className="text-2xl font-bold mb-4">Location</h2>
    <select
      name="location"
      value={formData.location}
      onChange={handleChange}
      className="w-full px-4 py-3 mb-4 rounded-lg border"
    >
      <option value="">Select your city</option>
      {LOCATIONS.map((loc) => (
        <option key={loc} value={loc}>{loc}</option>
      ))}
    </select>
    <div className="flex justify-between">
      <button onClick={() => setStep(2)} className="flex items-center gap-2">Back</button>
      <button onClick={() => setStep(4)} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Next</button>
    </div>
  </motion.div>
)}


          {/* Step 4: Phone Verification */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-4">Phone Verification</h2>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 mb-2 rounded-lg border"/>
              <div className="flex gap-2 mb-4">
                <button onClick={sendOTP} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex-1">{loading ? "Sending..." : "Send OTP"}</button>
                <input type="text" name="otp" placeholder="OTP" value={formData.otp} onChange={handleChange} className="flex-1 px-4 py-3 rounded-lg border"/>
                <button onClick={verifyOTP} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded-lg">{loading ? "Verifying..." : "Verify"}</button>
              </div>
              <button onClick={() => setStep(3)} className="flex items-center gap-2">Back</button>
            </motion.div>
          )}

          {/* Step 5: Document Upload */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
              <input type="file" name="photo" onChange={handleFileChange} className="mb-2"/>
              <input type="file" name="aadhaar" onChange={handleFileChange} className="mb-2"/>
              <input type="file" name="pancard" onChange={handleFileChange} className="mb-2"/>
              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className="flex items-center gap-2">Back</button>
                <button onClick={submitDocuments} className="bg-blue-500 text-white px-6 py-3 rounded-lg">Next</button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Membership Payment */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold mb-4">Membership Payment</h2>
              <button onClick={handlePayment} className="bg-green-500 text-white px-6 py-3 rounded-lg">Pay & Access</button>
              <button onClick={() => setStep(5)} className="flex items-center gap-2 mt-2">Back</button>
            </motion.div>
          )}

          {/* Step 7: Done */}
          {step === 7 && (
            <motion.div key="step7" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <CheckCircle2 size={80} className="mx-auto text-green-400 mb-4"/>
              <h2 className="text-2xl font-bold text-center">Success!</h2>
              <p className="text-center mt-2">You are now a verified service provider.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
        {/* Back Button */}
        <div className="fixed bottom-8 w-full flex justify-center z-50">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            ← Back
          </button>
        </div>

    </div>
  );
}
