import * as Yup from 'yup';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../api';
import Layout from '@components/layout';
import TextInput from '@components/common/forms/text-input';
import TextArea from '@components/common/forms/text-area';

const schema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Your first name must be a minimum of two characters long.')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Your first name must be a minimum of two characters long.')
    .required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  message: Yup.string().required('Message is required'),
  recaptcha: Yup.string().required(),
});

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
      (window as any).onSubmit = (token: string) => {
        api.post('/recaptcha', { token }).then((res: any) => {
          if (res.data.error) setValue('recaptcha', '');
          else setValue('recaptcha', token);
        });
      };
      (window as any).onExpired = () => setValue('recaptcha', '');
      document.body.appendChild(script);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
  } = useForm({
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

  const onSubmitHandler = (data: any) => {
    // TODO: Add a loading spinner for form submission
    if (isValid) {
      api
        .post(`/contact`, data)
        .then((_res) => {
          navigate('/post-contact');
        })
        .catch((_err) => {
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
      <section>
        <h1>Contact</h1>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <TextInput id="firstName" type="text" label="First Name" register={register} />
          <TextInput id="lastName" type="text" label="Last Name" register={register} />
          <TextInput id="email" type="email" label="Email" autoComplete="username email" register={register} />
          <TextArea id="message" label="Message" rows={6} register={register} />
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input id="recaptcha" type="hidden" value="" {...register('recaptcha')} />
          <div className="form-group">
            <div
              className="g-recaptcha"
              data-sitekey={process.env.RECAPTCHA_SITE_KEY}
              data-callback="onSubmit"
              data-expired-callback="onExpired"
            ></div>
          </div>
          <input type="submit" disabled={isSubmitting || !isDirty} value="Submit" />
        </form>
      </section>
    </Layout>
  );
};

export default ContactForm;
