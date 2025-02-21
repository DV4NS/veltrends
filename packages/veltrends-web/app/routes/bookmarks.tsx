import {
  json,
  type LoaderFunction,
  redirect,
  MetaFunction,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import styled from '@emotion/styled'
import LinkCardList from '~/components/home/LinkCardList'
import TabLayout from '~/components/layouts/TabLayout'
import EmptyList from '~/components/system/EmptyList'
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll'
import { getBookmarks } from '~/lib/api/bookmark'
import { type GetBookmarksResult } from '~/lib/api/types'
import { withCookie } from '~/lib/client'
import { media } from '~/lib/media'
import { checkIsLoggedIn } from '~/lib/protectRoute'

export const loader: LoaderFunction = async ({ request, context }) => {
  const isLoggedIn = await checkIsLoggedIn(request)
  if (!isLoggedIn) return redirect('/auth/login?next=/bookmarks')

  const bookmarks = await withCookie(() => getBookmarks(), request)
  return json(bookmarks)
}

export const meta: MetaFunction = () => {
  return { title: 'Bookmark', robots: 'noindex' }
}

export default function Bookmarks() {
  const initialData = useLoaderData<GetBookmarksResult>()
  const ref = useRef<HTMLDivElement>(null)

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['bookmarks'],
    ({ pageParam }) => getBookmarks(pageParam),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined
        return lastPage.pageInfo.nextOffset
      },
    },
  )

  useInfiniteScroll(ref, fetchNextPage)

  const items = data?.pages.flatMap((page) =>
    page.list.map((bookmark) => bookmark.item),
  )

  return (
    <StyledTabLayout>
      {items?.length === 0 ? (
        <EmptyList
          message={
            'There is no bookmark.\nTry adding a link to your bookmarks that you want to see again later.'
          }
        />
      ) : null}
      <Content>
        {items ? <LinkCardList items={items} /> : null}
        <div ref={ref} />
      </Content>
    </StyledTabLayout>
  )
}

const StyledTabLayout = styled(TabLayout)`
  padding-top: 16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
`

const Content = styled.div`
  position: relative;
  ${media.wide} {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
`
