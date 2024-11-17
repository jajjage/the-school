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
