import { DS, FONTS } from '@/lib/tokens'
import { CSSProperties } from 'react'

// Named export so page.tsx can reuse it inside its own Suspense boundary
export function DashboardSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ds-bg)', fontFamily: FONTS.mono }}>

      {/* Nav skeleton */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 52, background: 'var(--ds-bg-1)',
        borderBottom: '1px solid var(--ds-border)',
        display: 'flex', alignItems: 'center', padding: '0 36px', gap: 24,
      }}>
        <Bone w={80} h={18} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[90,80,60,90,110,80,70].map((w, i) => <Bone key={i} w={w} h={10} />)}
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 36px 64px' }}>

        {/* Page header skeleton */}
        <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--ds-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <Bone w={160} h={24} style={{ marginBottom: 8 }} />
            <Bone w={240} h={10} />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[100,60,60,60,60].map((w, i) => <Bone key={i} w={w} h={26} />)}
          </div>
        </div>

        {/* Row 1 — KPI Cards */}
        <div style={{ display: 'flex', gap: 1, marginBottom: 20, background: 'var(--ds-border)' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              flex: 1, padding: '16px 18px 14px',
              background: 'var(--ds-bg-1)',
              borderTop: `2px solid var(--ds-border-2)`,
            }}>
              <Bone w={70} h={9} style={{ marginBottom: 12 }} />
              <Bone w={100} h={38} style={{ marginBottom: 8 }} />
              <Bone w={140} h={9} />
            </div>
          ))}
        </div>

        {/* Row 2 — Two columns */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          {[...Array(2)].map((_, col) => (
            <div key={col} style={{ flex: 1, border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
              <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
                <Bone w={160} h={9} />
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  height: 44, borderBottom: '1px solid var(--ds-border)',
                  display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px',
                }}>
                  <Bone w={70}  h={9} />
                  <Bone w={80}  h={9} />
                  <Bone w={200} h={9} />
                  <Bone w={60}  h={9} style={{ marginLeft: 'auto' }} />
                </div>
              ))}
              <SkeletonFooter />
            </div>
          ))}
        </div>

        {/* Row 3 — 2/3 + 1/3 */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 2, border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
            <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
              <Bone w={140} h={9} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--ds-border)' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ padding: '16px 18px 14px', background: 'var(--ds-bg-1)', borderTop: '2px solid var(--ds-border-2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div><Bone w={120} h={14} style={{ marginBottom: 6 }} /><Bone w={80} h={9} /></div>
                    <Bone w={40} h={28} />
                  </div>
                  <Bone w="100%" h={2} style={{ marginBottom: 10 }} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Bone w={40} h={22} />
                    <Bone w={40} h={22} />
                    <Bone w={60} h={22} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
            <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
              <Bone w={120} h={9} />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ height: 44, borderBottom: '1px solid var(--ds-border)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
                <Bone w={60} h={9} /><Bone w={130} h={9} /><Bone w={70} h={9} />
              </div>
            ))}
            <SkeletonFooter />
          </div>
        </div>

        {/* Row 4 — Contracts */}
        <div style={{ border: '1px solid var(--ds-border)', background: 'var(--ds-bg-1)' }}>
          <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--ds-border)' }}>
            <Bone w={180} h={9} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--ds-border)' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', background: 'var(--ds-bg-1)', borderTop: '2px solid var(--ds-border-2)',
              }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <Bone w={100} h={16} /><Bone w={60} h={16} />
                  </div>
                  <Bone w={130} h={9} style={{ marginBottom: 10 }} />
                  <Bone w={90} h={9} />
                </div>
                <Bone w={50} h={36} />
              </div>
            ))}
          </div>
          <SkeletonFooter />
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton primitives ──────────────────────────────────────────────────────

function Bone({ w, h, style }: { w: number | string; h: number; style?: CSSProperties }) {
  return (
    <div style={{
      width: w, height: h,
      background: 'var(--ds-border)',
      borderRadius: 0,
      flexShrink: 0,
      opacity: 0.8,
      ...style,
    }} />
  )
}

function SkeletonFooter() {
  return (
    <div style={{
      height: 36, borderTop: '1px solid var(--ds-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Bone w={140} h={9} />
    </div>
  )
}

// Default export required by Next.js route segment convention
export default function Loading() {
  return <DashboardSkeleton />
}
