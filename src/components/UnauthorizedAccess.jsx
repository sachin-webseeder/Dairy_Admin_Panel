import { ShieldX } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

// The 'UnauthorizedAccessProps' interface is removed as it's TypeScript-specific.

export function UnauthorizedAccess({ onNavigate }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-8 max-w-md text-center">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Button
          onClick={() => onNavigate('dashboard')}
          className="bg-red-500 hover:bg-red-600"
        >
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
}