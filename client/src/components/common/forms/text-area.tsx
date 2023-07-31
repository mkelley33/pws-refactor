import { formControl, formGroup, formErrorControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';
import { ForwardedRef, forwardRef } from 'react';

interface ITextArea {
  id: string;
  errors: IErrors;
  label: string;
}

function InnerTextArea({ id, errors, label, ...rest }: ITextArea, ref: ForwardedRef<HTMLTextAreaElement>) {
  return (
    <div css={formGroup}>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        css={[formControl, errors[id]?.message ? formErrorControl : null]}
        style={{ height: 168 }}
        placeholder={label}
        ref={ref}
        {...rest}
      />
      <InputFeedback error={errors[id]?.message} />
    </div>
  );
}

const TextArea = forwardRef(InnerTextArea);

export default TextArea;
