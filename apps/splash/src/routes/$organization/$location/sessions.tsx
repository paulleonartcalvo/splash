import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$organization/$location/sessions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$organization/$location/sessions"!</div>
}
