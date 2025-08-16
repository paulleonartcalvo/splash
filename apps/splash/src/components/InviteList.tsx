import { cn } from "@/lib/utils";
import type { UserInvite } from "@/services/invite/queries";
import { Button } from "./ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

type InviteListProps = {
  invites: UserInvite[];
  onClickAcceptInvite?: (invite: UserInvite) => void;
  onClickRejectInvite?: (invite: UserInvite) => void;
} & React.ComponentProps<"div">;
export function InviteList({
  invites,
  onClickAcceptInvite,
  onClickRejectInvite,
  className,
  ...rest
}: InviteListProps) {
  return (
    <div className={cn("", className)} {...rest}>
      {invites.map((invite) => (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Invite to {invite.organizationName}</CardTitle>
            <CardDescription>
              {`You were invited on ${new Date(invite.createdAt).toLocaleDateString()}`}
            </CardDescription>
            <CardAction></CardAction>
          </CardHeader>
          <CardFooter className="flex-row gap-2 justify-end">
            {onClickRejectInvite && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onClickRejectInvite(invite)}
              >
                Reject
              </Button>
            )}
            {onClickAcceptInvite && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onClickAcceptInvite(invite)}
              >
                Accept
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
