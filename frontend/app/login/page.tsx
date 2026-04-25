'use client';

import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Group,
    Anchor,
    Stack,
    Divider,
    Box
} from '@mantine/core';
import Link from 'next/link';
import { IconBrandGoogle, IconBrandApple } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            login(email, password);
        } else {
            alert('아이디와 비밀번호를 입력해주세요.');
        }
    };

    return (
        <Container size={420} my={80}>
            <Title ta="center" order={1} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                로그인
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb={40}>
                VULN CAMP 계정으로 로그인하여 다양한 혜택을 누리세요.
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Stack>
                    <TextInput
                        label="이메일"
                        placeholder="you@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                    />
                    <PasswordInput
                        label="비밀번호"
                        placeholder="비밀번호를 입력하세요"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                    />

                    <Group justify="space-between" mt="xs">
                        <Anchor component={Link} href="/forgot-password" size="xs" c="dimmed">
                            비밀번호를 잊으셨나요?
                        </Anchor>
                    </Group>

                    <Button fullWidth mt="xl" color="dark" onClick={handleLogin}>
                        로그인
                    </Button>
                </Stack>

                <Divider label="또는" labelPosition="center" my="lg" />

                <Group grow mb="md" mt="md">
                    <Button variant="default" leftSection={<IconBrandGoogle size={16} />}>
                        구글
                    </Button>
                    <Button variant="default" leftSection={<IconBrandApple size={16} />}>
                        애플
                    </Button>
                </Group>

                <Text ta="center" mt="md" size="xs" c="dimmed">
                    계정이 없으신가요?{' '}
                    <Anchor component={Link} href="/signup" fw={700}>
                        회원가입
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}
