import React, { useState } from 'react';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSignIn } from '../../../service/HttpRequestService';
import AuthWrapper from '../AuthWrapper';
import LabeledInput from '../../../components/labeled-input/LabeledInput';
import Button from '../../../components/button/Button';
import { ButtonType } from '../../../components/button/StyledButton';
import { StyledH3 } from '../../../components/common/text';
import { useFormik } from 'formik';

interface SignInData {
  username: string;
  password: string;
}

interface SignInErrors {
  username?: string;
  password?: string;
}

const SignInPage = () => {
  const [formErrors, setFormErrors] = useState<SignInErrors | null>(null);
  const [error, setError] = useState(false);
  const { mutate } = useSignIn();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (values: SignInData) => {
    if (formErrors) {
      return;
    }

    mutate(
      { username: values.username, password: values.password },
      {
        onSuccess: () => {
          navigate('/');
        },
        onError: () => setError(true),
      }
    );
  };

  const validateFields = (values: SignInData) => {
    setFormErrors(null);
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
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: handleSubmit,
    validate: validateFields,
    validateOnChange: false,
  });

  return (
    <AuthWrapper>
      <div className={'border'}>
        <div className={'container'}>
          <div className={'header'}>
            <img src={logo} alt={'Twitter Logo'} />
            <StyledH3>{t('title.login')}</StyledH3>
          </div>
          <div className={'input-container'}>
            <LabeledInput
              required
              placeholder={'Enter user...'}
              title={t('input-params.username')}
              error={formErrors?.username}
              onChange={formik.handleChange}
              value={formik.values.username}
              id="username"
            />
            <LabeledInput
              type="password"
              required
              placeholder={'Enter password...'}
              title={t('input-params.password')}
              error={formErrors?.password}
              onChange={formik.handleChange}
              value={formik.values.password}
              id="password"
            />
            <p className={'error-message'}>{error && t('error.login')}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              text={t('buttons.login')}
              buttonType={ButtonType.FOLLOW}
              size={'MEDIUM'}
              submit
              onClick={() => formik.handleSubmit()}
            />
            <Button
              text={t('buttons.register')}
              buttonType={ButtonType.OUTLINED}
              size={'MEDIUM'}
              onClick={() => navigate('/sign-up')}
            />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default SignInPage;
