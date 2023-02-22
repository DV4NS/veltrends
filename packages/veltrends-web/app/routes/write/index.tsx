import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layouts/BasicLayout'
import LabelInput from '~/components/system/LabelInput'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import { useWriteActions, useWriteValue } from '~/states/write'

function WriteLink() {
  const navigate = useNavigate()
  const state = useWriteValue()
  const actions = useWriteActions()

  return (
    <BasicLayout title="Enter link" hasBackButton>
      <WriteFormTemplate
        description="Enter the URL you want to share."
        buttonText="Next"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/write/intro')
        }}
      >
        <LabelInput
          label="URL"
          placeholder="https://example.com"
          value={state.form.link}
          onChange={(e) => {
            actions.change('link', e.target.value)
          }}
          errorMessage={state.error?.statusCode === 422 ? 'Invalid URL' : undefined}
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  )
}

export default WriteLink
