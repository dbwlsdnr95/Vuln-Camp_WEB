import { createTheme } from '@mantine/core';

export const theme = createTheme({
    primaryColor: 'forest-green',
    colors: {
        // Darker Forest Green Palette specifically tuned for visibility
        'forest-green': [
            '#ebfcf5', // 0
            '#dff7ea', // 1
            '#bfeDD3', // 2
            '#9ae3ba', // 3
            '#7adbfa', // 4
            '#41b16b', // 5 - previously too light, made darker
            '#2ea05b', // 6 - standard green
            '#2E7D32', // 7 - PRIMARY (Deep Forest Green) - High Contrast
            '#1b5e20', // 8 - Darker
            '#14532d', // 9 - Darkest
        ],
        'nature': [
            "#eef9f2",
            "#dcf1e3",
            "#b4e0c4",
            "#8acea3",
            "#65bf86",
            "#4eb674",
            "#41b16b",
            "#319859",
            "#27874d",
            "#1a7440"
        ],
        'campfire-orange': [
            '#fff4e1',
            '#ffeecb',
            '#ffdf9a',
            '#ffcf64',
            '#ffc236',
            '#ffb91a',
            '#ffb509',
            '#e39e00',
            '#ca8c00',
            '#b07800',
        ],
    },
    primaryShade: { light: 7, dark: 8 }, // Force usage of darker shades (7/8)
    fontFamily: 'Inter, sans-serif',
    headings: {
        fontFamily: 'Outfit, sans-serif',
    },
});
