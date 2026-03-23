import AppLayout from "@/components/layout/AppLayout";
import ComingSoon from "@/components/ui/comingsoon";

export default function GroupsPage() {
  return (
    <AppLayout title="My Groups">
      <ComingSoon
        title="My Groups"
        description="Create and manage your student groups. Assign work to specific classes, track group progress, and collaborate with ease."
      />
    </AppLayout>
  );
}
