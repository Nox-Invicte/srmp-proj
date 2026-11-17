export const credentials = [
  { id: "cred_01H8K2", name: "Production deploy key", provider: "GitHub", type: "Fine-grained token", owner: "Platform team", env: "Production", state: "Active", risk: ["High privilege"], used: "4 min ago", color: "violet" },
  { id: "cred_01H7P9", name: "Artifact registry", provider: "npm", type: "Automation token", owner: "Build service", env: "CI/CD", state: "Rotation pending", risk: ["Expiring soon"], used: "18 min ago", color: "orange" },
  { id: "cred_01H6W4", name: "Cloud deploy role", provider: "AWS IAM", type: "OIDC role", owner: "Platform team", env: "Production", state: "Active", risk: [], used: "32 min ago", color: "amber" },
  { id: "cred_01H5D1", name: "Legacy staging key", provider: "Internal", type: "Service token", owner: "Unassigned", env: "Staging", state: "Revocation pending", risk: ["Orphaned", "Suspected compromise"], used: "2 hr ago", color: "rose" },
  { id: "cred_01H4B8", name: "Terraform automation", provider: "HCP Terraform", type: "Team token", owner: "Infrastructure", env: "Development", state: "Grace period", risk: [], used: "Yesterday", color: "teal" },
  // Synthetic SecretBench-inspired presentation rows; no dataset secret values are stored.
  { id: "demo_sb_001", name: "Demo · Payments API finding · true-secret label", provider: "GitHub repository", type: "API key pattern", owner: "Payments team", env: "Development", state: "Revocation pending", risk: ["Suspected compromise"], used: "12 min ago", color: "rose", source: "SecretBench-inspired synthetic record", label: "True secret" },
  { id: "demo_sb_002", name: "Demo · Docs sample finding · true-secret label", provider: "GitHub repository", type: "Cloud key pattern", owner: "Developer experience", env: "Testing", state: "Verified invalid", risk: [], used: "3 days ago", color: "teal", source: "SecretBench-inspired synthetic record", label: "True secret" },
  { id: "demo_sb_003", name: "Demo · Example config pattern · false-positive label", provider: "GitHub repository", type: "Access token pattern", owner: "Platform team", env: "Development", state: "Active", risk: [], used: "Never", color: "violet", source: "SecretBench-inspired synthetic record", label: "False positive" },
  { id: "demo_sb_004", name: "Demo · Archived CI finding · true-secret label", provider: "GitHub repository", type: "Automation key pattern", owner: "Build service", env: "CI/CD", state: "Revoked", risk: ["High privilege"], used: "Yesterday", color: "orange", source: "SecretBench-inspired synthetic record", label: "True secret" },
  { id: "demo_sb_005", name: "Demo · Placeholder pattern · false-positive label", provider: "GitHub repository", type: "Password pattern", owner: "Unassigned", env: "Staging", state: "Active", risk: ["Orphaned"], used: "Never", color: "amber", source: "SecretBench-inspired synthetic record", label: "False positive" },
  ...Array.from({ length: 50 }, (_, index) => {
    const number = String(index + 6).padStart(3, "0");
    const categories = ["API keys and secrets", "Authentication token", "Private key", "Generic secret", "Database URL", "Password", "Other"];
    const fileTypes = [".js", ".json", ".py", ".yaml", ".env", ".toml", ".txt"];
    const owners = ["Platform team", "Payments team", "Build service", "Developer experience", "Unassigned"];
    const labels = index < 8 ? "True-secret label" : "False-positive label";
    const category = categories[index % categories.length];
    return {
      id: `demo_sb_${number}`,
      name: `Demo · ${category} candidate · ${labels.toLowerCase()}`,
      provider: "GitHub repository (synthetic)",
      type: `${category} pattern`,
      owner: owners[index % owners.length],
      env: ["Development", "Testing", "CI/CD", "Staging"][index % 4],
      state: index < 8 ? "Revocation pending" : "Active",
      risk: index < 8 ? ["Suspected compromise"] : [],
      used: index < 8 ? `${index + 1} hr ago` : "Never",
      color: ["violet", "orange", "teal", "amber", "rose"][index % 5],
      source: "SecretBench-inspired synthetic record",
      label: index < 8 ? "True secret (demo label)" : "False positive (demo label)",
      fileType: fileTypes[index % fileTypes.length],
      template: index % 6 === 0,
    };
  }),
];

export const detections = [
  { id: "DET-2481", title: "Revoked credential used in CI workflow", detail: "Legacy staging key · build #1842", time: "4 min ago", severity: "Critical", initials: "CI", color: "rose" },
  { id: "DET-2480", title: "High privilege token used from new location", detail: "Production deploy key · 10.24.8.12", time: "27 min ago", severity: "High", initials: "GH", color: "orange" },
  { id: "DET-2479", title: "Credential owner is unassigned", detail: "Legacy staging key · lifecycle context", time: "1 hr ago", severity: "Medium", initials: "ID", color: "blue" },
  { id: "DET-DEMO-01", title: "Demo true-secret label · triage required", detail: "Payments API credential finding · demo_sb_001", time: "12 min ago", severity: "High", initials: "SB", color: "rose" },
  { id: "DET-DEMO-02", title: "Demo false-positive label · cleared", detail: "Example config token pattern · demo_sb_003", time: "25 min ago", severity: "Low", initials: "SB", color: "blue" },
];

export const events = [
  { time: "10:42:18", source: "GitHub Actions", action: "Workflow token authenticated", identity: "build-runner-04", result: "Success", tone: "green" },
  { time: "10:39:02", source: "AWS CloudTrail", action: "Assumed role · deploy-prod", identity: "svc-release", result: "Success", tone: "green" },
  { time: "10:36:51", source: "Synthetic service", action: "Revocation check · still accepted", identity: "cred_01H5D1", result: "Review", tone: "orange" },
  { time: "10:31:27", source: "Developer endpoint", action: "Package install warning", identity: "dev-workstation-12", result: "Flagged", tone: "rose" },
  { time: "10:28:14", source: "Synthetic repository scan", action: "Demo candidate labeled true secret", identity: "demo_sb_001", result: "Review", tone: "orange" },
  { time: "10:25:03", source: "Synthetic repository scan", action: "Demo placeholder labeled false positive", identity: "demo_sb_003", result: "Cleared", tone: "green" },
];

export const navigation = [
  { label: "Overview", icon: "grid", href: "/" },
  { label: "Credentials", icon: "key", href: "/credentials", count: "24" },
  { label: "Lifecycle", icon: "cycle", href: "/lifecycle" },
  { label: "Revocation checks", icon: "shield", href: "/revocation" },
  { label: "Event monitor", icon: "activity", href: "/events" },
  { label: "Threat detections", icon: "target", href: "/detections", count: "3", alert: true },
  { label: "Investigations", icon: "search", href: "/investigations" },
  { label: "Attack chains", icon: "nodes", href: "/attack-chains" },
  { label: "Scenarios", icon: "play", href: "/scenarios" },
  { label: "Reports", icon: "file", href: "/reports" },
  { label: "Settings", icon: "activity", href: "/settings" },
];
