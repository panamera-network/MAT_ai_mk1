// frontend/src/components/workspace/PlaceholderWorkspaces.tsx
// Placeholder workspaces for the non-trader personas. Same left-panel slot as
// TradingWorkspace; real implementations replace these one by one.

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

export function CreatorWorkspace(): JSX.Element {
  return (
    <PlaceholderWorkspace
      icon="🎨"
      title="Creator Workspace"
      blurb="Content pipeline for creators — planned surface for this panel:"
      planned={['Content calendar & drafts', 'Asset library', 'Publishing queue', 'Engagement analytics']}
    />
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
