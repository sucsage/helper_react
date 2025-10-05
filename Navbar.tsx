// ตัวอย่าง
// import "./globals.css";
// import Navbar, { NavItem } from "@/components/Navbar";
// import Link from "next/link";
// import Image from "next/image";

// const menu: NavItem[] = [
//   {
//     href: "/about",
//     label: "เกี่ยวกับเรา",
//   },
//   {
//     label: "บริการ",
//     children: [
//       { href: "/services/aed-map", label: "แผนที่ AED" },
//       { href: "/services/training", label: "อบรม CPR/AED", textClass: "text-emerald-700" },
//       { href: "/services/support", label: "ขอสนับสนุนโครงการ" },
//     ],
//   },
//   {
//     label: "ทรัพยากร",
//     children: [
//       { href: "/resources/docs", label: "เอกสาร/คู่มือ" },
//       { href: "https://youtube.com/@phuketaed", label: "วิดีโอ", external: true },
//     ],
//   },
//   { href: "/contact", label: "ติดต่อเรา" },
// ];

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="th">
//       <body>
//         <Navbar
//           items={menu}
//           leftContent={
//             <Link href="/" className="flex items-center gap-2">
//               <Image src="/logo.svg" alt="logo" width={32} height={32} />
//               <span className="text-xl font-bold tracking-tight text-emerald-800">
//                 AED Phuket
//               </span>
//             </Link>
//           }
//           // ปรับธีมได้ตามใจ
//           bgClass="bg-white"
//           borderClass="border-b border-emerald-100"
//           linkClass="text-slate-700"
//           hoverLinkClass="hover:text-emerald-600"
//           activeLinkClass="text-emerald-700 font-semibold"
//           dropdownCardClass="bg-white shadow-xl ring-1 ring-emerald-100"
//           dropdownItemClass="text-slate-700 hover:bg-emerald-50"
//           mobileDividerClass="border-t border-emerald-100"
//         />
//         <main className="min-h-screen">{children}</main>
//         <footer className="bg-slate-50 text-center py-6 text-slate-600">
//           © 2025 AED Phuket
//         </footer>
//       </body>
//     </html>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";

export type NavItem = {
  href?: string;               // เมนูคลิกได้ (optional ถ้ามี children อย่างเดียวก็ได้)
  label: string;               // ข้อความ
  textClass?: string;          // override class ของ label รายเมนู
  children?: NavItem[];        // เมนูย่อย (dropdown)
  external?: boolean;          // ถ้าเป็นลิงก์ออกนอก ให้เปิดแท็บใหม่
};

type NavbarProps = {
  leftContent?: ReactNode;     // ฝั่งซ้าย: โลโก้/ค้นหา/อะไรก็ได้
  items: NavItem[];            // เมนูหลักฝั่งขวา
  className?: string;

  // สี/สไตล์ (ใช้ tailwind class หรือคลาสของคุณเอง)
  bgClass?: string;            // พื้นหลัง navbar
  borderClass?: string;        // เส้นขอบล่าง/บน (ถ้าต้องการ)
  linkClass?: string;          // สไตล์ลิงก์ทั่วไป
  hoverLinkClass?: string;     // สไตล์เมื่อ hover
  activeLinkClass?: string;    // สไตล์ active
  dropdownCardClass?: string;  // พื้นหลังกล่อง dropdown
  dropdownItemClass?: string;  // สไตล์รายการใน dropdown
  mobileDividerClass?: string; // เส้นคั่นใน mobile
};

