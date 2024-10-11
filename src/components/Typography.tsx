import { Text, TextProps, Title, TitleProps } from '@mantine/core';
import { ReactNode } from 'react';
import globalClasses from '../styles/global.module.css';

export const Bold = ({ children }: { children: ReactNode }) => (
  <Text component="span" fw={900} fz="inherit">
    {children}
  </Text>
);

export const Italic = ({ children }: { children: ReactNode }) => (
  <Text component="span" fw={'inherit'} fz="inherit" fs="italic">
    {children}
  </Text>
);

export const BigTitle = (props: TitleProps) => (
  <Title order={1} {...props} classNames={{ root: globalClasses.bigTitle }} />
);

export const SectionText = ({
  ...props
}: TextProps & { children?: ReactNode }) => (
  <Text {...props} classNames={{ root: globalClasses.sectionText }} />
);
