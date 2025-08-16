import { InviteService } from "@/services/invite/inviteService";
import { toast } from "react-toastify";
import { InviteList } from "./InviteList";
import { Skeleton } from "./ui/skeleton";

export function Dashboard() {
  const invitesResult = InviteService.useGetUserInvitesQuery();

  const acceptInviteMutation = InviteService.useAcceptInviteMutation();
  const rejectInviteMutation = InviteService.useRejectInviteMutation();

  return (
    <div className="w-full h-full ">
      {invitesResult.data ? (
        <InviteList
          invites={invitesResult.data}
          onClickAcceptInvite={(invite) =>
            toast.promise(acceptInviteMutation.mutateAsync(invite.id), {
              pending: `Accepting invite to ${invite.locationName}`,
              success: `Joined ${invite.locationName}`,
              error: "Error occurred while accepting invite",
            })
          }
          onClickRejectInvite={(invite) =>
            toast.promise(rejectInviteMutation.mutateAsync(invite.id), {
              error: "Error occurred while rejecting invite",
              success: "",
              pending: ""
            })
          }
        />
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
