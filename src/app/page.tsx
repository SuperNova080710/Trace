import { TraceLab } from "@/components/trace-lab";
import { approvedOnly, evidenceMetrics, narrative, publicProfile } from "@/content/public-profile";

export default function Home() {
  const publishedNarrative = approvedOnly(narrative);
  const publishedMetrics = approvedOnly(evidenceMetrics);

  return (
    <main id="main-content">
      <TraceLab
        displayName={publicProfile.displayName}
        contactEmail={publicProfile.contactEmail}
        narrative={publishedNarrative}
        metrics={publishedMetrics}
      />
    </main>
  );
}
