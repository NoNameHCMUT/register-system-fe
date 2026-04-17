import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";
import { LoginBrand } from "@/features/Login/components/login-brand";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

// Hardcoded for now based on the image
const campaigns = [
  {
    id: 1,
    title: "Summer Literacy Program 2024",
    university: "HO CHI MINH CITY UNIVERSITY OF SOCIAL SCIENCES AND HUMANITIES",
    category: "EDUCATION",
    categoryColor: "bg-blue-600",
    location: "Cu Chi District, HCMC",
    deadline: "June 15",
    tags: ["TEACHING", "CHILDCARE"],
    slotsConfig: "15/20 Filled",
    slotValue: 75,
    image: "src/assets/campaigns/education_campaign_1775894477648.png",
  },
  {
    id: 2,
    title: "Green Mangrove Restoration",
    university: "HO CHI MINH UNIVERSITY OF TECHNOLOGY",
    category: "ENVIRONMENT",
    categoryColor: "bg-red-500",
    location: "Can Gio Biosphere Reserve",
    deadline: "June 20",
    tags: ["PHYSICAL LABOR", "MAPPING"],
    slotsConfig: "8/40 Filled",
    slotValue: 20,
    image: "/assets/campaigns/environment_campaign_1775894497861.png",
  },
  {
    id: 3,
    title: "Digital Inclusion for Seniors",
    university: "HO CHI MINH CITY UNIVERSITY OF SCIENCE",
    category: "TECHNOLOGY",
    categoryColor: "bg-indigo-500",
    location: "District 5, Ho Chi Minh City",
    deadline: "June 12",
    tags: ["IT SKILLS", "PATIENCE"],
    slotsConfig: "28/50 Filled",
    slotValue: 56,
    image: "/assets/campaigns/technology_campaign_1775894515668.png",
  },
  {
    id: 4,
    title: "Rural Health Check-up Tour",
    university: "MEDICINE & PHARMACY UNIVERSITY",
    category: "HEALTH",
    categoryColor: "bg-[#ff7f50]",
    location: "Long An Province",
    deadline: "July 05",
    tags: ["MEDICAL", "FIRST AID"],
    slotsConfig: "45/100 Filled",
    slotValue: 45,
    image: "/assets/campaigns/health_campaign_1775894532902.png",
  },
];

export function StudentHome() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-svh flex-col bg-[#f7f9fc]">
      {/* Header */}
      <header className="border-b border-[#e6eaf0] bg-white sticky top-0 z-50 h-[72px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative h-full">
          <div className="scale-75 origin-left">
            <LoginBrand />
          </div>

          <nav className="hidden md:flex space-x-8 absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
            <a
              href="#"
              className="flex items-center h-full text-[#2890d4] border-b-2 border-[#2890d4] font-semibold px-2"
            >
              Campaigns
            </a>
            <a
              href="#"
              className="flex items-center h-full text-gray-500 hover:text-gray-900 font-medium px-2 border-b-2 border-transparent hover:border-gray-200"
            >
              Activities
            </a>
            <a
              href="#"
              className="flex items-center h-full text-gray-500 hover:text-gray-900 font-medium px-2 border-b-2 border-transparent hover:border-gray-200"
            >
              Volunteers
            </a>
            <a
              href="#"
              className="flex items-center h-full text-gray-500 hover:text-gray-900 font-medium px-2 border-b-2 border-transparent hover:border-gray-200"
            >
              Map
            </a>
          </nav>

          <div className="flex items-center gap-4 text-gray-500 relative">
            <button className="hover:text-gray-900">
              <Bell size={20} />
            </button>
            <div className="relative">
              <button
                className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-700 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <User size={20} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 font-medium">
                      Student Account
                    </div>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2890d4] to-[#00c7d4] text-white py-16 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 max-w-2xl">
            Ignite Change,
            <br />
            One Project at a Time.
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-2xl text-white/90">
            Join thousands of students across the nation in the "Mua He Xanh"
            movement. Find campaigns that match your skills and passion for
            community service.
          </p>

          <div className="flex bg-white rounded-lg p-2 max-w-3xl shadow-lg">
            <div className="flex-grow flex items-center px-4">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Search campaigns, skills, or organizations..."
                className="w-full text-gray-800 outline-none placeholder-gray-400"
              />
            </div>
            <button className="bg-[#2890d4] hover:bg-[#2072a8] text-white font-medium px-8 flex-shrink-0 transition-colors py-3 rounded-md">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 w-full mb-12">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50 border border-transparent hover:border-gray-200 text-gray-800 py-3 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2890d4]">
                <option>Ho Chi Minh City</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              District
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50 border border-transparent hover:border-gray-200 text-gray-800 py-3 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2890d4]">
                <option>All Districts</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
              Campaign Period
            </label>
            <div className="relative">
              <div className="flex items-center w-full bg-gray-50 py-3 pl-4 pr-4 rounded-md text-gray-400">
                <Calendar size={16} className="mr-2" />
                <span className="text-gray-500">Select dates</span>
              </div>
            </div>
          </div>

          <div className="col-span-1 flex items-end">
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-md flex items-center justify-center transition-colors">
              <SlidersHorizontal size={18} className="mr-2 text-[#2890d4]" />
              More Filters
            </button>
          </div>
        </div>
      </section>

      {/* Campaigns Listing */}
      <main className="flex-grow max-w-7xl mx-auto px-4 w-full mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Campaigns</h2>
          <p className="text-gray-500 font-medium text-sm">
            Showing 128 opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Side */}
              <div className="w-full sm:w-2/5 min-h-[200px] relative">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-white text-xs font-bold px-3 py-1 rounded-full ${campaign.categoryColor.startsWith("bg-[") ? campaign.categoryColor : campaign.categoryColor}`}
                  >
                    {campaign.category}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-[#2890d4] text-xs font-bold uppercase tracking-wider mb-2">
                    {campaign.university}
                  </h4>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {campaign.title}
                  </h3>
                  <div className="flex items-start text-gray-500 text-sm mb-2">
                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-start text-gray-500 text-sm mb-4">
                    <Calendar size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>Recruiting until: {campaign.deadline}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {campaign.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-gray-500 uppercase tracking-wider">
                      Volunteer Slots
                    </span>
                    <span className="text-[#2890d4]">
                      {campaign.slotsConfig}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                    <div
                      className="bg-[#2890d4] h-1.5 rounded-full"
                      style={{ width: `${campaign.slotValue}%` }}
                    ></div>
                  </div>
                  <button className="w-full bg-[#2890d4] hover:bg-[#2072a8] text-white font-medium py-2.5 rounded-md transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 mb-8">
          <nav className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex border border-[#2890d4] items-center justify-center rounded bg-[#2890d4] text-white font-medium">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-medium">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-medium">
              3
            </button>
            <span className="w-10 h-10 flex items-center justify-center text-gray-400">
              ...
            </span>
            <button className="w-10 h-10 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-medium">
              12
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ChevronRight size={20} />
            </button>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
