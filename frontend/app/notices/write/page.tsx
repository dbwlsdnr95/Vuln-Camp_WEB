'use client';

import { Container, Title, TextInput, Textarea, Button, Paper, Group } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function NoticeWritePage() {
    const router = useRouter();
    const { user } = useAuth(); // We don't enforce strict admin check here on frontend intentionally
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        if (!title || !content) return alert('제목과 내용을 입력해주세요.');

        try {
            const res = await fetch('http://localhost:8080/api/notices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    author: user?.name || 'Anonymous' // Attacker can be anyone
                }),
            });

            if (res.ok) {
                alert('공지사항이 등록되었습니다.');
                router.push('/notices');
            } else {
                alert('등록 실패');
            }
        } catch (e) {
            console.error(e);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <Container size="sm" py={80} mt={50}>
            <Title order={2} mb="xl">공지사항 작성 (Admin Only?)</Title>
            <Paper withBorder p="xl" radius="md">
                <TextInput
                    label="제목"
                    placeholder="공지 제목"
                    mb="md"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                    label="내용"
                    placeholder="공지 내용"
                    minRows={6}
                    mb="xl"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => router.push('/notices')}>취소</Button>
                    <Button color="red" onClick={handleSubmit}>등록</Button>
                </Group>
            </Paper>
        </Container>
    );
}
