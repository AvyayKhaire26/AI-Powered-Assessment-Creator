import AppLayout from "@/components/layout/AppLayout";
import ComingSoon from "@/components/ui/comingsoon";

export default function SettingsPage() {
  return (
    <AppLayout title="Settings">
      <ComingSoon
        title="Settings"
        description="Manage your profile, school details, notification preferences, and account settings."
      />
    </AppLayout>
  );
}
