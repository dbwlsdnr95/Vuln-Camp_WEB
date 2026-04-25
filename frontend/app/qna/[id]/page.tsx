'use client';

import { Container, Title, Text, Button, Group, Paper, Divider, Badge } from '@mantine/core';
import { useRouter, useParams } from 'next/navigation';

import { useState, useEffect } from 'react';

export default function QnaDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [post, setPost] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:8080/api/qna/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Post not found');
                return res.json();
            })
            .then(data => setPost(data))
            .catch(err => {
                console.error(err);
                setError('게시글을 찾을 수 없습니다.');
            });
    }, [id]);

    if (error) {
        return <Container size="lg" py={80} mt={50}><Text color="red">{error}</Text><Button onClick={() => router.push('/qna')} mt="md">목록으로</Button></Container>;
    }

    if (!post) {
        return <Container size="lg" py={80} mt={50}><Text>Loading...</Text></Container>;
    }

    return (
        <Container size="lg" py={80} mt={50}>
            <Group justify="space-between" align="start" mb="lg">
                <div style={{ flex: 1 }}>
                    <Group mb="xs">
                        <Badge color={post.status === 'Answered' ? 'green' : 'gray'}>{post.status}</Badge>
                        <Text c="dimmed" size="sm">{post.createdAt}</Text>
                    </Group>
                    <Title order={2} style={{ fontFamily: 'Outfit, sans-serif' }}>{post.title}</Title>
                    <Text size="sm" mt={4}>By {post.author}</Text>
                </div>
            </Group>

            <Paper withBorder p={40} radius="md" mb="xl" style={{ minHeight: '200px' }}>
                {/* VULNERABILITY: Renders raw HTML using dangerouslySetInnerHTML */}
                <div
                    style={{ lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </Paper>

            {post.attachmentPath && (
                <Paper withBorder p="md" mb="xl">
                    <Text fw={700} mb="xs">첨부파일</Text>
                    <Text component="a" href={`http://localhost:8080/api/qna/download?filename=${post.attachmentPath}`} c="blue" td="underline">
                        {post.attachmentPath} (다운로드)
                    </Text>
                </Paper>
            )}

            {/* Answer Section */}
            {post.answer && (
                <Paper bg="gray.0" p="xl" radius="md" mb="xl">
                    <Text fw={700} mb="sm">관리자 답변</Text>
                    <Text>{post.answer}</Text>
                </Paper>
            )}

            <Group justify="center">
                <Button variant="outline" color="dark" onClick={() => router.push('/qna')}>목록으로</Button>
            </Group>
        </Container>
    );
}
