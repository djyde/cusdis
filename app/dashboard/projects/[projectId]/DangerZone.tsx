'use client'
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { StateButton } from "../../../components/ui/StateButton";

export function DangerZone(props: {
  projectId: string
}) {
  const router = useRouter()
  const deleteWebsiteMutation = useMutation(async () => {
    await axios.delete(`/api/v2/projects/${props.projectId}`)
  }, {
    onSuccess() {
      router.push('/dashboard')
      router.refresh()
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Danger Zone</h2>
      <div>
        <StateButton className="bg-red-500 hover:bg-red-700" isLoading={deleteWebsiteMutation.isLoading} onClick={_ => {
          if (window.confirm('Are you sure to delete this website?')) {
            deleteWebsiteMutation.mutate()
          }
        }}>Delete website</StateButton>
      </div>
    </div >
  )
}