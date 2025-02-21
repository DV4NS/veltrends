import {
  type LoaderFunction,
  redirect,
  type MetaFunction,
} from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { SangteProvider } from 'sangte'
import { checkIsLoggedIn } from '~/lib/protectRoute'

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await checkIsLoggedIn(request)
  if (!isLoggedIn) return redirect('/auth/login?next=/write')
  return null
}

export const meta: MetaFunction = () => {
  return { title: 'Write a new post', robots: 'noindex' }
}

function Write() {
  return (
    <SangteProvider>
      <Outlet />
    </SangteProvider>
  )
}

export default Write
