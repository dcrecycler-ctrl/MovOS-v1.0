import { B } from '@/lib/tokens'
import { CSSProperties } from 'react'

export function DashboardSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: B.bg }}>

      {/* Fake TopBar */}
      <div style={{
        height: 64, background: B.surface, borderBottom: `1px solid ${B.hairline}`,
        display: 'flex', alignItems: 'center', padding: '0 32px', gap: 24,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Bone w={28} h={28} style={{ borderRadius: 9 }} />
        <Bone w={60} h={16} />
        <div style={{ display: 'flex', gap: 6, flex: 1 }}>
          {[72, 84, 60, 96, 100, 80, 70].map((w, i) => <Bone key={i} w={w} h={28} style={{ borderRadius: 9999 }} />)}
        </div>
        <Bone w={200} h={34} style={{ borderRadius: 9999 }} />
        <Bone w={38} h={38} style={{ borderRadius: 9999 }} />
        <Bone w={38} h={38} style={{ borderRadius: 9999 }} />
        <Bone w={120} h={38} style={{ borderRadius: 9999 }} />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-7 pb-24 md:pb-16">

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Bone w={140} h={26} />
            <Bone w={100} h={14} />
            <Bone w={220} h={14} />
          </div>
          <Bone w={80} h={36} style={{ borderRadius: 9999 }} />
        </div>

        {/* KPI row — 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mb-3.5">
          {/* Hero KPI */}
          <Bone w="100%" h={160} style={{ borderRadius: 16 }} />
          {[...Array(4)].map((_, i) => (
            <Bone key={i} w="100%" h={100} style={{ borderRadius: 14 }} />
          ))}
        </div>

        {/* Alerts row — 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-3.5">
          {[...Array(2)].map((_, col) => (
            <div key={col} style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, padding: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Bone w={180} h={18} />
                  <Bone w={240} h={13} />
                </div>
                <Bone w={80} h={22} style={{ borderRadius: 9999 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: B.surface2, borderRadius: 12 }}>
                    <Bone w={42} h={42} style={{ borderRadius: 12, flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Bone w="60%" h={13} />
                      <Bone w="80%" h={12} />
                    </div>
                    <Bone w={56} h={22} style={{ borderRadius: 9999 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Locations heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Bone w={100} h={18} />
            <Bone w={200} h={13} />
          </div>
          <Bone w={70} h={30} style={{ borderRadius: 9999 }} />
        </div>

        {/* Locations — 4 cols */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-3.5">
          {[...Array(4)].map((_, i) => (
            <Bone key={i} w="100%" h={i === 0 ? 160 : 130} style={{ borderRadius: 16 }} />
          ))}
        </div>

        {/* Parts card */}
        <div style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, padding: 26, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Bone w={200} h={18} />
              <Bone w={150} h={13} />
            </div>
            <Bone w={90} h={30} style={{ borderRadius: 9999 }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: B.surface2, borderRadius: 14 }}>
                <Bone w={38} h={38} style={{ borderRadius: 11, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Bone w="70%" h={13} />
                  <Bone w="50%" h={11} />
                </div>
                <Bone w={44} h={20} style={{ borderRadius: 9999 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Contracts heading */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Bone w={200} h={18} />
            <Bone w={260} h={13} />
          </div>
          <Bone w={70} h={30} style={{ borderRadius: 9999 }} />
        </div>

        {/* Contracts — 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: B.surface, borderRadius: 16, border: `1px solid ${B.hairline}`, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Bone w={60} h={11} />
                  <Bone w={160} h={16} />
                  <Bone w={100} h={12} />
                </div>
                <Bone w={70} h={22} style={{ borderRadius: 9999 }} />
              </div>
              <div style={{ display: 'flex', gap: 0, padding: '14px 0', borderTop: `1px solid ${B.hairline}`, borderBottom: `1px solid ${B.hairline}`, marginBottom: 14 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Bone w={80} h={11} />
                  <Bone w={40} h={26} />
                  <Bone w={60} h={11} />
                </div>
                <div style={{ flex: 1, paddingLeft: 20, borderLeft: `1px solid ${B.hairline}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Bone w={80} h={11} />
                  <Bone w={80} h={14} />
                  <Bone w={60} h={11} />
                </div>
              </div>
              <Bone w={160} h={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Bone({ w, h, style }: { w: number | string; h: number; style?: CSSProperties }) {
  return (
    <div
      className="animate-pulse"
      style={{
        width: w, height: h,
        background: B.surface2,
        borderRadius: 6,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

export default function Loading() {
  return <DashboardSkeleton />
}
