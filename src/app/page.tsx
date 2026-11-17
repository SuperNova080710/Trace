import { TraceLab } from "@/components/trace-lab";
import { publicProfile } from "@/content/public-profile";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <TraceLab
        displayName={publicProfile.displayName}
        contactEmail={publicProfile.contactEmail}
      />
    </main>
  );
}
