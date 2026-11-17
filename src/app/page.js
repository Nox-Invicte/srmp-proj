"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRef } from "react";
import { credentials, detections, events, navigation } from "@/lib/fixtures";

const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  key: <><circle cx="8" cy="15" r="5"/><path d="m11.5 11.5 8-8 2 2-2 2 2 2-3 3-2-2-2 2"/></>,
  cycle: <><path d="M20 7h-5V2"/><path d="M4 17h5v5"/><path d="M5.6 9a7 7 0 0 1 12-2L20 9M4 15l2.4 2a7 7 0 0 0 12-2"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  activity: <><path d="M3 12h4l3-8 4 16 3-8h4"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  nodes: <><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m8 8 8 8M18 5v5M15 8h6M6 15v5m-3-3h6"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/></>,
};

function Icon({ name, size = 18, className = "" }) {
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] || paths.grid}</svg>;
}

function BrandMark() {
  return <div className="brand-mark" aria-hidden="true"><span/><span/><span/><span/></div>;
}

function Sidebar({ active, setActive }) {
  return <aside className="sidebar">
    <Link className="brand" href="/" aria-label="Credential to Cloud overview"><BrandMark/><span>credential<span className="brand-light">to</span>cloud<small>SECURITY RESEARCH</small></span></Link>
    <div className="workspace-label">WORKSPACE</div>
    <div className="workspace-switch"><div className="workspace-avatar">R</div><span>Research Lab<small>Local environment</small></span><span className="chevrons">v</span></div>
    <nav aria-label="Main navigation">
      <div className="nav-section">PLATFORM</div>
      {navigation.slice(0, 4).map((item) => <Link key={item.label} href={item.href} onClick={() => setActive(item.label)} className={`nav-link ${active === item.label ? "selected" : ""}`}><Icon name={item.icon}/><span>{item.label}</span>{item.count && <b className={item.alert ? "nav-count alert-count" : "nav-count"}>{item.count}</b>}</Link>)}
      <div className="nav-section nav-section-spaced">DETECTION & RESPONSE</div>
      {navigation.slice(4, 9).map((item) => <Link key={item.label} href={item.href} onClick={() => setActive(item.label)} className={`nav-link ${active === item.label ? "selected" : ""}`}><Icon name={item.icon}/><span>{item.label}</span>{item.count && <b className="nav-count alert-count">{item.count}</b>}</Link>)}
      <div className="nav-section nav-section-spaced">REPORTING</div>
      <Link href="/reports" onClick={() => setActive("Reports")} className={`nav-link ${active === "Reports" ? "selected" : ""}`}><Icon name="file"/><span>Reports</span></Link><Link href="/settings" className="nav-link"><Icon name="activity"/><span>Settings</span></Link>
    </nav>
    <div className="sidebar-bottom"><div className="connection-status"><i/> All systems operational</div><a className="profile" href="#settings"><div className="profile-avatar">JD</div><span>Jordan Davis<small>Security researcher</small></span><span className="more"> |  |  | </span></a></div>
  </aside>;
}

function MetricCard({ icon, label, value, delta, tone, foot }) {
  return <article className="metric-card"><div className="metric-top"><div className={`metric-icon ${tone}`}><Icon name={icon} size={18}/></div><span className="metric-delta">{delta}</span></div><div className="metric-value">{value}</div><div className="metric-label">{label}</div><div className="metric-foot">{foot}</div></article>;
}

