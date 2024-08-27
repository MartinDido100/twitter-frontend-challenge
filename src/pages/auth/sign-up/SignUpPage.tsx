import type { ChangeEvent } from 'react';
import { useState } from 'react';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthWrapper from '../../../pages/auth/AuthWrapper';
import LabeledInput from '../../../components/labeled-input/LabeledInput';
import Button from '../../../components/button/Button';
import { ButtonType } from '../../../components/button/StyledButton';
import { StyledH3 } from '../../../components/common/text';
import { useSignUp } from '../../../service/HttpRequestService';
import { useFormik } from 'formik';

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpPage = () => {
  const [error, setError] = useState(false);
  const [formErrors, setFormErrors] = useState<SignUpErrors | null>(null);

  const { mutate } = useSignUp();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateFields = (values: SignUpData) => {
    setFormErrors(null);
    if (!values.email) {
      setFormErrors((prev) => {
        return { ...prev, email: t('error.formError.requiredEmail') };
      });
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      setFormErrors((prev) => {
        return { ...prev, email: t('error.formError.invalidEmail') };
      });
    }

    if (!values.name) {
      setFormErrors((prev) => {
        return { ...prev, name: t('error.formError.requiredName') };
      });
    }

    if (!values.username) {
      setFormErrors((prev) => {
        return { ...prev, username: t('error.formError.requiredUsername') };
      });
    }

    if (!values.password) {
      setFormErrors((prev) => {
        return { ...prev, password: t('error.formError.requiredPassword') };
      });
    }

    if (!values.confirmPassword) {
      setFormErrors((prev) => {
        return { ...prev, confirmPassword: t('error.formError.confirmRequired') };
      });
    } else if (values.confirmPassword !== values.password) {
      setFormErrors((prev) => {
        return { ...prev, confirmPassword: t('error.formError.differentPass') };
      });
    }
  };

  const handleSubmit = async (values: SignUpData) => {
    if (formErrors) {
      return;
    }

    const { confirmPassword, ...requestData } = values;
    mutate(requestData, {
      onSuccess: () => navigate('/'),
      onError: () => setError(true),
    });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: handleSubmit,
    validate: validateFields,
    validateOnChange: false,
  });

  return (
    <AuthWrapper>
      <div className="border">
        <div className="container">
          <div className="header">
            <img src={logo} alt="Twitter Logo" />
            <StyledH3>{t('title.register')}</StyledH3>
          </div>
          <div className="input-container">
            <LabeledInput
              required
              placeholder="Enter name..."
              title={t('input-params.name')}
              error={formErrors?.name}
              onChange={formik.handleChange}
              value={formik.values.name}
              id="name"
            />
            <LabeledInput
              required
              placeholder="Enter username..."
              title={t('input-params.username')}
              error={formErrors?.username}
              onChange={formik.handleChange}
              value={formik.values.username}
              id="username"
            />
            <LabeledInput
              required
              placeholder="Enter email..."
              title={t('input-params.email')}
              error={formErrors?.email}
              onChange={formik.handleChange}
              value={formik.values.email}
              id="email"
            />
            <LabeledInput
              type="password"
              required
              placeholder="Enter password..."
              title={t('input-params.password')}
              error={formErrors?.password}
              onChange={formik.handleChange}
              value={formik.values.password}
              id="password"
            />
            <LabeledInput
              type="password"
              required
              placeholder="Confirm password..."
              title={t('input-params.confirm-password')}
              error={formErrors?.confirmPassword}
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              id="confirmPassword"
            />
          </div>
          <p className={'error-message'}>{error && t('error.register')}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            text={t('buttons.register')}
            buttonType={ButtonType.FOLLOW}
            submit
            size="MEDIUM"
            onClick={() => formik.handleSubmit()}
          />
          <Button
            text={t('buttons.login')}
            buttonType={ButtonType.OUTLINED}
            size="MEDIUM"
            onClick={() => navigate('/sign-in')}
          />
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignUpPage;
