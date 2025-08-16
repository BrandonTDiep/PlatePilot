'use client';

import CardWrapper from '@/components/auth/card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import FormError from '@/components/form-error';
import FormSuccess from '@/components/form-success';

const NewVerification = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (success || error) return;

      if (!token) {
        setError('Missing token!');
        return;
      }

      try {
        const data = await newVerification(token);
        setSuccess(data.success);
        setError(data.error);
      } catch (err) {
        setError(`Something went wrong! ${err}`);
      }
    };

    verify();
  }, [token, success, error]);

  return (
    <CardWrapper
      title="Verify"
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />

        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerification;
