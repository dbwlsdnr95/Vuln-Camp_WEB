'use client';

import {
    Container,
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Group,
    Anchor,
    Center,
    Box
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }
        alert(`'${email}'계정으로 비밀번호 재설정 링크를 발송했습니다.`);
    };

    return (
        <Container size={420} my={80}>
            <Title ta="center" order={1} mb="md" style={{ fontFamily: 'Outfit, sans-serif' }}>
                비밀번호 찾기
            </Title>
            <Text c="dimmed" size="sm" ta="center" mb={40}>
                가입하신 이메일 주소를 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput
                    label="이메일"
                    placeholder="you@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <Button fullWidth mt="xl" color="dark" onClick={handleSubmit}>
                    재설정 링크 발송
                </Button>

                <Group justify="center" mt="xl">
                    <Anchor component={Link} href="/login" c="dimmed" size="sm">
                        <Center inline>
                            <IconArrowLeft size={12} stroke={1.5} />
                            <Box ml={5}>로그인 페이지로 돌아가기</Box>
                        </Center>
                    </Anchor>
                </Group>
            </Paper>
        </Container>
    );
}
