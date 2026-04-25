import { Container, Title, Text, Button, Overlay } from '@mantine/core';

export function Hero() {
    return (
        <div style={{
            position: 'relative',
            height: '75vh', // Slightly reduced as requested
            display: 'flex',
            alignItems: 'flex-end',
            paddingBottom: '80px',
            backgroundImage: 'url(https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Overlay gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 60%)" opacity={1} zIndex={0} />
            <Container size="xl" style={{ position: 'relative', zIndex: 1, width: '100%', paddingLeft: 40, paddingRight: 40 }}>
                <div style={{ maxWidth: 800 }}>
                    <Text c="white" fw={600} size="sm" tt="uppercase" mb="md" style={{ letterSpacing: '4px' }}>
                        The Outdoors, Elevated.
                    </Text>
                    <Title c="white" fw={700} style={{ fontSize: '4.5rem', lineHeight: 1, marginBottom: 30, fontFamily: 'Outfit, sans-serif' }}>
                        자연과<br />
                        일상이<br />
                        하나되는 순간.
                    </Title>
                    <Button
                        component="a"
                        href="/products"
                        variant="white"
                        color="dark"
                        size="md"
                        radius="0"
                        h={50}
                        px={40}
                        style={{
                            color: 'black',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            border: 'none'
                        }}
                    >
                        View Collection
                    </Button>
                </div>
            </Container>
        </div>
    );
}
