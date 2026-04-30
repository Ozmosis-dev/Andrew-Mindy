'use client'

import { usePathname } from 'next/navigation'
import NavBarWrapper from './NavBarWrapper'
import CustomCursor from './CustomCursor'
import GSAPInit from './GSAPInit'
import TopBlurMask from './TopBlurMask'

export default function SiteChrome() {
  const pathname = usePathname()
  if (pathname.startsWith('/portal')) return null
  return (
    <>
      <CustomCursor />
      <GSAPInit />
      <TopBlurMask />
      <NavBarWrapper />
    </>
  )
}
