import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function UpdatedSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Account Settings</h2>
        <p className="text-muted-foreground">Manage your application and security settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Business Information</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="Dynasty Premium" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@dynastypremium.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
              </div>
              <Button className="bg-red-500 hover:bg-red-600">Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Account Email</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email-setting">Email Address</Label>
                <Input id="email-setting" type="email" defaultValue="admin@dairydash.com" />
              </div>
              <p className="text-sm text-muted-foreground">
                This email will be used for account notifications and password recovery
              </p>
              <Button className="bg-red-500 hover:bg-red-600">Update Email</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button className="bg-red-500 hover:bg-red-600">Update Password</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}