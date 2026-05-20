import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const OPERATOR_ROLES = ['operator', 'inspector', 'mechanic']

async function getUserRole(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    return data?.role ?? null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Must be called before any redirects — refreshes the session cookie
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/login'

  // No session → send to login
  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Has session but on login page → send to correct home based on role
  if (user && isLoginPage) {
    const role = await getUserRole(supabase, user.id)
    const url = request.nextUrl.clone()
    url.pathname = role && OPERATOR_ROLES.includes(role) ? '/operator/tasks' : '/'
    return NextResponse.redirect(url)
  }

  // /operator/* routes: only operator/inspector/mechanic roles allowed
  if (user && pathname.startsWith('/operator')) {
    const role = await getUserRole(supabase, user.id)
    if (!role || !OPERATOR_ROLES.includes(role)) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
