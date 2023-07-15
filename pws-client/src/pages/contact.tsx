import * as yup from 'yup';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../api';
import { formGroup, formErrorText } from '@components/common-css';
import Layout from '@components/layout';
import TextInput from '@components/common/forms/text-input';
import TextArea from '@components/common/forms/text-area';

// https://github.com/orgs/react-hook-form/discussions/10653
// https://github.com/orgs/react-hook-form/discussions/3099
// Another example of isValid not working:
// https://codesandbox.io/s/react-hook-form-validationschema-v6-forked-9ezus?file=/src/index.js
const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  message: yup.string().required('Message is required'),
  recaptcha: yup.string().required(),
});

interface IContactForm {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  recaptcha: string;
}

interface IWindow extends Window {
  onSubmit?: (token: string) => void;
  onExpired?: () => void;
}

interface IRecaptcha {
  error: string;
}

const ContactForm = () => {
  useEffect(() => {
    document.title = 'Contact Form';
    // Formik causes multiple renders so don't add script multiple times
    if (document.querySelector('#recaptcha')) {
      const script = document.createElement('script');
      script.id = 'recaptcha';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      (window as IWindow).onSubmit = (token: string) => {
        api
          .post<IRecaptcha>('/recaptcha', { token })
          .then((res) => {
            if (res.data.error) setValue('recaptcha', '');
            else setValue('recaptcha', token);
          })
          .catch(() => {
            setValue('recaptcha', '');
          });
      };
      (window as IWindow).onExpired = () => setValue('recaptcha', '');
      document.body.appendChild(script);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
  } = useForm<IContactForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      recaptcha: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmitHandler: SubmitHandler<IContactForm> = (data) => {
    // TODO: Add a loading spinner for form submission
    // TODO: remove the following check once the yupResolver bug is fixed
    // See commented out URLs at the top of this file for more information
    if (!Object.entries(errors).length) {
      api
        .post(`/contact`, data)
        .then(async () => {
          await navigate('/post-contact');
        })
        .catch(() => {
          // TODO: Add logging error message
          toast.error('Something went wrong', {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
          });
        });
    }
  };

  return (
    <Layout>
      <section style={{ textAlign: 'center' }}>
        <h1>Contact</h1>
        <form noValidate onSubmit={handleSubmit(onSubmitHandler)}>
          <TextInput id="firstName" label="First Name" register={register} errors={errors as IErrors} />
          <TextInput id="lastName" label="Last Name" register={register} errors={errors as IErrors} />
          <TextInput
            id="email"
            type="email"
            label="Email"
            autoComplete="username email"
            register={register}
            errors={errors}
          />
          <TextArea id="message" label="Message" register={register} errors={errors} />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input id="recaptcha" type="hidden" value="" {...register('recaptcha')} />
          <div css={formGroup}>
            <div
              style={{ width: '304px', margin: '0 auto' }}
              className="g-recaptcha"
              data-sitekey={process.env.RECAPTCHA_SITE_KEY}
              data-callback="onSubmit"
              data-expired-callback="onExpired"
            ></div>
            {errors.recaptcha && <div css={formErrorText}>{errors.recaptcha.message}</div>}
          </div>
          <div css={formGroup}>
            <input type="submit" disabled={isSubmitting || !isDirty} />
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ContactForm;
