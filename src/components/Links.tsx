import { Text, TextProps } from '@mantine/core';
import { Link } from 'react-router-dom';
import globalClasses from '../styles/global.module.css';

export const AppLink = ({
  url,
  children,
  external = false,
  ...textProps
}: TextProps & {
  url: string;
  children: React.ReactNode;
  external?: boolean;
}) => {
  if (external) {
    return (
      <Text
        className={globalClasses.appLink}
        {...textProps}
        component="a"
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </Text>
    );
  }
  return (
    <Text
      className={globalClasses.appLink}
      {...textProps}
      component={Link}
      to={url}
    >
      {children}
    </Text>
  );
};
