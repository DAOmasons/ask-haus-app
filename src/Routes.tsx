import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Live } from './pages/Live';
import { CreatePoll } from './pages/CreatePoll';
import { Poll } from './pages/Poll';
import { Signal } from './pages/Signal';
import { FourOhFour } from './pages/404';
import { Ask } from './pages/Ask';
import { Past } from './pages/Past';
import { CreateContest } from './pages/CreateContest';
import { Contest } from './pages/Contest';

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/signal/:id" element={<Signal />} />
      <Route path="/poll/:id" element={<Poll />} />
      <Route path="/contest/:id" element={<Contest />} />
      {/* <Route path="/create-signal" element={<CreatePoll />} /> */}
      <Route path="/create-poll/*" element={<CreatePoll />} />
      <Route path="/create-contest/*" element={<CreateContest />} />
      <Route path="/ask" element={<Ask />} />
      {/* <Route path="/factory" element={<Factory />} /> */}
      <Route path="/live" element={<Live />} />
      <Route path="/past" element={<Past />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<FourOhFour />} />
    </Routes>
  );
};
