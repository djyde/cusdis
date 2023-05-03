import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../components/ui/AlertDialog";

export function EmbededCode(props: {
  host: string,
  projectId: string
}) {
  const code = `<div id="cusdis_thread" data-host="${props.host}" data-project-id="${props.projectId}"
  data-page-id="{{ PAGE_ID }}"></div>
<script src="https://unpkg.com/@cusdis/js/dist/index.global.js" async></script>`
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-xs bg-slate-100 rounded px-2 py-1 font-bold">Embeded code</AlertDialogTrigger>
      <AlertDialogContent className="w-[960px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Embeded Code</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="bg-slate-100 p-4 overflow-scroll">
              <pre className="table table-fixed w-full whitespace-pre-wrap">
                <code className="">
                  {code}
                </code>
              </pre>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}