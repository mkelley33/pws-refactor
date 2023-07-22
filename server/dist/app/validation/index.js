const patterns = Object.freeze({
    // http://emailregex.com/
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
    // https://dzone.com/articles/use-regex-test-password
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    // http://www.regexplanet.com/advanced/javascript/index.html
    phone: /^\D*([2-9]\d{2})(\D*)([2-9]\d{2})(\D*)(\d{4})\D*$/,
});
const messages = Object.freeze({
    blank: "Can't be blank",
    email: 'Must be a valid e-mail address',
    password: 'Must contain a combination of at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*), and be at least 8 characters long',
    phone: 'Format should resemble (555) 555-5555',
    maxlength: (length) => `Can't be longer than ${length} characters`,
});
export { messages, patterns };
//# sourceMappingURL=index.js.map