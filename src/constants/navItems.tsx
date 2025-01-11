import { Group, Text } from '@mantine/core';
import {
  IconAward,
  IconHome,
  IconPacman,
  IconRocket,
} from '@tabler/icons-react';

export const navItems = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/ask', label: 'Ask', icon: IconRocket },
  { link: '/live', label: 'Live', icon: IconAward },
  { link: '/past', label: 'Past', icon: IconPacman },
];
