import { srOnly, formControl, formGroup } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const TextArea = ({ label, register, id, error, ...props }: any) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id} error={error}>
      {label}
    </Label>
    <textarea css={formControl} {...register(id)} style={{ height: 168 }} placeholder={label} {...props} />
    <InputFeedback error={error} />
  </div>
);

export default TextArea;
