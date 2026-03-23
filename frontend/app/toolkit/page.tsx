import AppLayout from "@/components/layout/AppLayout";
import ComingSoon from "@/components/ui/comingsoon";

export default function ToolkitPage() {
  return (
    <AppLayout title="AI Teacher's Toolkit">
      <ComingSoon
        title="AI Teacher's Toolkit"
        description="A suite of AI-powered tools — lesson plan generator, rubric builder, student feedback assistant, and more — coming soon."
      />
    </AppLayout>
  );
}
