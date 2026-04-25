'use client';

import { Container, Title, TextInput, Textarea, Button, Group, Paper, FileInput } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QnaWritePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('author', 'Guest'); // Mock User
            if (file) {
                formData.append('file', file);
            }

            await fetch('http://localhost:8080/api/qna', {
                method: 'POST',
                body: formData, // No Content-Type header manually set for FormData
            });
            router.push('/qna');
        } catch (error) {
            console.error('Failed to submit:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container size="md" py={80} mt={50}>
            <Title order={1} mb="xl" style={{ fontFamily: 'Outfit, sans-serif' }}>문의 작성</Title>

            <Paper withBorder p="xl" radius="md">
                <TextInput
                    label="제목"
                    placeholder="문의하실 내용을 요약해주세요"
                    mb="md"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <TextInput
                    label="작성자"
                    placeholder="이름"
                    mb="md"
                    defaultValue="Guest" // Mock User
                    readOnly
                />
                <Textarea
                    label="내용"
                    placeholder="상세한 내용을 적어주세요"
                    minRows={6}
                    mb="md"
                    required
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                />

                <FileInput
                    label="첨부파일"
                    placeholder="파일을 선택하세요"
                    mb="xl"
                    value={file}
                    onChange={setFile}
                />

                <Group justify="flex-end">
                    <Button variant="default" onClick={() => router.back()}>취소</Button>
                    <Button color="dark" loading={isSubmitting} onClick={handleSubmit}>등록하기</Button>
                </Group>
            </Paper>
        </Container>
    );
}
