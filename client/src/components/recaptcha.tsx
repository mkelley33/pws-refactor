import React, { ForwardedRef, forwardRef } from 'react';

import { formGroup, formErrorText } from './common-css';

function InnerCaptcha(
  { errors, ...rest }: { errors: IRecaptchaMessage },
  ref: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  return (
    <React.Fragment>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input id="recaptcha" type="hidden" ref={ref} {...rest} />
      <div css={formGroup}>
        <div
          id="recaptchaSettings"
          style={{ width: '304px', margin: '0 auto' }}
          className="g-recaptcha"
          data-callback="onSubmit"
          data-expired-callback="onExpired"
          data-sitekey={process.env.GATSBY_RECAPTCHA_SITE_KEY}
        ></div>
        {errors?.recaptcha && <div css={formErrorText}>{errors?.recaptcha.message}</div>}
      </div>
    </React.Fragment>
  );
}

const Recaptcha = forwardRef(InnerCaptcha);

export default Recaptcha;
