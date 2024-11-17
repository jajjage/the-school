import { onAuthenticatedUser } from "@/actions/auth"
import { onGetChannelInfo } from "@/actions/channels"
import { onGetGroupInfo } from "@/actions/groups"
import { currentUser } from "@clerk/nextjs/server"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

type Props = {
  params: { channelid: string; groupid: string }
}

const GroupChannelPage = async ({ params }: Props) => {
  const client = new QueryClient()
  const user = await currentUser()
  const authUser = await onAuthenticatedUser()

  await client.prefetchQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(params.channelid),
  })

  await client.prefetchQuery({
    queryKey: ["about-group-info"],
    queryFn: () => onGetGroupInfo(params.groupid),
  })

  return (
    <HydrationBoundary state={dehydrate(client)}>
      
    </HydrationBoundary>
  )
}

export default GroupChannelPage
