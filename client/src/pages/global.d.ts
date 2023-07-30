interface IWindow extends Window {
  onSubmit?: (token: string) => void;
  onExpired?: () => void;
}

interface IRecaptcha {
  error: string;
}
