/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import { onDeleteChannel, onUpdateChannelInfo } from "@/actions/channels"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

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
    onMutate: () => {
      setEdit(false)
      onSetIcon(undefined)
    },
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

  const onEndChannelEdit = (event: Event) => {
    if (inputRef.current && channelRef.current && triggerRef.current) {
      if (
        !inputRef.current.contains(event.target as Node | null) &&
        !channelRef.current.contains(event.target as Node | null) &&
        !triggerRef.current.contains(event.target as Node | null) &&
        !document.getElementById("icon-list")
      ) {
        if (inputRef.current.value) {
          updateMutation({
            name: inputRef.current.value,
          })
        }
        if (icon) {
          updateMutation({ icon })
        } else {
          setEdit(false)
        }
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", onEndChannelEdit, false)
    return () => {
      document.removeEventListener("click", onEndChannelEdit, false)
    }
  }, [icon])

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
