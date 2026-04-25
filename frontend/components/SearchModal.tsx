'use client';

import { Modal, TextInput, Stack, Text, Group, UnstyledButton, Image } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { products } from '@/data/products';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchModalProps {
    opened: boolean;
    close: () => void;
}

export function SearchModal({ opened, close }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState(products);
    const router = useRouter();

    useEffect(() => {
        if (!query) {
            setFiltered([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        setFiltered(products.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        ));
    }, [query]);

    const handleNavigate = (id: string) => {
        router.push(`/products/${id}`);
        close();
        setQuery('');
    };

    return (
        <Modal
            opened={opened}
            onClose={close}
            title="Search Products"
            size="lg"
            radius="md"
            padding="xl"
        >
            <TextInput
                placeholder="Search tents, chairs, gear..."
                leftSection={<IconSearch size={16} />}
                data-autofocus
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                size="md"
                mb="lg"
            />

            {query && filtered.length === 0 && (
                <Text c="dimmed" ta="center" py="xl">No results found.</Text>
            )}

            <Stack gap="sm">
                {filtered.map(product => (
                    <UnstyledButton
                        key={product.id}
                        onClick={() => handleNavigate(product.id)}
                        style={{ padding: '10px', borderRadius: '8px' }}
                        className="hover:bg-gray-50"
                    >
                        <Group>
                            <Image src={product.image} w={50} h={50} radius="sm" fit="cover" alt="img" />
                            <div>
                                <Text fw={600} size="sm">{product.title}</Text>
                                <Text size="xs" c="dimmed">{product.category}</Text>
                            </div>
                        </Group>
                    </UnstyledButton>
                ))}
            </Stack>
        </Modal>
    );
}
