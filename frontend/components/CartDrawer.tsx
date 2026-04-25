'use client';

import { Drawer, ScrollArea, Stack, Group, Text, Button, ActionIcon, Divider, Box, Image, NumberInput, rem } from '@mantine/core';
import { useCart } from '../context/CartContext';
import { IconTrash, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeItem, total } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        toggleCart();
        router.push('/checkout');
    };

    return (
        <Drawer
            opened={isCartOpen}
            onClose={toggleCart}
            position="right"
            size="md" // 440px default
            padding="xl"
            title={<Text fw={700} size="lg" style={{ fontFamily: 'Outfit, sans-serif' }}>Shopping Cart</Text>}
            overlayProps={{ opacity: 0.5, blur: 4 }}
            transitionProps={{ duration: 250, timingFunction: 'ease' }}
        >
            <Stack h="calc(100vh - 100px)" justify="space-between">
                <ScrollArea h="100%" type="scroll" offsetScrollbars>
                    {items.length === 0 ? (
                        <Text c="dimmed" ta="center" mt="xl">Your cart is empty.</Text>
                    ) : (
                        <Stack gap="xl">
                            {items.map((item) => (
                                <Group key={item.id} align="start" wrap="nowrap">
                                    <Box w={80} h={80} style={{ borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                                        <Image src={item.image} w="100%" h="100%" fit="cover" alt={item.title} />
                                    </Box>
                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" fw={500} lineClamp={2}>{item.title}</Text>
                                        <Text size="xs" c="dimmed" mb={4}>{item.category}</Text>
                                        <Text size="sm" fw={700}>{item.price.toLocaleString()} 원</Text>
                                        <Group mt={8}>
                                            <Text size="xs">Qty: {item.quantity}</Text>
                                            <ActionIcon variant="subtle" color="gray" size="xs" onClick={() => removeItem(item.id)}>
                                                <IconTrash style={{ width: rem(14), height: rem(14) }} />
                                            </ActionIcon>
                                        </Group>
                                    </div>
                                </Group>
                            ))}
                        </Stack>
                    )}
                </ScrollArea>

                <div>
                    <Divider my="md" />
                    <Group justify="space-between" mb="lg">
                        <Text fw={700} size="lg">Total</Text>
                        <Text fw={700} size="xl">{total.toLocaleString()} 원</Text>
                    </Group>
                    <Button fullWidth size="lg" color="dark" disabled={items.length === 0} onClick={handleCheckout}>
                        Checkout
                    </Button>
                </div>
            </Stack>
        </Drawer>
    );
}
