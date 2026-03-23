import AppLayout from "@/components/layout/AppLayout";
import ComingSoon from "@/components/ui/comingsoon";

export default function LibraryPage() {
  return (
    <AppLayout title="My Library">
      <ComingSoon
        title="My Library"
        description="All your saved question papers, templates, and reusable content in one place. Build your personal teaching resource bank."
      />
    </AppLayout>
  );
}
