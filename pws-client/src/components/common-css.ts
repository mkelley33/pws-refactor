import { css } from '@emotion/react';

export const srOnly = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
});

export const formControl = css({
  fontSize: '1.25rem',
  border: '1px solid #ccc',
  borderRadius: '5px',
  color: '#222',
  width: '20rem',
  height: '2rem',
  padding: '0.15rem 0.35rem',
});

export const formGroup = css({
  width: '100%',
  padding: '0.45rem 0.75rem',
  lineHeight: 1.5,
});
