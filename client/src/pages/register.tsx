import * as yup from 'yup';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../api';
import Layout from '@components/layout';
import TextInput from '@components/common/forms/text-input';
import { registerUser } from '../features/auth/authSlice';
import { formGroup, formErrorText } from '@components/common-css';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import { text } from 'stream/consumers';

const schema = yup.object().shape({
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
});

interface IRegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  recaptcha: string;
}

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
  } = useForm<IRegistrationForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      recaptcha: '',
    },
    mode: 'all',
    resolver: yupResolver(schema),
  });

  const dispatch = useAppDispatch();

  const handleOnSubmit: SubmitHandler<IRegistrationForm> = (data) => {
    // TODO: Add a loading spinner for form submission
    if (isValid) {
      dispatch(registerUser(data))
        .then(async () => {
          await navigate('/post-registration');
        })
        .catch(() => {
          // TODO: Add logging for what went wrong
          toast.error('Something went wrong', {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
          });
        });
    }
  };

  useEffect(() => {
    const recaptchaScript = document.querySelector('#recaptchaScript');
    let script: HTMLScriptElement;
    if (!recaptchaScript) {
      console.log('recaptcha');
      script = document.createElement('script');
      script.id = 'recaptchaScript';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    (window as IWindow).onSubmit = (token: string) => {
      api
        .post<IRecaptcha>('/recaptcha', { token })
        .then((res) => {
          if (res.data.error) setValue('recaptcha', '');
          else setValue('recaptcha', token, { shouldValidate: true });
        })
        .catch(() => {
          setValue('recaptcha', '');
        });
    };
    (window as IWindow).onExpired = () => setValue('recaptcha', '');
    return () => {
      if (script) document.body.removeChild(script);
    };
  }, []);

  const isLoading = useAppSelector((state) => state.auth.loading);

  return isLoading ? (
    <Layout>
      <section style={{ textAlign: 'center' }}>
        <h1>Registration Form</h1>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <TextInput id="firstName" errors={errors as IErrors} label="First Name" register={register} />
          <TextInput id="lastName" label="Last Name" errors={errors as IErrors} register={register} />
          <TextInput
            id="email"
            type="email"
            label="Email"
            errors={errors as IErrors}
            register={register}
            autoComplete="email username"
          />
          <TextInput
            id="password"
            type="password"
            label="Password"
            errors={errors as IErrors}
            register={register}
            autoComplete="new-password"
          />
          <TextInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            errors={errors as IErrors}
            register={register}
            autoComplete="confirm-password"
          />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input id="recaptcha" type="hidden" {...register('recaptcha')} />
          <div css={formGroup}>
            <div
              id="recaptchaSettings"
              style={{ width: '304px', margin: '0 auto' }}
              className="g-recaptcha"
              data-callback="onSubmit"
              data-expired-callback="onExpired"
              data-sitekey={process.env.GATSBY_RECAPTCHA_SITE_KEY}
            ></div>
            {errors.recaptcha && <div css={formErrorText}>{errors.recaptcha.message}</div>}
          </div>
          <div css={formGroup}>
            <button type="button" onClick={() => reset()} disabled={!isDirty || isSubmitting}>
              Reset
            </button>
            <button type="submit" disabled={!isDirty || isSubmitting}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </Layout>
  ) : (
    <>Loading</>
  );
};

export default RegistrationForm;
