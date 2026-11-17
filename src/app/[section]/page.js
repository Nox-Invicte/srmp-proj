import ModulePage from "./module-client";

export function generateStaticParams() {
  return ["credentials", "lifecycle", "revocation", "events", "detections", "investigations", "attack-chains", "scenarios", "reports", "settings"].map((section) => ({ section }));
}

export default async function Page({ params }) {
  const { section } = await params;
  return <ModulePage section={section} />;
}
