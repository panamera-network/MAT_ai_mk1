// frontend/src/services/identityService.ts
// Persona resolution from MAT-AI-OS's identity profile (port 8000).

const OS_BASE = 'http://localhost:8000'

export type Persona = 'trader' | 'creator' | 'sme' | 'student'

export const PERSONAS: Persona[] = ['trader', 'creator', 'sme', 'student']

export interface Identity {
  name?: string
  nickname?: string
  profession?: string[]
  // Not in the identity schema today — checked first so a future backend
  // persona field wins over profession-based derivation without a UI change.
  persona?: string
}

export async function fetchIdentity(): Promise<Identity> {
  const res = await fetch(`${OS_BASE}/identity`)
  if (!res.ok) throw new Error(`Identity ${res.status}`)
  return res.json() as Promise<Identity>
}

/**
 * Map an identity onto a workspace persona:
 * 1. explicit `persona` field when present and known,
 * 2. first match in the `profession` list (e.g. ["trader","developer"] → trader),
 * 3. trader as the default.
 */
export function resolvePersona(identity: Identity | null): Persona {
  if (!identity) return 'trader'

  const explicit = (identity.persona || '').toLowerCase().trim()
  if ((PERSONAS as string[]).includes(explicit)) return explicit as Persona

  for (const raw of identity.profession ?? []) {
    const p = raw.toLowerCase().trim()
    const match = PERSONAS.find((persona) => p === persona || p.includes(persona))
    if (match) return match
  }

  return 'trader'
}
