import { Text, TextProps, Title, TitleProps } from '@mantine/core';
import { ReactNode } from 'react';
import globalClasses from '../styles/global.module.css';

export const Bold = ({
  children,
  ...props
}: { children: ReactNode } & TextProps) => (
  <Text component="span" fw={900} fz="inherit" {...props}>
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

export const SubTitle = (props: TitleProps) => (
  <Title order={2} {...props} classNames={{ root: globalClasses.subTitle }} />
);

export const SectionText = ({
  ...props
}: TextProps & { children?: ReactNode }) => (
  <Text {...props} classNames={{ root: globalClasses.sectionText }} />
);

export const TextButton = ({
  onClick,
  ...props
}: TextProps & { children?: ReactNode; onClick?: () => void }) => (
  <Text
    {...props}
    component="button"
    onClick={onClick}
    classNames={{
      root: globalClasses.textButton,
    }}
  />
);

export const TextLink = () => (
  <Text component="a" classNames={{ root: globalClasses.textLink }} />
);
