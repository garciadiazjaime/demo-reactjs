"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
    const pathname = usePathname();

    const getLinkStyle = (href: string) => ({
        textDecoration: 'none',
        color: pathname === href ? '#ffffff' : '#495057',
        fontWeight: '600',
        fontSize: '18px',
        padding: '16px 32px',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        backgroundColor: pathname === href ? '#007bff' : 'transparent',
        border: pathname === href ? '2px solid #007bff' : '2px solid transparent'
    });

    return (
        <nav style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center'
        }}>
            <Link
                href="/nginx-reverse-proxy"
                style={getLinkStyle("/nginx-reverse-proxy")}
            >
                Home
            </Link>
            <Link
                href="/nginx-reverse-proxy/coupons"
                style={getLinkStyle("/nginx-reverse-proxy/coupons")}
            >
                Coupons
            </Link>
        </nav>
    );
}
