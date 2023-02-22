import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useEffect } from 'react'
import styled from '@emotion/styled'
import { useForm } from '~/hooks/useForm'
import { useSubmitLoading } from '~/hooks/useSubmitLoading'
import { colors } from '~/lib/colors'
import { type AppError } from '~/lib/error'
import { media } from '~/lib/media'
import { validate } from '~/lib/validate'
import Button from '../system/Button'
import LabelInput from '../system/LabelInput'
import { Logo } from '../vectors'
import QuestionLink from './QuestionLink'

interface ActionData {
  text: 'hello world'
}

interface Props {
  mode: 'login' | 'register'
  error?: AppError
}

const authDescriptions = {
  login: {
    usernamePlaceholder: 'Please enter your ID.',
    passwordPlaceholder: 'Please enter a password.',
    buttonText: 'Log in',
    actionText: 'Join the membership',
    question: 'Dont have an account?',
    actionLink: '/auth/register',
  },
  register: {
    usernamePlaceholder: '5~20Enter lowercase letters and numbers between characters',
    passwordPlaceholder: '8characters, at least two of English/number/special characters',
    buttonText: 'Join the membership',
    actionText: 'Log in',
    question: 'Already have an account?',
    actionLink: '/auth/login',
  },
} as const

function AuthForm({ mode, error }: Props) {
  const action = useActionData<ActionData | undefined>()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next')

  const isLoading = useSubmitLoading()

  const { inputProps, handleSubmit, errors, setError } = useForm({
    form: {
      username: {
        validate: mode === 'register' ? validate.username : undefined,
        errorMessage: '5~20Please enter lowercase English letters or numbers between characters.',
      },
      password: {
        validate: mode === 'register' ? validate.password : undefined,
        errorMessage:
          '8Please enter at least 2 letters/numbers/special characters.',
      },
    },
    mode: 'all',
    shouldPreventDefault: false,
  })

  const {
    usernamePlaceholder,
    passwordPlaceholder,
    buttonText,
    actionText,
    question,
    actionLink,
  } = authDescriptions[mode]

  const onSubmit = handleSubmit(() => {})

  useEffect(() => {
    if (error?.name === 'AlreadyExists') {
      setError('username', 'This account already exists.')
    }
  }, [error, setError])

  return (
    <StyledForm method="post" onSubmit={onSubmit}>
      <DesktopLogoLink to="/">
        <Logo />
      </DesktopLogoLink>
      <InputGroup>
        <LabelInput
          label="아이디"
          placeholder={usernamePlaceholder}
          disabled={isLoading}
          errorMessage={errors.username}
          {...inputProps.username}
        />
        <LabelInput
          label="비밀번호"
          name="password"
          placeholder={passwordPlaceholder}
          disabled={isLoading}
          errorMessage={errors.password}
          type="password"
          {...inputProps.password}
        />
      </InputGroup>
      <ActionsBox>
        {error?.name === 'WrongCredentials' ? (
          <ActionErrorMessage>Invalid account information.</ActionErrorMessage>
        ) : null}
        <Button type="submit" layoutMode="fullWidth" disabled={isLoading}>
          {buttonText}
        </Button>
        <QuestionLink
          question={question}
          name={actionText}
          to={next ? `${actionLink}?next=${next}` : actionLink}
        />
      </ActionsBox>
    </StyledForm>
  )
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  padding: 16px;
  flex: 1;

  justify-content: space-between;

  ${media.mobile} {
    justify-content: center;
    width: 460px;
    align-self: center;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ActionsBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  ${media.mobile} {
    margin-top: 24px;
  }
`

const ActionErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 14px;
`

const DesktopLogoLink = styled(Link)`
  display: none;
  ${media.mobile} {
    display: flex;
  }
  justify-content: center;
  margin-bottom: 48px;
  svg {
    color: ${colors.gray5};
    height: 32px;
    width: auto;
  }
`

export default AuthForm
