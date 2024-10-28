import { useParams } from 'react-router-dom';

export const Poll = () => {
  const { id } = useParams();
  console.log('id', id);
  return <div>Poll</div>;
};
