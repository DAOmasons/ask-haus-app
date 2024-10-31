import { Text } from '@mantine/core';
import { BigTitle } from '../components/Typography';
import { CenterLayout } from '../layout/Layout';

export const FourOhFour = () => {
  return (
    <CenterLayout>
      <BigTitle mt="10vh">404</BigTitle>
      <Text fw={700}>Page ain't found, champ</Text>
    </CenterLayout>
  );
};