function Status({ state }) {
  const cls = state.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill ${cls}`}><i/>{state}</span>;
}

export default function Home() {
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All states");
  const [scenario, setScenario] = useState(false);
  const [scenarioName, setScenarioName] = useState("Developer-to-cloud attack simulation");
  const [range, setRange] = useState("Last 24 hours");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [providerFilter, setProviderFilter] = useState("All providers");
  const [environmentFilter, setEnvironmentFilter] = useState("All environments");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [notice, setNotice] = useState("");
  const searchRef = useRef(null);
  const activeCredentialCount = credentials.filter((item) => item.state === "Active").length;
  const highRiskCredentialCount = credentials.filter((item) => item.risk.length > 0).length;
  const providerCount = new Set(credentials.map((item) => item.provider)).size;
  const previewRows = rows.slice(0, 6);
  const stateCount = (state) => credentials.filter((item) => item.state === state).length;
  const lifecycleValues = [
    { label: "Active", value: stateCount("Active"), color: "#7869f4" },
    { label: "Grace period", value: stateCount("Grace period"), color: "#39bd96" },
    { label: "Rotation pending", value: stateCount("Rotation pending"), color: "#efa557" },
    { label: "Revocation pending", value: stateCount("Revocation pending"), color: "#ee706e" },
    { label: "Other", value: credentials.length - stateCount("Active") - stateCount("Grace period") - stateCount("Rotation pending") - stateCount("Revocation pending"), color: "#49515e" },
  ];
  let lifecycleCursor = 0;
  const lifecycleGradient = lifecycleValues.map(({ value, color }) => {
    const start = lifecycleCursor;
    lifecycleCursor += value / credentials.length * 100;
    return `${color} ${start}% ${lifecycleCursor}%`;
  }).join(", ");
  const rows = useMemo(() => credentials.filter((item) => {
    const matchesQuery = `${item.name} ${item.id} ${item.owner} ${item.provider}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (filter === "All states" || item.state.toLowerCase() === filter.toLowerCase()) && (providerFilter === "All providers" || item.provider === providerFilter) && (environmentFilter === "All environments" || item.env === environmentFilter);
  }), [query, filter, providerFilter, environmentFilter]);
  const runScenario = () => {
    setScenario(false);
    setNotice(`${scenarioName} local preview completed. Expected stages are shown in the scenario module; no experiment records or provider calls were created.`);
  };

  return <div className="app-shell" id="overview">
    <Sidebar active={active} setActive={setActive}/>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="top-actions"><span className="local-badge"><i/> LOCAL</span><button className="icon-button" aria-label="Focus credential search" onClick={() => {searchRef.current?.focus();document.getElementById("credentials")?.scrollIntoView({behavior:"smooth"});}}><Icon name="search"/></button><button className="icon-button notification" aria-label="Notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}><span/>Bell</button><div className="top-avatar">JD</div>{notificationsOpen&&<div className="notification-popover"><strong>Recent notifications</strong><p><i className="notice-critical"/> Revoked credential used in CI  |  4 min ago</p><p><i className="notice-review"/> 2 credentials need owner review  |  1 hr ago</p><button onClick={()=>setNotificationsOpen(false)}>Dismiss</button></div>}</div></header>
      <div className="page-content">
        <section className="page-heading"><div><div className="eyebrow">MONDAY, NOVEMBER 17, 2026 <span className="eyebrow-dot"> | </span> RESEARCH LAB</div><h1>Security overview</h1><p>Monitor credential posture and investigate activity across your environment.</p></div><div className="heading-actions"><label className="button secondary range-select"><Icon name="cycle" size={16}/><select aria-label="Time range" value={range} onChange={(e)=>{setRange(e.target.value);setNotice(`Showing the ${e.target.value.toLowerCase()} synthetic overview window.`);}}><option>Last 24 hours</option><option>Last 7 days</option><option>Last 30 days</option></select><span className="button-caret">v</span></label><button className="button primary" onClick={() => setScenario(!scenario)}><Icon name="play" size={15}/>{scenario ? "Choose scenario" : "Run scenario"}</button></div></section>
        {scenario && <div className="scenario-launcher"><div><strong>Run synthetic scenario</strong><span>Local fixture simulation  |  no external systems</span></div><select aria-label="Choose scenario" value={scenarioName} onChange={(e)=>setScenarioName(e.target.value)}><option>Developer-to-cloud attack simulation</option><option>Normal developer activity</option><option>Credential rotation</option><option>Residual credential usage</option><option>Suspected credential compromise</option><option>Orphaned credential abuse</option></select><button className="button primary" onClick={runScenario}>Start local run</button><button className="quiet-close" onClick={()=>setScenario(false)} aria-label="Close scenario launcher">×</button></div>}
        {notice && <div className="scenario-notice"><span className="notice-pulse"/>{notice}<button onClick={()=>setNotice("")} aria-label="Dismiss">×</button></div>}
        <section className="metric-grid" aria-label="Posture metrics"><MetricCard icon="key" label="Sample records" value={credentials.length} delta="Synthetic demo data" tone="purple" foot={`Across ${providerCount} source types`}/><MetricCard icon="shield" label="Active records" value={activeCredentialCount} delta={`${Math.round(activeCredentialCount / credentials.length * 100)}% of sample`} tone="green" foot="Lifecycle state is illustrative"/><MetricCard icon="target" label="Risk flagged" value={highRiskCredentialCount} delta="Synthetic labels" tone="orange" foot="Includes demo risk attributes"/><MetricCard icon="activity" label="Demo detections" value={detections.length} delta="Fixture examples" tone="red" foot="Not connected to a detector"/></section>
        <div className="overview-grid">
          <section className="panel lifecycle-panel" id="lifecycle"><div className="panel-heading"><div><h2>Credential lifecycle</h2><p>Distribution across synthetic sample records</p></div><button className="more-button" aria-label="Lifecycle details" onClick={() => setNotice("Lifecycle transitions are presentation metadata only; this prototype does not run a lifecycle engine.")}> |  |  | </button></div><div className="lifecycle-content"><div className="donut-wrap"><div className="donut" style={{background:`conic-gradient(${lifecycleGradient})`}}><div className="donut-center"><strong>{credentials.length}</strong><span>Records</span></div></div></div><div className="legend">{lifecycleValues.map((item, index)=><div key={item.label}><i style={{background:item.color}}/><span>{item.label}</span><b>{item.value}</b></div>)}</div></div><div className="panel-note"><span className="note-check">DEMO</span> Lifecycle values are illustrative labels, not verified credential status</div></section>
          <section className="panel detections-panel" id="threat-detections"><div className="panel-heading"><div><h2>Recent detections <span className="heading-count">3</span></h2><p>Items requiring analyst attention</p></div><Link className="text-link" href="/detections">View all <span>&rarr;</span></Link></div><div className="detection-list">{detections.map((d) => <article className="detection-row" key={d.id}><div className={`source-icon ${d.color}`}>{d.initials}</div><div className="detection-copy"><div className="detection-title">{d.title}</div><div className="detection-detail">{d.detail}</div></div><div className="detection-meta"><span className={`severity ${d.severity.toLowerCase()}`}>{d.severity}</span><span>{d.time}</span></div></article>)}</div><div className="detection-footer"><span><i/> Detection engine up to date</span><span>Updated just now</span></div></section>
        </div>
        <section className="panel credentials-panel" id="credentials"><div className="panel-heading credentials-heading"><div><h2>Credential inventory</h2><p>Review synthetic metadata and SecretBench-inspired demo findings</p></div><Link className="button secondary small-button" href="/credentials">View inventory <span>&rarr;</span></Link></div><div className="table-toolbar"><label className="search-field"><Icon name="search" size={16}/><input aria-label="Search credentials" placeholder="Search credentials..." value={query} ref={searchRef} onChange={(e) => setQuery(e.target.value)}/><kbd>Ctrl K</kbd></label><label className="filter-field"><span className="sr-only">Filter by lifecycle state</span><select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All states</option><option>Active</option><option>Rotation pending</option><option>Grace period</option><option>Revocation pending</option></select><span>v</span></label><button className={`filter-button ${filtersOpen ? "filter-active" : ""}`} onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="activity" size={15}/> Filters</button></div>{filtersOpen && <div className="extra-filters"><label>Provider<select value={providerFilter} onChange={(e)=>setProviderFilter(e.target.value)}><option>All providers</option>{[...new Set(credentials.map((item)=>item.provider))].map((provider)=><option key={provider}>{provider}</option>)}</select></label><label>Environment<select value={environmentFilter} onChange={(e)=>setEnvironmentFilter(e.target.value)}><option>All environments</option>{[...new Set(credentials.map((item)=>item.env))].map((env)=><option key={env}>{env}</option>)}</select></label><button onClick={()=>{setProviderFilter("All providers");setEnvironmentFilter("All environments");setFilter("All states");setQuery("");}}>Clear all</button></div>}<div className="table-scroll"><table><thead><tr><th>CREDENTIAL</th><th>PROVIDER</th><th>OWNER</th><th>ENVIRONMENT</th><th>LIFECYCLE</th><th>LAST USED</th><th/></tr></thead><tbody>{previewRows.map((item) => <tr key={item.id}><td><div className="credential-name"><div className={`provider-mark ${item.color}`}>{item.provider.slice(0,1)}</div><span><strong>{item.name}</strong><small>{item.id}</small></span></div></td><td>{item.provider}</td><td>{item.owner === "Unassigned" ? <span className="unassigned">Unassigned</span> : item.owner}</td><td><span className="env-label">{item.env}</span></td><td><Status state={item.state}/></td><td className="used-time">{item.used}</td><td><button className="row-more" aria-label={`Open details for ${item.name}`} onClick={() => setSelectedCredential(selectedCredential === item.id ? null : item.id)}> |  |  | </button></td></tr>)}{rows.length === 0 && <tr><td colSpan="7" className="empty-row">No synthetic credentials match this search.</td></tr>}</tbody></table></div>{selectedCredential && <div className="credential-detail"><div><strong>{credentials.find((item)=>item.id===selectedCredential)?.name}</strong><span>{selectedCredential} · Metadata only · No secret value stored</span></div><Link href="/credentials">Open credentials module</Link><button onClick={()=>setSelectedCredential(null)} aria-label="Close credential details">×</button></div>}<div className="table-bottom"><span>Showing <strong>{Math.min(rows.length, previewRows.length)}</strong> of {rows.length} matching records</span><Link href="/credentials" className="text-link">Open full inventory <span>&rarr;</span></Link></div></section>
        <div className="bottom-grid"><section className="panel events-panel" id="event-monitor"><div className="panel-heading"><div><h2>Recent security events</h2><p>Latest activity from connected sources</p></div><Link href="/events" className="text-link">Event monitor <span>&rarr;</span></Link></div><div className="events-list">{events.map((e) => <div className="event-row" key={e.time}><span className="event-time">{e.time}</span><span className="event-source">{e.source}</span><span className="event-action">{e.action}</span><span className="event-identity">{e.identity}</span><span className={`event-result ${e.tone}`}>{e.result}</span></div>)}</div></section><section className="panel experiment-panel" id="scenarios"><div className="experiment-head"><div className="experiment-icon"><Icon name="nodes" size={18}/></div><span className="experiment-state"><i/> READY</span></div><div className="eyebrow">SYNTHETIC SCENARIO</div><h2>Developer to cloud</h2><p>Explore a simulated attack chain across endpoint, repository, CI/CD, identity, and cloud events.</p><div className="experiment-bottom"><div><span>EXPECTED STAGES</span><strong>7 events <i> | </i> 5 layers</strong></div><button onClick={() => setScenario(true)} aria-label="Run developer to cloud scenario">&rarr;</button></div></section></div>
        <footer className="page-footer"><span><BrandMark/> Credential-to-Cloud <i> | </i> Local research prototype</span><span>v0.1.0 <i> | </i> Synthetic data only</span></footer>
      </div>
    </main>
  </div>;
}
