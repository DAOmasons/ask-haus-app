import { Group, Text } from '@mantine/core';
import {
  IconClock,
  IconHome,
  IconListSearch,
  IconUserQuestion,
} from '@tabler/icons-react';

export const navItems = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/ask', label: 'Ask', icon: IconUserQuestion },
  { link: '/live', label: 'Live', icon: IconClock },
  { link: '/past', label: 'Past', icon: IconListSearch },
];
