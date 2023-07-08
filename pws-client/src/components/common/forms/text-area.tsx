import { srOnly, formControl, formGroup } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const TextArea = ({ label, id, error, value, onChange, ...props }: ITextField) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id} error={error}>
      {label}
    </Label>
    <textarea
      id={id}
      css={formControl}
      style={{ height: 168 }}
      value={value}
      onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
      placeholder={label}
      {...props}
    />
    <InputFeedback error={error} />
  </div>
);

export default TextArea;
