'use client';

import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    PasswordInput,
    Button,
    Checkbox,
    Stack,
    Group,
    Anchor
} from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agree, setAgree] = useState(false);

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!agree) {
            alert('이용약관에 동의해야 합니다.');
            return;
        }

        // Real Signup via API
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.email, // Using email as username
                    password: formData.password
                }),
            });

            if (res.ok) {
                alert('회원가입이 완료되었습니다!');

                // Optional: Store in localStorage for Admin page visibility (hybrid approach)
                // We keep this for now so the Admin page (which uses localStorage) still shows the new user immediately.
                // In a full migration, Admin page should also fetch from API.
                const newUser = {
                    id: Date.now().toString(),
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    joinedAt: new Date().toISOString().split('T')[0]
                };
                const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
                localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));

                router.push('/login');
            } else {
                const errorMsg = await res.text();
                alert(`회원가입 실패: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <Container size={420} my={80}>
            <Title ta="center" order={1} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                회원가입
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb={40}>
                VULN CAMP의 새로운 멤버가 되어보세요.
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <Stack>
                    <TextInput
                        label="이름"
                        placeholder="홍길동"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
                    />
                    <TextInput
                        label="이메일"
                        placeholder="you@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
                    />
                    <PasswordInput
                        label="비밀번호"
                        placeholder="비밀번호 (8자 이상)"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.currentTarget.value })}
                    />
                    <PasswordInput
                        label="비밀번호 확인"
                        placeholder="비밀번호 재입력"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.currentTarget.value })}
                    />

                    <Checkbox
                        label="이용약관 및 개인정보 처리방침에 동의합니다."
                        checked={agree}
                        onChange={(e) => setAgree(e.currentTarget.checked)}
                        mt="sm"
                    />

                    <Button fullWidth mt="xl" color="dark" onClick={handleSubmit}>
                        가입하기
                    </Button>
                </Stack>

                <Text ta="center" mt="md" size="xs" c="dimmed">
                    이미 계정이 있으신가요?{' '}
                    <Anchor component={Link} href="/login" fw={700}>
                        로그인
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}
