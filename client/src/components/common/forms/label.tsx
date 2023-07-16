import { srOnly } from '@components/common-css';
import { ReactNode } from 'react';

interface ILabel {
  children?: ReactNode;
  // className is only here because emotion requires it in order to use the css prop
  className?: string;
  htmlFor: string;
}
const Label = ({ children, htmlFor }: ILabel) => (
  <label css={srOnly} htmlFor={htmlFor}>
    {children}
  </label>
);
export default Label;
