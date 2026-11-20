"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useSiteSettings } from "@/hooks/use-site-settings";

function BrandFaviconInner() {
  const pathname = usePathname();
  const { faviconUrl } = useSiteSettings();

  React.useEffect(() => {
    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
    const targetUrl = isAdminRoute
      ? "/admin-icon/icon-192.png?v=20261121"
      : faviconUrl;

    if (!targetUrl) return;

    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']")
    );

    if (links.length === 0) {
      const link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
      links.push(link);
    }

    // Keep the admin favicon isolated from the storefront's dynamic favicon.
    // Next.js metadata and the client-side brand setting can otherwise compete.
    for (const link of links) {
      link.href = targetUrl;
    }
  }, [faviconUrl, pathname]);

  return null;
}

export function BrandFavicon() {
  return (
    <React.Suspense fallback={null}>
      <BrandFaviconInner />
    </React.Suspense>
  );
}
