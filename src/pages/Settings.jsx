import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export function Settings() {
  const handleResetData = () => {
    // Clear all localStorage except user auth
    const keysToPreserve = ['dynasty_premium_users', 'dynasty_premium_current_user'];
    const keysToRemove = []; // Removed ': string[]'
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToPreserve.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    toast.success('Data reset successfully! Reloading...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Business Information</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" defaultValue="DairyDash" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@dairydash.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Main Street, City" />
              </div>
              <Button className="bg-red-500 hover:bg-red-600">Save Changes</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Operating Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Monday - Friday</Label>
                  <p className="text-sm text-muted-foreground">6:00 AM - 10:00 PM</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Saturday - Sunday</Label>
                  <p className="text-sm text-muted-foreground">7:00 AM - 9:00 PM</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email about your account activity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new orders arrive</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Alert when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>System Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about system updates</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-red-500 hover:bg-red-600">Update Password</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable 2FA</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Subscription Plan</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4>Pro Plan</h4>
                  <p className="text-sm text-muted-foreground">$49/month • Unlimited orders</p>
                </div>
                <Button variant="outline">Manage Plan</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p>Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                </div>
                <Button variant="outline">Update</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2">Data Persistence</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  All changes made in the admin panel are automatically saved to your browser's local storage 
                  and will persist across page refreshes, navigation, and logout/login sessions.
                </p>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm"><strong>Persistent Data Includes:</strong></p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Products, Orders, Customers</li>
                    <li>Branches, Delivery Staff</li>
                    <li>Push Notifications</li>
                    <li>Homepage Settings</li>
                    <li>All CRUD operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-200">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-50">
                <RotateCcw className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-red-600">Reset All Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will reset all data to default values. Your user account will be preserved, 
                  but all products, orders, customers, branches, and other data will be restored to 
                  their original state.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will reset all data to defaults including:
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          <li>All products, orders, and customers</li>
                          <li>Branch and delivery staff information</li>
                          <li>Push notifications</li>
                          <li>Homepage settings</li>
                        </ul>
                        <p className="mt-3 font-semibold">Your user account and login will remain intact.</p>
                        <p className="mt-2">This action cannot be undone.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleResetData}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Yes, Reset All Data
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}