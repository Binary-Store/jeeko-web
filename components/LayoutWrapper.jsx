"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CustomCursor from "@/components/CustomCursor";
import { useEffect, useRef, useState } from "react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const footerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Helper function to check if path is admin-related
  const isAdminPath = (pathname) => {
    const adminPaths = ["/admin", "/dashboard", "/users"];
    return adminPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  };

  const isAdmin = isAdminPath(pathname);

  useEffect(() => {
    if (isAdmin || !footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide header when footer is visible, show when footer is not visible
        setHeaderVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of the footer is visible
      }
    );

    observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, [isAdmin]);

  return (
    <>
      {/* Only show these components for non-admin pages */}
      {!isAdmin && <CustomCursor />}
      {!isAdmin && (
        <Header className={headerVisible ? "" : "hidden"} />
      )}
      {/* Add padding-top to prevent content from being hidden behind fixed header */}
      <div className={!isAdmin ? "pt-28" : ""}>
        {children}
      </div>
      {!isAdmin && <Footer ref={footerRef} />}
    </>
  );
}
