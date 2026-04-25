'use client';

import { Container, Title, Table, Button, Group, Text, Pagination, Badge, TextInput } from '@mantine/core';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define Interface for QnA
interface QnaItem {
    id: number;
    title: string;
    author: string;
    createdAt: string;
    status: 'Pending' | 'Answered';
}

export default function QnaPage() {
    const [qnaList, setQnaList] = useState<QnaItem[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [keyword, setKeyword] = useState('');

    // 날짜로 검색
    const fetchQnaDate = () => {
        let url = 'http://localhost:8080/api/qna';
        if (startDate && endDate) {
            url = `http://localhost:8080/api/qna/search?startDate=${startDate}&endDate=${endDate}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => setQnaList(data))
            .catch(err => {
                console.error('Failed to fetch QnA:', err);
                setQnaList([]);
            });
    };

    // 키워드로 검색
    const fetchQnaKeyword = () => {
        if (!keyword) return;
        const url = `http://localhost:8080/api/qna/search/keyword?keyword=${keyword}`;

        fetch(url)
            .then(res => res.json())
            .then(data => setQnaList(data))
            .catch(err => {
                console.error('Failed to fetch QnA:', err);
                setQnaList([]);
            });
    };

    useEffect(() => {
        fetchQnaDate();
    }, []);

    // Pagination State
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(qnaList.length / itemsPerPage);
    const paginatedList = qnaList.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const rows = paginatedList.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>
                <Link href={`/qna/${element.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
                    {element.title}
                </Link>
            </Table.Td>
            <Table.Td>{element.author}</Table.Td>
            <Table.Td>{element.createdAt}</Table.Td>
            <Table.Td>
                <Badge color={element.status === 'Answered' ? 'green' : 'gray'} variant="light">
                    {element.status}
                </Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container size="xl" py={80} mt={50}>
            <Group justify="space-between" mb="xl">
                <div>
                    <Title order={1} mb="xs" style={{ fontFamily: 'Outfit, sans-serif' }}>Support Center</Title>
                    <Text c="dimmed">궁금한 점이 있으신가요? 언제든 문의해주세요.</Text>
                </div>
                <Button component={Link} href="/qna/write" color="dark" size="md">문의하기</Button>
            </Group>

            {/* SEARCH SECTION */}
            <Group mb="md" justify="space-between" align="flex-end">
                {/* 날짜 범위 검색 */}
                <Group align="flex-end">
                    <TextInput
                        label="시작일"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.currentTarget.value)}
                        style={{ width: '150px' }}
                    />
                    <Text pb="xs">~</Text>
                    <TextInput
                        label="종료일"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.currentTarget.value)}
                        style={{ width: '150px' }}
                    />
                    <Button onClick={() => { setActivePage(1); fetchQnaDate(); }} color="red" variant="light">날짜 검색</Button>
                </Group>

                {/* 키워드 검색 */}
                <Group align="flex-end">
                    <TextInput
                        label="내용 검색"
                        placeholder="검색어 입력..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.currentTarget.value)}
                        style={{ width: '200px' }}
                    />
                    <Button onClick={() => { setActivePage(1); fetchQnaKeyword(); }} color="blue" variant="light">내용 검색</Button>
                </Group>
            </Group>

            <Table highlightOnHover verticalSpacing="md" mb="xl">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: '60px' }}>No.</Table.Th>
                        <Table.Th>제목</Table.Th>
                        <Table.Th style={{ width: '100px' }}>작성자</Table.Th>
                        <Table.Th style={{ width: '120px' }}>작성일</Table.Th>
                        <Table.Th style={{ width: '100px' }}>상태</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Group justify="center" mt="xl">
                {totalPages > 0 && (
                    <Pagination
                        total={totalPages}
                        value={activePage}
                        onChange={setActivePage}
                        color="dark"
                    />
                )}
            </Group>
        </Container>
    );
}
