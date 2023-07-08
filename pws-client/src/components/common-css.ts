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
  border: '1px solid #ccc',
  borderRadius: '5px',
  color: '#222',
});
