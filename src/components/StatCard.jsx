import { Card } from './ui/card';
// We remove the 'LucideIcon' import as it was only used as a TypeScript type.

// We also remove the 'StatCardProps' interface and the type annotation from the function.
export function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2 font-bold">{title}</p>
          <h3 className="text-2xl">{value}</h3>
        </div>
        <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110">
          <Icon className="h-6 w-6 text-red-500" />
        </div>
      </div>
    </Card>
  );
}