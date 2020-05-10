import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const errors: Errors = {};

  err.inner.forEach(({ message, path }) => {
    errors[path] = message;
  });

  return errors;
}
