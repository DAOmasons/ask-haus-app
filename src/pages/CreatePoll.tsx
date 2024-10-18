import { CenterLayout, CenterPageTitle } from '../layout/Layout';
import { useForm, zodResolver } from '@mantine/form';
import {
  CreatePoll1Values,
  CreatePoll2Values,
  createPollSchema1,
  createPollSchema2,
} from '../schema/form/create';

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { CreatePoll1 } from '../components/form/CreatePoll1';
import { CreatePoll2 } from '../components/form/CreatePoll2';

export const CreatePoll = () => {
  // const { data: walletClient } = useWalletClient();
  // const publicClient = usePublicClient();
  // const { address } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const formIndex = location.pathname.split('/').slice(-1)[0];

  const step1Form = useForm({
    initialValues: {
      title: '',
      answerType: 'Single Choice',
      tokenType: 'Both',
      time: 'One Day',
      customTimeStart: new Date(),
      customTimeEnd: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    validate: zodResolver(createPollSchema1),
    validateInputOnBlur: true,
  });

  const step2Form = useForm({
    initialValues: {
      description: '',
      choices: [],
    },
    validate: zodResolver(createPollSchema2),
    validateInputOnBlur: true,
  });

  // const handleCreatePoll = async () => {
  //   if (!publicClient) return;

  //   const nowInSeconds = Math.floor(Date.now() / 1000);

  //   const pollArgs = pollTestArgs(BigInt(nowInSeconds) - 1n);

  //   const { request } = await publicClient.simulateContract({
  //     account: address,
  //     address: ADDR.FACTORY,
  //     abi: Factory,
  //     functionName: 'buildContest',
  //     args: pollArgs,
  //   });

  //   const hash = await walletClient?.writeContract(request);

  //   if (hash) {
  //     console.log(hash);
  //   }
  // };

  const advanceForm = () => {
    if (formIndex === '0') {
      const result = step1Form.validate();
      if (result.hasErrors) {
        console.error(result.errors);
        return;
      }
    }
    navigate(`/create-poll/1`);
  };

  return (
    <CenterLayout>
      <CenterPageTitle title="Create Poll" />
      <Routes>
        <Route
          path="0"
          element={
            <CreatePoll1
              form={step1Form as unknown as CreatePoll1Values}
              advanceForm={advanceForm}
            />
          }
        />
        <Route
          path="1"
          element={
            <CreatePoll2
              form={step2Form as unknown as CreatePoll2Values}
              prevForm={step1Form}
            />
          }
        />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};
