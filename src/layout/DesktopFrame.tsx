import { Box, Flex, Image } from '@mantine/core';
import { LinesBg } from './LinesBg';

import layoutClasses from '../styles/Layout.module.css';
import { DesktopNav } from './DesktopNav';
import askImage from '../assets/askHausAsk.webp';
import homeImage from '../assets/askHausHome.webp';
import liveImage from '../assets/askHausLive.webp';
import pastImage from '../assets/askHausPast.webp';
import dorksImage from '../assets/askHausGeek.webp';
import NotFoundImage from '../assets/askHaus404.webp';
import createContestImage from '../assets/askHausCreateContest.webp';
import createPollImage from '../assets/askHausCreatePoll.webp';
import pollImage from '../assets/askHausPoll.webp';
import contestImage from '../assets/askHausContest.webp';
import { useLocation } from 'react-router-dom';

const getRouteImage = (path: string) => {
  if (path === '/') return homeImage;
  if (path === '/ask') return askImage;
  if (path === '/live') return liveImage;
  if (path === '/past') return pastImage;
  if (path === '/dorks') return dorksImage;
  if (path.includes('/create-contest')) return createContestImage;
  if (path.includes('/create-poll')) return createPollImage;
  if (path.includes('/poll')) return pollImage;
  if (path.includes('/contest')) return contestImage;
  return NotFoundImage;
};

export const DesktopFrame = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <Flex className={layoutClasses.desktopContainer}>
      <Box className={layoutClasses.desktopFrame}>
        <DesktopNav />
        <LinesBg />
        {children}
      </Box>
      <Image
        className={layoutClasses.desktopImg}
        src={getRouteImage(location.pathname)}
      />
    </Flex>
  );
};
