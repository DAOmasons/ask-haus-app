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
import { useAccount } from 'wagmi';
import { useTx } from '../hooks/useTx';
import { createPollArgs } from '../utils/factory';
import { contentProtocol, HolderType } from '../constants/enum';
import { ADDR } from '../constants/address';
import { notifications } from '@mantine/notifications';
import { charLimit } from '../utils/helpers';
import factory from '../abi/FastFactory.json';
import { Times } from '../utils/time';
import { useState } from 'react';

export const CreatePoll = () => {
  const { tx } = useTx();
  const navigate = useNavigate();
  const location = useLocation();
  const formIndex = location.pathname.split('/').slice(-1)[0];
  const [pollTag, setPollTag] = useState<string | undefined>();

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
      pollLink: '',
      choices: [],
    },
    validate: zodResolver(createPollSchema2),
    validateInputOnBlur: true,
  });

  const handleCreatePoll = async () => {
    const result = step2Form.validate();

    // if (result.hasErrors) {
    notifications.show({
      title: 'Error',
      message: 'Validation error',
      color: 'red',
    });
    // return;
    // }

    try {
      const startTime =
        step1Form.values.time === 'Custom'
          ? Math.floor(step1Form.values.customTimeStart.getTime() / 1000)
          : 0;
      const duration =
        step1Form.values.time === 'Custom'
          ? Math.floor(step1Form.values.customTimeEnd.getTime() / 1000)
          : Times[step1Form.values.time as unknown as keyof typeof Times];

      const args = await createPollArgs({
        pollMetadata: {
          title: step1Form.values.title,
          description: step2Form.values.description,
          link: step2Form.values.pollLink,
          contentType: 'onchain',
          answerType: step1Form.values.answerType,
          requestComment: false,
        },
        duration: duration,
        autostart: true,
        startTime: startTime,
        holderType:
          step1Form.values.tokenType === 'Both'
            ? HolderType.Both
            : step1Form.values.tokenType === 'Shares'
              ? HolderType.Share
              : step1Form.values.tokenType === 'Loot'
                ? HolderType.Loot
                : 0,
        dao: ADDR.DAO,
        blockTimestamp: 'now',
        formChoices: step2Form.values.choices,
        contentType: 'onchain',
      });

      tx({
        writeContractParams: {
          abi: factory,
          functionName: 'buildContest',
          address: ADDR.FACTORY,
          args,
        },
        writeContractOptions: {
          onPollSuccess() {},
        },
      });
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: charLimit(error.message, 128),
        color: 'red',
      });
      console.error(error);
    }
  };

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
              handleSubmit={handleCreatePoll}
            />
          }
        />
        <Route path="*" element={<Navigate to="0" replace />} />
      </Routes>
    </CenterLayout>
  );
};
