import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { cn } from "@/lib/utils";

interface LoadingMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function LoadingMessage({ message, className, ...props }: LoadingMessageProps) {
  return (
    <div 
      className={cn(
        "text-center flex flex-col justify-center items-center gap-4 h-full w-full",
        className
      )}
      {...props}
    >
      <Spinner />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}