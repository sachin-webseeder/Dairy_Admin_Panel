import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { User, Mail, Phone, Shield } from 'lucide-react';

// ✨ CHANGED: Removed 'default' so it matches 'import { ProfileSettings }' in App.jsx
export function ProfileSettings() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">View and manage your personal information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-red-100 text-red-600 text-xl font-bold">AD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Dynasty Admin</CardTitle>
              <CardDescription>Super Admin • admin@dairydash.com</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input defaultValue="Dynasty Admin" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Role
              </Label>
              <Input defaultValue="Super Admin" disabled className="bg-gray-50" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input defaultValue="admin@dairydash.com" disabled className="bg-gray-50" />
              <p className="text-xs text-muted-foreground">Contact support to change email</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input defaultValue="+91 98765 43210" />
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}