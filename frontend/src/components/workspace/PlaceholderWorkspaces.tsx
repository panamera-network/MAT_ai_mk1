// frontend/src/components/workspace/PlaceholderWorkspaces.tsx
// Placeholder workspaces for personas without a real implementation yet
// (sme, student). Same left-panel slot as TradingWorkspace/CreatorWorkspace;
// each gets replaced with a real implementation in turn.

interface PlaceholderProps {
  icon: string
  title: string
  blurb: string
  planned: string[]
}

function PlaceholderWorkspace({ icon, title, blurb, planned }: PlaceholderProps): JSX.Element {
  return (
    <div className="placeholder-workspace">
      <div className="pw-icon">{icon}</div>
      <div className="pw-title">{title}</div>
      <div className="pw-blurb">{blurb}</div>
      <ul className="pw-planned">
        {planned.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="pw-note">Coming soon — chat works as usual on the right.</div>
    </div>
  )
}

export function SMEWorkspace(): JSX.Element {
  return (
    <PlaceholderWorkspace
      icon="🏪"
      title="SME Workspace"
      blurb="Small-business cockpit — planned surface for this panel:"
      planned={['Sales & cashflow overview', 'Invoices & quotations', 'Inventory snapshot', 'Customer follow-ups']}
    />
  )
}

export function StudentWorkspace(): JSX.Element {
  return (
    <PlaceholderWorkspace
      icon="📚"
      title="Student Workspace"
      blurb="Study companion — planned surface for this panel:"
      planned={['Course notes & summaries', 'Assignment deadlines', 'Flashcards & quizzes', 'Study session tracker']}
    />
  )
}
