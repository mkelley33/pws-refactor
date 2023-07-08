import { ChangeEventHandler } from 'react';

declare global {
  interface ITextField {
    // Only inputs have types
    type?: 'string';
    id: 'string';
    label: 'string';
    error: 'string';
    value: 'string';
    onChange: ChangeEventHandler<HTMLInputElement> | ChangeEventHandler<HTMLTextAreaElement>;
    props: any;
  }
}
