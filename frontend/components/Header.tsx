"use client";
import { Group, Burger, Container, Text, Anchor, ActionIcon, Indicator, rem, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconShoppingCart, IconUser, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

const links = [
    { link: '/', label: '홈' },
    { link: '/products', label: '쇼핑하기' },
    { link: '/stories', label: '스토리' },
    { link: '/about', label: '소개' },
    { link: '/notices', label: '공지사항' },
    { link: '/qna', label: '고객센터' },
];

import { useCart } from '../context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';

import { usePathname } from 'next/navigation';

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const [searchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
    const { toggleCart, cartCount } = useCart();
    const { isLoggedIn } = useAuth();
    const pathname = usePathname();
    const isHome = pathname === '/';
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        // 쿠키에서 역할 확인
        fetch('http://localhost:8080/api/role', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserRole(data.role))
            .catch(() => setUserRole(null));
    }, [isLoggedIn, pathname]);

    const headerStyle = {
        height: 80,
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isHome ? 'transparent' : 'white',
        borderBottom: isHome ? '1px solid rgba(255,255,255,0.1)' : '1px solid #eee',
    };

    const textColor = isHome ? 'white' : 'black';

    const items = links.map((link) => (
        <Anchor
            component={Link}
            key={link.label}
            href={link.link}
            c={textColor}
            fw={500}
            fz="sm"
            style={{ textDecoration: 'none' }}
        >
            {link.label}
        </Anchor>
    ));

    return (
        <>
            <header style={headerStyle}>
                <Container size="xl" h="100%">
                    <Group justify="space-between" h="100%">

                        <Group gap={0}>
                            <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" mr="sm" color={textColor} />
                            <Text
                                component={Link}
                                href="/"
                                fw={900}
                                c={textColor}
                                style={{ fontSize: 24, textDecoration: 'none', letterSpacing: -1 }}
                            >
                                VULN CAMP
                            </Text>
                        </Group>

                        <Group gap={30} visibleFrom="xs">
                            {items}
                        </Group>

                        {/* VULNERABILITY CHECKER: Shows current role based on cookie */}
                        {userRole && (
                            <Badge
                                color={userRole === 'admin' ? 'red' : 'gray'}
                                variant={userRole === 'admin' ? 'filled' : 'light'}
                                visibleFrom="xs"
                            >
                                {userRole === 'admin' ? 'ADMIN ACCESS' : 'USER ACCESS'}
                            </Badge>
                        )}

                        <Group gap="xs">
                            <ActionIcon variant="subtle" color={textColor} onClick={openSearch}>
                                <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                            </ActionIcon>

                            <Indicator color="red" size={16} offset={4} label={cartCount} disabled={cartCount === 0} inline zIndex={101}>
                                <ActionIcon variant="subtle" color={textColor} onClick={toggleCart}>
                                    <IconShoppingCart style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                                </ActionIcon>
                            </Indicator>


                            {/* VULN: Admin Page Link - Hidden from UI but visible in source */}
                            <span dangerouslySetInnerHTML={{ __html: '<!-- <a href="/admin">Admin Page</a> -->' }} />

                            <ActionIcon component={Link} href={isLoggedIn ? "/my" : "/login"} variant="subtle" color={textColor}>
                                <IconUser style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                            </ActionIcon>

                            {isLoggedIn && (
                                <ActionIcon component={Link} href="/logout" variant="subtle" color="red" title="로그아웃">
                                    <IconLogout style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Group>
                </Container>
            </header>
            <SearchModal opened={searchOpened} close={closeSearch} />
        </>
    );
}
