import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit2 } from "lucide-react"
import React from "react"

type Props ={
    children: React.ReactNode
    // name: string
}
const ToolTips = ({children}: Props) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer group">
                    {children}
                <Edit2 
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" 
                />
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gray-900 text-white px-3 py-2">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Edit Channel Name</p>
                <p className="text-sm text-gray-300">Double click to edit</p>
              </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ToolTips
