"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaUser, FaList, FaPhoneAlt } from "react-icons/fa";
import { RiDraftLine } from "react-icons/ri";
import Logo from "./Logo";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  PencilLine,
  Search,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";
import { TUserProfile } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import UpdateProfile from "../UpdateProfile";

const Drafts = () => {
  return (
    <div className="relative cursor-pointer">
      <RiDraftLine className="text-lg md:text-xl text-white" />
      <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white rounded-full px-1">
        0
      </span>
    </div>
  );
};

const Navbar = ({ myProfile }: { myProfile: TUserProfile | null }) => {
  const { user } = useUser();
  const pathname = usePathname();
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const hideSearchBar = pathname === "/ideas" || pathname === "/blogs";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    let updatedHistory = [
      searchTerm,
      ...searchHistory.filter((item) => item !== searchTerm),
    ];
    if (updatedHistory.length > 5) updatedHistory = updatedHistory.slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    router.push(`/ideas?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Ideas", path: "/ideas" },
    { label: "Blogs", path: "/blogs" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategory("");
      }
    }
    if (category === "open") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [category]);

  const AvatarComponent = (
    <Avatar className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] cursor-pointer">
      <AvatarImage
        src={myProfile?.image || "https://github.com/shadcn.png"}
        className="rounded-full border border-green-500"
      />
      <AvatarFallback>Profile Image</AvatarFallback>
    </Avatar>
  );
  return (
    <div className={`bg-green-700 w-full z-50 transition-all duration-300 fixed ${isScrolled ? 'md:py-0' : 'py-2'}`}>
      {/* Top nav */}
      <div className={`flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-2 md:px-4 container mx-auto transition-all duration-300 ${isScrolled ? 'md:h-0 md:overflow-hidden md:opacity-0' : 'py-2 opacity-100'}`}>
        {/* Logo */}
        <div className={`flex items-center justify-between ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-bold`}>
          <div>
            <Logo />
          </div>
          <div className="flex items-center gap-6 md:hidden">
            <Drafts />
            <button
              className=" text-white mr-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Search bar */}

        {!hideSearchBar && (
          <div className="flex w-full md:w-[40%] mt-2 md:mt-0 rounded-full relative">
            <Input
              placeholder="Search Idea..."
              className="rounded-r-3xl text-white placeholder:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              className="rounded-r-full cursor-pointer bg-green-600 hover:bg-green-500 absolute right-0"
              size="icon"
              onClick={handleSearch}>
              <Search size={18} />
            </Button>
          </div>
        )}
        {hideSearchBar && (
          <div className="hidden lg:flex w-full md:w-[40%] mt-2 md:mt-0 border border-green-600 overflow-hidden rounded-full rounded-l-none">
            <Input
              placeholder="Search Idea..."
              className="rounded-l-none rounded-r-none text-white placeholder:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <Button
              className="rounded-l-none rounded-r-full cursor-pointer bg-green-500 hover:bg-green-400"
              size="icon"
              onClick={handleSearch}>
              <Search size={18} />
            </Button>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-2">
            <ul className="flex flex-col gap-2 font-medium text-white text-base">
              {menuItems.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.path}
                    className={`block py-1 ${
                      pathname === item.path
                        ? "text-amber-500 font-semibold"
                        : ""
                    } ${
                      pathname === "ideas" && item.path === "/ideas"
                        ? "text-amber-500"
                        : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {user && (
                <li className="block md:hidden">
                  <Link
                    href={`/${user.role}/dashboard`}
                    className={`block py-1 ${
                      pathname === `/${user.role}/dashboard`
                        ? "text-green-500 font-semibold"
                        : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
            <div>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-semibold w-full text-left mt-2">
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-green-500 text-white px-4 py-2 rounded-md font-semibold mt-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Icons */}
        <div className="hidden md:flex items-center gap-3 md:gap-6 mt-2 md:mt-0">
          {user ? (
            <div className="h-14 w-24 flex items-center justify-center">
              <Popover>
                <PopoverTrigger asChild>{AvatarComponent}</PopoverTrigger>
                <PopoverContent className="w-64 md:w-80 border mt-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      {AvatarComponent}
                    </div>
                    <h1 className="text-lg md:text-xl font-semibold py-2">
                      {myProfile?.name}
                    </h1>
                    <p className="text-xs md:text-sm text-green-500 relative bottom-3">
                      {myProfile?.role}
                    </p>
                    {myProfile && <UpdateProfile {...myProfile} />}
                  </div>
                  <ul className="mt-4 divide-y divide-gray-200">
                    <li className="hover:bg-green-500 hover:text-white py-1 px-2">
                      <Link href="/ideas" className="flex gap-2 items-center">
                        <Palette size={18} /> All Ideas
                      </Link>
                    </li>
                    <li className="hover:bg-green-500 hover:text-white py-1 px-2">
                      <Link
                        href={`/${user?.role}/dashboard`}
                        className="flex gap-2 items-center">
                        <LayoutDashboard size={18} /> Dashboard
                      </Link>
                    </li>
                    <li className="hover:bg-green-500 hover:text-white py-1 px-2">
                      <Link href="/about" className="flex gap-2 items-center">
                        <Info size={18} /> About
                      </Link>
                    </li>
                    <li className="hover:bg-green-500 hover:text-white py-1 px-2">
                      <Link href="/blogs" className="flex gap-2 items-center">
                        <PencilLine size={18} /> Blogs
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="hover:bg-green-500 hover:text-white py-1 px-2 flex gap-2 cursor-pointer items-center">
                      <LogOut size={18} /> Logout
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Link
              href={"/login"}
              className="flex items-center justify-center h-14 w-24 gap-2 text-white hover:text-amber-500">
              <FaUser />
              <span className="text-xs md:text-sm">Account</span>
            </Link>
          )}
          <div className="relative">
            <Drafts />
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className={`px-2 md:px-4 py-1 hidden lg:flex items-center justify-center text-xs md:text-sm text-white container mx-auto text-center transition-all duration-300 ${isScrolled ? 'md:h-0 md:overflow-hidden md:opacity-0' : 'opacity-100'}`}>
        <span className="font-semibold ml-2 md:ml-6 mr-2">
          Popular Searches:
        </span>
        <span className="space-x-2 md:space-x-3">
          {searchHistory.length === 0 && (
            <span className="italic text-white">No recent searches</span>
          )}
          {searchHistory.slice(0, 3).map((item) => (
            <span
              key={item}
              className="hover:underline cursor-pointer"
              onClick={() => setSearchTerm(item)}>
              {item} ,
            </span>
          ))}
        </span>
      </div>

      <Separator className={`transition-all duration-300 ${isScrolled ? 'md:opacity-0' : 'opacity-100'}`} />

      {/* Bottom nav */}
      <div className={`flex flex-row items-center justify-between px-2 md:px-4 py-2 text-xs md:text-sm container mx-auto transition-all duration-300 ${isScrolled ? 'md:py-2' : ''}`}>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setCategory((c) => (c === "open" ? "" : "open"))}
            className="px-2 border-r-2 border-green-500 text-white relative cursor-pointer text-xs md:text-sm flex items-center gap-2 w-48">
            <FaList />
            <span>Browse Categories</span>
            <ChevronDown />
          </button>
          {category === "open" && (
            <div className="absolute left-0 mt-2 bg-[#eafcfb] shadow-lg rounded w-48">
              {["All", "Energy", "Waste", "Transportation"].map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    router.push(
                      item === "All"
                        ? "/ideas"
                        : `/ideas?category=${encodeURIComponent(
                            item.toLowerCase()
                          )}`
                    );
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-amber-100 m-2 rounded-md">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full hidden md:flex items-center justify-center lg:pl-36">
          <ul className="flex items-center space-x-4 md:space-x-6 font-medium text-white text-base md:text-lg">
            {menuItems.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.path}
                  className={`${
                    pathname === item.path
                      ? "text-amber-500 font-semibold"
                      : "hover:text-amber-500"
                  } ${
                    pathname === "ideas" && item.path === "/ideas"
                      ? "text-green-500"
                      : ""
                  }`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center md:justify-end md:w-1/4 text-white">
          <FaPhoneAlt />
          <span className="text-xs lg:text-base">+880 1636 279878</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
