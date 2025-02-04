import { getShopsByUserId } from "@/lib/actions/Shop/getShopsByUserId";
import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import MobileNav from "./MobileNav";

const NavBar = async () => {
  const session = await auth();
  if (!session?.user) return null;

  const shops = await getShopsByUserId(session.user.id);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="rounded-md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-200 hover:text-white font-medium"
            >
              Home
            </Link>
            {shops.length > 0 ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-gray-200 hover:text-white font-medium flex items-center space-x-1">
                    <span>Shops</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border border-gray-700">
                    <DropdownMenuItem className="text-gray-200 hover:bg-gray-300 focus:bg-gray-100 focus:text-black bg-gray-500">
                      <Link href="/shops" className="w-full ">
                        All Shops
                      </Link>
                    </DropdownMenuItem>
                    {shops.map((shop) => (
                      <DropdownMenuItem
                        key={shop.id}
                        className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                      >
                        <Link
                          href={`/dashboard/shops/${shop.id}`}
                          className="w-full"
                        >
                          {shop.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href="/dashboard"
                  className="text-gray-200 hover:text-white font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/about"
                  className="text-gray-200 hover:text-white font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-200 hover:text-white font-medium"
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-200 hover:text-white font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-gray-200 hover:text-white font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileNav shops={shops} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
