import { useEffect } from 'react';
import { FieldValues, UseFormSetValue } from 'react-hook-form';
import api from '../api';

function useRecaptacha<T extends FieldValues>(setValue: UseFormSetValue<T>) {
  useEffect(() => {
    const recaptchaScript = document.querySelector('#recaptchaScript');
    let script: HTMLScriptElement;
    if (!recaptchaScript) {
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
}

export default useRecaptacha;
