"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // New States for Stability & Performance
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Limits browser rendering overhead

  // Ref to target the profile menu element for click-away detection
  const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Feature 1: Click-Away Listener Implementation
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select an Excel file before calculating.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(""); // Reset previous errors

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );

      setEmployees(response.data.employees || []);
      setCurrentPage(1); // Reset pagination back to page 1 on fresh upload
    } catch (error) {
      console.error(error);
      // Feature 3: Catching specific backend generated error messages safely
      const backendError = error.response?.data?.message || "Upload Failed. Please check file formatting.";
      setErrorMessage(backendError);
    } finally {
      setLoading(false);
    }
  };

  // Feature 2: Client-side Filtering & Pagination logic
  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.employeeName?.toLowerCase().includes(searchLower) ||
      emp.paycode?.toString().toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  return (
    <main className="min-h-screen bg-[#F1DECB] text-[#5A3730]">
      {/* Navbar */}
      <nav className="bg-[#5A3730] shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-white">ARR Automation</h1>

          <div className="flex gap-6 text-white font-medium items-center">
            <a href="#">Home</a>
            <a href="#case-study">Case Study</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>

            {/* Profile Section with Click-Away ref attached */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2focus:outline-none"
                >
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#C28958]
                      text-white
                      flex
                      items-center
                      justify-center
                      font-bold
                    "
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <span className="text-white font-medium">
                    {user?.fullName}
                  </span>

                  <span className="text-white">▼</span>
                </button>

                {showMenu && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-2
                      w-56
                      bg-white
                      rounded-xl
                      shadow-xl
                      border
                      border-gray-200
                      overflow-hidden
                      z-50
                    "
                  >
                    <div className="p-4 border-b">
                      <p className="font-semibold text-[#5A3730]">
                        {user?.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {user?.profession || "User"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setUser(null);
                        setShowMenu(false);
                      }}
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        hover:bg-red-50
                        text-red-600
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="
                  bg-[#C28958]
                  text-white
                  px-6
                  py-2
                  rounded-lg
                  font-semibold
                "
              >
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8C5C3F] via-[#A46B47] to-[#C28958] text-white">
        <div className="max-w-7xl mx-auto py-24 px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Overtime Processing Automation
          </h1>

          <p className="text-xl mb-4">
            Automated Overtime Processing for HR Teams
          </p>

          <p className="max-w-3xl mx-auto text-lg opacity-90">
            Upload your monthly HR overtime report and generate employee-wise
            overtime calculations in minutes. Built by ARR Automation.
          </p>
        </div>
      </section>

      {/* Case Study */}
      <section id="case-study" className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-[#C28958]/20 p-8">
          <h2 className="text-3xl font-bold text-[#8C5C3F] mb-6">
            Case Study: Leiner Shoes
          </h2>

          <div className="space-y-4">
            <p>
              <strong>Problem:</strong> Manual overtime calculation required
              significant effort and verification every month.
            </p>

            <p>
              <strong>Solution:</strong> ARR Automation developed an automated
              overtime processing system that calculates employee-wise overtime
              directly from monthly HR reports.
            </p>

            <p className="font-semibold text-[#C28958]">
              Result: Reduced manual effort, faster processing, and improved
              reporting accuracy.
            </p>
          </div>
        </div>
      </section>

      {/* Upload + ARR Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 bg-white border border-[#C28958]/20 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-[#8C5C3F] mb-4">
              Upload Monthly Overtime Report
            </h2>

            <p className="mb-4 text-[#5A3730]">Supported format: .xlsx</p>

            {/* Feature 3 Error UI Display */}
            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-[#C28958]/30 p-3 rounded-lg bg-white focus:outline-none"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="
                mt-5
                w-full
                bg-[#C28958]
                hover:bg-[#8C5C3F]
                text-white
                py-3
                rounded-xl
                font-semibold
                transition-all
                duration-300
                disabled:opacity-50
              "
            >
              {loading ? "Processing..." : "Calculate Overtime"}
            </button>
          </div>

          {/* ARR Automation Panel */}
          <div
            id="services"
            className="bg-[#5A3730] text-white rounded-2xl shadow-lg p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Built By ARR Automation</h3>

            <p className="mb-6 text-white/90">
              ARR Automation helps businesses automate manual workflows through
              custom software, HR process automation, QA auditing, and
              AI-driven solutions.
            </p>

            <ul className="space-y-3">
              <li>✓ Business Automation</li>
              <li>✓ HR Automation</li>
              <li>✓ Custom Software Development</li>
              <li>✓ Automation Testing</li>
              <li>✓ AI Powered Solutions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Results Section featuring Search & Pagination controls */}
      {employees.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-[#C28958]/20 p-8">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-[#8C5C3F] mb-1">
                  Overtime Calculation Results
                </h2>
                <p className="text-sm text-gray-600">
                  Total Records: <strong className="text-[#5A3730]">{filteredEmployees.length}</strong> {filteredEmployees.length !== employees.length && `(filtered from ${employees.length})`}
                </p>
              </div>

              {/* Feature 2: In-Memory Search Input Field */}
              <div className="w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search name or paycode..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Bounce back to page 1 on active search filter
                  }}
                  className="w-full px-4 py-2 border border-[#C28958]/30 rounded-lg text-sm text-[#5A3730] focus:outline-none focus:border-[#C28958]"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl">
              <table className="w-full border border-[#C28958]/20">
                <thead>
                  <tr className="bg-[#8C5C3F] text-white">
                    <th className="p-3 text-left">Paycode</th>
                    <th className="p-3 text-left">Employee Name</th>
                    <th className="p-3 text-left">Total OT</th>
                  </tr>
                </thead>

                <tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map((employee, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#C28958]/20 hover:bg-[#F8EFE5]"
                      >
                        <td className="p-3">{employee.paycode}</td>
                        <td className="p-3">{employee.employeeName || "N/A"}</td>
                        <td className="p-3 font-semibold">{employee.totalOT}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500 bg-gray-50">
                        No records matched your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Feature 2: Pagination Row Control element */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 font-medium transition"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-40 font-medium transition"
                >
                  Next
                </button>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Footer */}
      {/* Footer */}
      <footer id="contact" className="bg-[#5A3730] text-[#F1DECB] border-t border-[#C28958]/20 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">ARR Automation</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                Engineering workflow efficiencies through custom software development, HR automation, and intelligent tooling.
              </p>
              <p className="text-xs text-[#C28958] font-medium tracking-wide uppercase">
                Fix It • Build It • Automate It
              </p>
            </div>

            {/* Column 2: Case Studies / Social Proof */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wider text-[#C28958] uppercase">
                Success Stories
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://www.linkedin.com/company/leiner-shoes-private-limited/?originalSubdomain=in"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    <span>👞 Leiner Shoes Case Study</span>
                  </a>
                </li>
                <li className="text-xs opacity-75 italic pl-5">
                  Automated overtime logic processing engine.
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Connect */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wider text-[#C28958] uppercase">
                Connect & Support
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href="https://www.linkedin.com/in/arr-automation-88aa3839b/" // Replace with your LinkedIn URL
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1.5"
                  >
                    🔗 Founder LinkedIn
                  </a>
                </li>
                <li className="pt-1">
                  <a 
                    href="mailto: arrautomation001@gmail.com" // Replace with your support email
                    className="hover:text-white hover:underline transition-colors block text-xs"
                  >
                    ✉️ arrautomation001@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:info@leinershoes.com" // Replace with client communication email if applicable
                    className="hover:text-white hover:underline transition-colors block text-xs opacity-80"
                  >
                    💼 https://www.leinershoes.com/
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Quick Application Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wider text-[#C28958] uppercase">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Back to Top</a></li>
                <li><a href="#case-study" className="hover:text-white transition-colors">Case Study</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="https://arrautomation.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium text-[#C28958]">arrautomation.com</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-[#C28958]/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-70">
            <p>© 2026 ARR Automation. All Rights Reserved.</p>
            <p className="italic">Designed for secure, enterprise-grade HR computation data processing.</p>
          </div>

        </div>
      </footer>
    </main>
  );
}