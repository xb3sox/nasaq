import { FileQuestion } from "lucide-react";
import { Card } from "./card";
import { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FileQuestion,
  action,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed rounded-xl bg-muted/20 min-h-[300px] shadow-none">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-muted">
        <Icon className="w-8 h-8 text-muted-foreground/60" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-[250px]">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </Card>
  );
}
