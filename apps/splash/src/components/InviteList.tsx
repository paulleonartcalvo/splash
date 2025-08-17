// import { cn } from "@/lib/utils";
// import type { UserInvite } from "@/services/invite/queries";
// import { NotificationItem } from "./ui/notification-item";

// type InviteListProps = {
//   invites: UserInvite[];
//   onClickAcceptInvite?: (invite: UserInvite) => void;
//   onClickRejectInvite?: (invite: UserInvite) => void;
// } & React.ComponentProps<"div">;
// export function InviteList({
//   invites,
//   onClickAcceptInvite,
//   onClickRejectInvite,
//   className,
//   ...rest
// }: InviteListProps) {
//   if (invites.length === 0) {
//     return (
//       <div className="p-4 text-center text-sm text-muted-foreground">
//         No pending invites
//       </div>
//     );
//   }

//   return (
//     <div className={cn("", className)} {...rest}>
//       {invites.map((invite) => (
//         <NotificationItem
//           key={invite.id}
//           title={`Invite to ${invite.organizationName}`}
//           subtitle={invite.locationName}
//           onClick={() => onClickAcceptInvite?.(invite)}
//           onDismiss={() => onClickRejectInvite?.(invite)}
//         />
//       ))}
//     </div>
//   );
// }
