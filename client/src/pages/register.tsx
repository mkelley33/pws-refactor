import React from 'react';
import * as yup from 'yup';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosResponse } from 'axios';

import Layout from '@components/layout';
import TextInput from '@components/common/forms/text-input';
import { registerUser } from '../features/auth/authSlice';
import { formErrorText, formGroup } from '@components/common-css';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import useRecaptacha from 'src/hooks/useRecaptcha';
import Recaptcha from '@components/recaptcha';
import { PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

const schema = yup.object({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup.string().email('Invalid email address').required('Email is required!'),
  password: yup
    .string()
    .min(8, 'Password has to be at least 8 characters!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirm is required'),
  recaptcha: yup.string().required(),
  apiError: yup.string(),
});

interface IRegistrationForm extends FieldValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
  apiError: string;
}

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
    setError,
    getValues,
  } = useForm<IRegistrationForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      recaptcha: '',
      apiError: '',
    },
    mode: 'all',
    // @ts-expect-error No suitable type/conversion found
    resolver: yupResolver<IRegistrationForm>(schema),
  });

  const dispatch = useAppDispatch();

  const { error, loading } = useAppSelector((state) => state.auth);

  const handleOnSubmit: SubmitHandler<IRegistrationForm> = (data) => {
    if (isValid) {
      void dispatch(registerUser(data)).then(async (response) => {
        const payload = response.payload as IResponseData;
        // TODO: log error
        // email is the only error returned from the server
        if (payload.errors?.email) {
          setError('apiError', { message: 'That e-mail address has already been registered' }, { shouldFocus: true });
        } else {
          await navigate('/post-registration');
        }
      });
    }
  };

  const handleReset = () => {
    const formValues = getValues();
    const recaptcha = formValues.recaptcha;
    reset();
    setValue('recaptcha', recaptcha);
  };

  useRecaptacha<IRegistrationForm>(setValue);

  return loading ? (
    <Layout>Loading</Layout>
  ) : (
    <Layout>
      <section style={{ textAlign: 'center' }}>
        <h1>Registration Form</h1>
        <form noValidate onSubmit={handleSubmit(handleOnSubmit)}>
          <TextInput id="firstName" errors={errors as IErrors} label="First Name" {...register('firstName')} />
          <TextInput id="lastName" label="Last Name" errors={errors as IErrors} {...register('lastName')} />
          <TextInput
            id="email"
            type="email"
            label="Email"
            errors={errors as IErrors}
            autoComplete="email username"
            {...register('email')}
          />
          {errors.apiError && <div css={formErrorText}>{errors.apiError.message}</div>}
          <TextInput
            id="password"
            type="password"
            label="Password"
            errors={errors as IErrors}
            autoComplete="new-password"
            {...register('password')}
          />
          <TextInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            errors={errors as IErrors}
            {...register('confirmPassword')}
            autoComplete="confirm-password"
          />
          <Recaptcha errors={errors as IErrors & IRecaptchaMessage} {...register('recaptcha')} />
          <div css={formGroup}>
            <button type="button" onClick={handleReset} disabled={!isDirty || isSubmitting}>
              Reset
            </button>
            <button type="submit" disabled={!isDirty || isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default RegistrationForm;
