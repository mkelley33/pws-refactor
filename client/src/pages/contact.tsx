import * as yup from 'yup';
import { navigate } from 'gatsby';
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../api';
import { formGroup } from '@components/common-css';
import Layout from '@components/layout';
import TextInput from '@components/common/forms/text-input';
import TextArea from '@components/common/forms/text-area';
import Recaptcha from '@components/recaptcha';
import useRecaptacha from 'src/hooks/useRecaptcha';

// https://github.com/orgs/react-hook-form/discussions/10653
// https://github.com/orgs/react-hook-form/discussions/3099
// Another example of isValid not working:
// https://codesandbox.io/s/react-hook-form-validationschema-v6-forked-9ezus?file=/src/index.js
const schema = yup.object({
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

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    setValue,
  } = useForm<IContactForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      recaptcha: '',
    },
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useRecaptacha(setValue);

  const handleOnSubmit: SubmitHandler<IContactForm> = (data) => {
    // TODO: Add a loading spinner for form submission
    if (isValid) {
      api
        .post('/contact', data)
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
        <form noValidate onSubmit={handleSubmit(handleOnSubmit)}>
          <TextInput id="firstName" label="First Name" errors={errors as IErrors} {...register('firstName')} />
          <TextInput id="lastName" label="Last Name" errors={errors as IErrors} {...register('lastName')} />
          <TextInput
            id="email"
            type="email"
            label="Email"
            autoComplete="username email"
            errors={errors as IErrors}
            {...register('email')}
          />
          <TextArea id="message" label="Message" errors={errors as IErrors} {...register('message')} />
          <Recaptcha errors={errors as IErrors & IRecaptchaMessage} {...register('recaptcha')} />
          <div css={formGroup}>
            <input type="submit" disabled={isSubmitting || !isDirty} />
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ContactForm;
