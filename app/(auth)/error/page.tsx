import CardWrapper from '@/components/auth/card-wrapper';
import { FaExclamationTriangle } from 'react-icons/fa';

const Error = () => {
  return (
    <CardWrapper
      title="Error"
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/login"
      backButtonLabel="Return to login"
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-destructive" />
      </div>
    </CardWrapper>
  );
};

export default Error;
