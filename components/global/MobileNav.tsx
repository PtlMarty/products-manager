"use client";

import { Shop } from "@/types/shop";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MobileNavProps {
  shops: Shop[];
}

const MobileNav = ({ shops }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShopsOpen, setIsShopsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="text-white p-2 hover:bg-gray-700 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-gray-900 z-50 overflow-y-auto">
            <div className="flex flex-col w-full divide-y divide-gray-700">
              <Link
                href="/"
                className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {shops.length > 0 ? (
                <>
                  <div className="flex flex-col w-full">
                    <button
                      onClick={() => setIsShopsOpen(!isShopsOpen)}
                      className="flex items-center justify-between text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 w-full"
                    >
                      <span>Shops</span>
                      {isShopsOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>

                    {isShopsOpen && (
                      <div className="bg-gray-800 w-full border-t border-gray-700">
                        <Link
                          href="/shops"
                          className="text-white font-semibold px-8 py-4 hover:bg-gray-700 active:bg-gray-600 block"
                          onClick={() => setIsOpen(false)}
                        >
                          All Shops
                        </Link>
                        {shops.map((shop) => (
                          <Link
                            key={shop.id}
                            href={`/dashboard/shops/${shop.id}`}
                            className="text-gray-300 px-8 py-4 hover:bg-gray-700 active:bg-gray-600 block border-t border-gray-700"
                            onClick={() => setIsOpen(false)}
                          >
                            {shop.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href="/dashboard"
                    className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/about"
                    className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-white font-semibold px-6 py-4 hover:bg-gray-800 active:bg-gray-700 flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileNav;
