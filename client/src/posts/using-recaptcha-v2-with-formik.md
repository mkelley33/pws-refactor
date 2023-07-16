---
title: 'Using Google Recaptcha V2 with Formik and Node.js'
date: '2020-06-22'
---

This post intends to demonstrate how to integrate recaptcha with formik
as well the code for verifying on a node.js server the token google returns
once a CAPTCHA is submitted.

To get started you'll need to set up your site and localhost to be registered
for reCAPTCHA by going to https://www.google.com/recaptcha/admin/ and clicking
the plus sign to add those sites, respectively.

## Getting started

This post assumes you've already installed Formik and Yup. It also depends on gatsby, but you can replace the usage of `navigate` with whatever routing
mechanism you're using. `react-toastify` is also optional. You will need to
have React version 16.8 installed as this tutorial uses hooks.

## The Formik JSX

Put the following code in the component where you want to use reCAPTCHA\:

```javascript
import React, { useEffect, useRef } from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { navigate } from 'gatsby';
import axios from 'axios';
// Be sure to gitignore this file. This would also make a good candidate env variable.
import { RECATPTCHA_SITE_KEY } from 'constants';

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    recaptcha: Yup.string().required(),
  }),
  handleSubmit: (payload, { setSubmitting }) => {
    axios
      .post(`/contact`, payload)
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        toast.error('Something went wrong', {
          position: toast.POSITION.TOP_CENTER,
          hideProgressBar: true,
        });
      });
    setSubmitting(false);
  },
  mapPropsToValues: () => ({
    recaptcha: '',
  }),
  // In my case I used this on a contact form, but you can put whatever
  // you want here, usually the name of the component.
  displayName: 'ContactForm',
});

const ContactForm = (props) => {
  const { values, handleSubmit, isSubmitting, setFieldValue } = props;

  useEffect(() => {
    // Formik causes multiple renders so don't add script multiple times
    if (document.querySelector('#recaptcha')) {
      const script = document.createElement('script');
      script.id = 'recaptcha';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      window.onSubmit = (token: string) => {
        api.post('/recaptcha', { token }).then((res: any) => {
          if (res.data.error) setFieldValue('recaptcha', '');
          else setFieldValue('recaptcha', token);
        });
      };
      window.onExpired = () => setFieldValue('recaptcha', '');
      document.body.appendChild(script);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input id='recaptcha' name='recaptcha' type='hidden' value='' />
      <div
        className='g-recaptcha'
        data-sitekey={RECAPTCHA_SITE_KEY}
        data-callback='onSubmit'
        data-expired-callback='onExpired'
      ></div>
      <button type='submit' disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
};

export default formikEnhancer(ContactForm);
```

## The Node.js code

This assumes you are using Express and dotenv. Put the following code in your controller\:

```javascript
import request from 'request';

function verify(req, res) {
  const { token } = req.body;

  if (!token) return res.json({ error: 'unverified' });

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${req.connection.remoteAddress}`;

  request(verificationUrl, function (error, response, body) {
    const resBody = JSON.parse(body);
    if (resBody.success !== undefined && !resBody.success) {
      return res.json({ error: 'unverified' });
    }
    res.json({ success: true });
  });
}

export default { verify };
```

And that's about all you need to do to fully integrate Google reCAPTCHA v2 with
Formik and Node.js. Feel free to [contact me](/contact) if you have any
questions or comments.
