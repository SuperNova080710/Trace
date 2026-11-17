import { TraceLab } from "@/components/trace-lab";
import { approvedOnly, narrative, publicProfile } from "@/content/public-profile";

export default function Home() {
  const publishedNarrative = approvedOnly(narrative);

  return (
    <main id="main-content" tabIndex={-1}>
      <TraceLab
        displayName={publicProfile.displayName}
        contactEmail={publicProfile.contactEmail}
        narrative={publishedNarrative}
      />
    </main>
  );
}
