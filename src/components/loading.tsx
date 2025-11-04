import { Loader2 } from "lucide-react"

export const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
           <Loader2 className="animate-spin text-produ-secondary" />
        </div> 
    )
}