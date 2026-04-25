'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Container, Text, Loader, Center, Stack } from '@mantine/core';

export default function LogoutPage() {
    const { logout } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            logout();
        }, 1000); // Short delay for UX

        return () => clearTimeout(timer);
    }, [logout]);

    return (
        <Container size="sm" h="60vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stack align="center">
                <Loader color="dark" type="dots" />
                <Text size="lg" fw={500}>로그아웃 중입니다...</Text>
            </Stack>
        </Container>
    );
}
