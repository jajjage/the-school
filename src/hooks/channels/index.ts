import { onCreateChannelPost, onCreateNewComment, onDeleteChannel, onGetChannelInfo, onLikeChannelPost, onUpdateChannelInfo } from "@/actions/channels"
import { onGetCommentReplies, onGetPostInfo } from "@/actions/groups"
import { CreateCommentSchema } from "@/components/global/post-comments/schema"
import { CreateChannelPost } from "@/components/global/post-content/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useMutationState, useQuery, useQueryClient } from "@tanstack/react-query"
import { JSONContent } from "novel"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { v4 } from "uuid"
import { z } from "zod"

export const useChannelInfo = () => {
  const channelRef = useRef<HTMLAnchorElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [channel, setChannel] = useState<string | undefined>(undefined)
  const [edit, setEdit] = useState<boolean>(false)
  const [icon, setIcon] = useState<string | undefined>(undefined)
  const client = useQueryClient()

  const onEditChannel = (id: string | undefined) => {
    setChannel(id)
    setEdit(true)
  }

  const onSetIcon = (icon: string | undefined) => setIcon(icon)

  const {
    isPending,
    mutate: updateMutation,
    variables: updateVariables,
  } = useMutation({
    mutationFn: (data: { name?: string; icon?: string }) =>
      onUpdateChannelInfo(channel!, data.name, data.icon),
    onMutate: async (newData) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await client.cancelQueries({ queryKey: ['group-channels'] });

      // Snapshot the previous value
      const previousData = client.getQueryData(['group-channels']);

      // Optimistically update to the new value
      client.setQueryData(['group-channels'], (old: any) => {
        // Update the channel name in your cached data structure
        // This will depend on your data structure
        return old; // Update this according to your data structure
      });

      setEdit(false);
      onSetIcon(undefined);

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onSuccess: (data) => {
      return toast(data.status !== 200 ? "Error" : "Success", {
        description: data.message,
      })
    },

    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      client.setQueryData(['group-channels'], context?.previousData);
      setEdit(true); // Reopen edit mode if update fails
    },

    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["group-channels"],
      })
    },
  })
  const { variables: deleteVariables, mutate: deleteMutation } = useMutation({
    mutationFn: (data: { id: string }) => onDeleteChannel(data.id),
    onSuccess: (data) => {
      return toast(data.status !== 200 ? "Error" : "Success", {
        description: data.message,
      })
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["group-channels"],
      })
    },
  })

  const onEndChannelEdit = (event: MouseEvent) => {
    if (!inputRef.current || !edit) return;

    const clickedElement = event.target as Node;
    const isClickOutside = ![inputRef.current, channelRef.current, triggerRef.current].some(
      ref => ref?.contains(clickedElement)
    );
    const isNotIconList = !document.getElementById('icon-list');

    if (isClickOutside && isNotIconList) {
      const newName = inputRef.current.value;
      
      if (newName) {
        updateMutation({ name: newName });
      }
      if (icon) {
        updateMutation({ icon });
      } else {
        setEdit(false);
      }
    }
  };

  const handleUpdateChannel = () => {
    if (!inputRef.current) return;
    
    const newName = inputRef.current.value;
    if (newName) {
      updateMutation({ name: newName });
    }
    if (icon) {
      updateMutation({ icon });
    } else {
      setEdit(false);
    }
  };
   // Handler for keypress
   const onKeyPress = (event: KeyboardEvent) => {
    if (!inputRef.current || !edit) return;

    if (event.key === 'Enter') {
      handleUpdateChannel();
    }
  };

  useEffect(() => {
    document.addEventListener("click", onEndChannelEdit, false)
    document.addEventListener('keydown', onKeyPress);
    return () => {
      document.removeEventListener("click", onEndChannelEdit, false)
      document.removeEventListener('keydown', onKeyPress);
    }
  }, [edit, icon])

  const onChannelDelete = (id: string) => deleteMutation({ id })

  return {
    channel,
    onEditChannel,
    channelRef,
    edit,
    inputRef,
    updateVariables,
    isPending,
    triggerRef,
    onSetIcon,
    icon,
    onChannelDelete,
    deleteVariables,
  }
}


export const useLikeChannelPost = (postid: string) => {
  const client = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { likeid: string }) =>
      onLikeChannelPost(postid, data.likeid),
    onSuccess: (data) => {
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      await client.invalidateQueries({
        queryKey: ["unique-post"],
      })
      return await client.invalidateQueries({
        queryKey: ["channel-info"],
      })
    },
  })

  return { mutate, isPending }
}

export const useGetPost = (postid: string) => {
  const { data } = useQuery({
    queryKey: ["unique-post"],
    queryFn: () => onGetPostInfo(postid),
  })

  return { data }
}

export const useChannelPage = (channelid: string) => {
  const { data } = useQuery({
    queryKey: ["channel-info"],
    queryFn: () => onGetChannelInfo(channelid),
  })

  const mutation = useMutationState({
    filters: { mutationKey: ["create-post"], status: "pending" },
    select: (mutation) => {
      return {
        state: mutation.state.variables as any,
        status: mutation.state.status,
      }
    },
  })

  return { data, mutation }
}
export const useGetReplies = (commentid: string) => {
  const { isFetching, data } = useQuery({
    queryKey: ["comment-replies", commentid],
    queryFn: () => onGetCommentReplies(commentid),
    enabled: Boolean(commentid),
  })

  return { isFetching, data }
}

export const usePostComment = (postid: string) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
  })

  const client = useQueryClient()

  const { mutate, variables, isPending } = useMutation({
    mutationFn: (data: { content: string; commentid: string }) =>
      onCreateNewComment(postid, data.content, data.commentid),
    onMutate: () => reset(),
    onSuccess: (data) =>
      toast(data?.status === 200 ? "Success" : "Error", {
        description: data?.message,
      }),
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["post-comments"],
      })
    },
  })

  const onCreateComment = handleSubmit(async (values) =>
    mutate({
      content: values.comment,
      commentid: v4(),
    }),
  )

  return { register, errors, onCreateComment, variables, isPending }
}

export const useCreateChannelPost = (channelid: string) => {
  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(undefined)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    undefined,
  )

  const [onHtmlDescription, setOnHtmlDescription] = useState<
    string | undefined
  >(undefined)

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
  } = useForm<z.infer<typeof CreateChannelPost>>({
    resolver: zodResolver(CreateChannelPost),
  })

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsoncontent", JsonContent)
    setValue("content", onDescription)
    setValue("htmlcontent", onHtmlDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const client = useQueryClient()

  const { mutate, variables, isPending } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: (data: {
      title: string
      content: string
      htmlcontent: string
      jsoncontent: string
      postid: string
    }) =>
      onCreateChannelPost(
        channelid,
        data.title,
        data.content,
        data.htmlcontent,
        data.jsoncontent,
        data.postid,
      ),
    onSuccess: (data) => {
      setJsonDescription(undefined)
      setOnHtmlDescription(undefined)
      setOnDescription(undefined)
      toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      })
    },
    onSettled: async () => {
      return await client.invalidateQueries({
        queryKey: ["channel-info"],
      })
    },
  })

  const onCreatePost = handleSubmit(async (values) =>
    mutate({
      title: values.title,
      content: values.content!,
      htmlcontent: values.htmlcontent!,
      jsoncontent: values.jsoncontent!,
      postid: v4(),
    }),
  )

  return {
    onJsonDescription,
    onDescription,
    onHtmlDescription,
    setOnDescription,
    setOnHtmlDescription,
    setJsonDescription,
    register,
    errors,
    variables,
    isPending,
    onCreatePost,
  }
}