export default function Navbar({
  leftContent,
  items,
  className = "",

  bgClass = "bg-white",
  borderClass = "border-b border-black/5",
  linkClass = "text-gray-700",
  hoverLinkClass = "hover:text-emerald-600",
  activeLinkClass = "text-emerald-700 font-medium",
  dropdownCardClass = "bg-white shadow-lg ring-1 ring-black/5",
  dropdownItemClass = "text-gray-700 hover:bg-emerald-50",
  mobileDividerClass = "border-t border-black/5",
}: NavbarProps) {
  const pathname = usePathname();
  const [openMobile, setOpenMobile] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null); // สำหรับเปิด dropdown บน desktop (hover/focus)
  const [openMobileKeys, setOpenMobileKeys] = useState<Record<string, boolean>>({}); // สำหรับ mobile accordion

  // ปิดเมนูมือถือเมื่อเปลี่ยนหน้า
  useEffect(() => {
    setOpenMobile(false);
    setOpenMobileKeys({});
  }, [pathname]);

  // ฟังก์ชันเช็ค active (รองรับ startsWith สำหรับหมวดหมู่)
  const isActive = (href?: string) =>
    href ? (pathname === href || pathname.startsWith(href + "/")) : false;

  // สร้าง key ให้เมนูแต่ละอัน (ต้อง unique)
  const keyOf = (base: string, idx: number) => `${base}-${idx}`;

  return (
    <nav className={`${bgClass} ${borderClass} sticky top-0 z-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* แถวบน */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* ซ้าย */}
          <div className="flex items-center gap-3">
            {leftContent ?? (
              <Link href="/" className={`text-xl font-bold ${linkClass} ${hoverLinkClass}`}>
                MySite
              </Link>
            )}
          </div>

          {/* ขวา (Desktop) */}
          <ul className="hidden md:flex items-center gap-6">
            {items.map((item, i) => {
              const k = keyOf("top", i);
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;

              return (
                <li
                  key={k}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenKey(k)}
                  onMouseLeave={() => hasChildren && setOpenKey((prev) => (prev === k ? null : prev))}
                >
                  {/* ปุ่ม/ลิงก์ระดับบน */}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={[
                        "inline-flex items-center gap-2 py-2",
                        item.textClass ?? linkClass,
                        hoverLinkClass,
                        isActive(item.href) ? activeLinkClass : "",
                      ].join(" ")}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onFocus={() => hasChildren && setOpenKey(k)}
                      onBlur={() => hasChildren && setOpenKey((prev) => (prev === k ? null : prev))}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      aria-expanded={hasChildren && openKey === k ? true : undefined}
                    >
                      {item.label}
                      {hasChildren && (
                        <svg
                          className="h-4 w-4 opacity-70"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.146l3.71-3.916a.75.75 0 011.08 1.04l-4.24 4.47a.75.75 0 01-1.08 0l-4.24-4.47a.75.75 0 01.02-1.06z" />
                        </svg>
                      )}
                    </Link>
                  ) : (
                    <button
                      className={[
                        "inline-flex items-center gap-2 py-2",
                        item.textClass ?? linkClass,
                        hoverLinkClass,
                      ].join(" ")}
                      onFocus={() => hasChildren && setOpenKey(k)}
                      onBlur={() => hasChildren && setOpenKey((prev) => (prev === k ? null : prev))}
                      aria-haspopup={hasChildren ? "menu" : undefined}
                      aria-expanded={hasChildren && openKey === k ? true : undefined}
                    >
                      {item.label}
                      {hasChildren && (
                        <svg
                          className="h-4 w-4 opacity-70"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.146l3.71-3.916a.75.75 0 011.08 1.04l-4.24 4.47a.75.75 0 01-1.08 0l-4.24-4.47a.75.75 0 01.02-1.06z" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Dropdown (Desktop) */}
                  {hasChildren && openKey === k && (
                    <div
                      role="menu"
                      className={`${dropdownCardClass} absolute top-5 left-0 mt-2 min-w-52 rounded-xl p-2 z-9`}
                    >
                      {item.children!.map((c, j) => {
                        const ck = keyOf(k, j);
                        const active = isActive(c.href);
                        const cls = [
                          "block rounded-lg px-3 py-2 text-sm",
                          dropdownItemClass,
                          c.textClass ?? "",
                          active ? "font-medium bg-emerald-50" : "",
                        ].join(" ");

                        return c.href ? (
                          <Link
                            key={ck}
                            href={c.href}
                            className={cls}
                            target={c.external ? "_blank" : undefined}
                            rel={c.external ? "noopener noreferrer" : undefined}
                            role="menuitem"
                          >
                            {c.label}
                          </Link>
                        ) : (
                          <div key={ck} className={cls} role="menuitem">
                            {c.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* ปุ่ม Hamburger (Mobile) */}
          <button
            className="md:hidden p-2 rounded hover:bg-black/5"
            onClick={() => setOpenMobile((s) => !s)}
            aria-label="Toggle navigation"
            aria-expanded={openMobile}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {openMobile ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* เมนู Mobile */}
      {openMobile && (
        <div className={`md:hidden ${mobileDividerClass}`}>
          <ul className="px-2 py-2">
            {items.map((item, i) => {
              const k = keyOf("m", i);
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const expanded = !!openMobileKeys[k];

              return (
                <li key={k} className="py-1">
                  <div className="flex items-center justify-between">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className={[
                          "block px-3 py-2 rounded-lg",
                          item.textClass ?? linkClass,
                          hoverLinkClass,
                          isActive(item.href) ? activeLinkClass : "",
                        ].join(" ")}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className={["px-3 py-2", item.textClass ?? linkClass].join(" ")}>
                        {item.label}
                      </span>
                    )}

                    {hasChildren && (
                      <button
                        className="p-2 rounded hover:bg-black/5"
                        onClick={() =>
                          setOpenMobileKeys((s) => ({ ...s, [k]: !s[k] }))
                        }
                        aria-label="Toggle submenu"
                        aria-expanded={expanded}
                      >
                        <svg
                          className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.146l3.71-3.916a.75.75 0 011.08 1.04l-4.24 4.47a.75.75 0 01-1.08 0l-4.24-4.47a.75.75 0 01.02-1.06z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Submenu (Mobile) */}
                  {hasChildren && expanded && (
                    <ul className="mt-1 space-y-1 pl-3">
                      {item.children!.map((c, j) => {
                        const ck = keyOf(k, j);
                        const active = isActive(c.href);

                        return (
                          <li key={ck}>
                            {c.href ? (
                              <Link
                                href={c.href}
                                className={[
                                  "block rounded-lg px-3 py-2 text-sm",
                                  c.textClass ?? linkClass,
                                  hoverLinkClass,
                                  active ? "font-medium bg-emerald-50" : "",
                                ].join(" ")}
                                target={c.external ? "_blank" : undefined}
                                rel={c.external ? "noopener noreferrer" : undefined}
                              >
                                {c.label}
                              </Link>
                            ) : (
                              <div
                                className={[
                                  "block rounded-lg px-3 py-2 text-sm",
                                  c.textClass ?? linkClass,
                                ].join(" ")}
                              >
                                {c.label}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
