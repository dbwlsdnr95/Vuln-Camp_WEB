'use client';

import { Card, Image, Text, Group, Badge, ActionIcon, Button } from '@mantine/core'; // Ensure ActionIcon is imported
import { useCart } from '../context/CartContext';
import { IconPlus } from '@tabler/icons-react';

interface ProductCardProps {
    image: string;
    title: string;
    category: string;
    price: number;
    isNew?: boolean;
}

export function ProductCard({ image, title, category, price, isNew }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem({ id: title, title, price, image, category });
    };

    return (
        <Card padding="0" radius="0" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }} className="group">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <Image
                    src={image}
                    height={400}
                    alt={title}
                    fit="cover"
                    style={{ transition: 'transform 0.5s ease' }}
                    className="hover-zoom"
                />
                {isNew && (
                    <Badge
                        color="white"
                        variant="filled"
                        radius="0"
                        size="sm"
                        c="black"
                        style={{ position: 'absolute', top: 12, left: 12, borderRadius: 0, zIndex: 10 }}
                    >
                        NEW ARRIVAL
                    </Badge>
                )}
                {/* Floating Add Button */}
                <ActionIcon
                    variant="filled"
                    color="white"
                    size="lg"
                    style={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        zIndex: 10,
                        color: 'black',
                        opacity: 0,
                        transition: 'opacity 0.2s ease'
                    }}
                    className="group-hover:opacity-100"
                    onClick={handleAddToCart}
                >
                    <IconPlus size={18} />
                </ActionIcon>
            </div>

            <Group justify="space-between" mt="md" align="flex-start">
                <div style={{ width: '100%' }}>
                    <Text size="xs" c="gray.6" tt="uppercase" fw={500} mb={6} style={{ letterSpacing: '0.5px' }}>
                        {category}
                    </Text>
                    <Text fw={400} size="xl" style={{ lineHeight: 1.3, fontFamily: 'Outfit, sans-serif' }}>
                        {title}
                    </Text>
                    <Text fw={400} size="md" mt={8} c="dark.9" style={{ fontFamily: 'Inter, sans-serif' }}>
                        KRW {price.toLocaleString()}
                    </Text>
                </div>
            </Group>
        </Card>
    );
}
