"use client"

import React, { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

export function Footer() {
  const router = useRouter()

  // quick access: 5 taps within window OR long-press (>700ms) to go to /admin
  const tapsRef = useRef(0)
  const resetTimerRef = useRef<number | null>(null)
  const longPressRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)
      if (longPressRef.current) window.clearTimeout(longPressRef.current)
    }
  }, [])

  function handleClick() {
    tapsRef.current += 1
    // reset taps after 2.5s of inactivity
    if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    resetTimerRef.current = window.setTimeout(() => (tapsRef.current = 0), 2500)

    // if enough taps, navigate
    if (tapsRef.current >= 5) {
      tapsRef.current = 0
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
      }
      router.push("/admin")
    }
  }

  function handlePointerDown() {
    // long press -> 700ms
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    longPressRef.current = window.setTimeout(() => {
      // clear tap timer as we are navigating
      tapsRef.current = 0
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
        resetTimerRef.current = null
      }
      router.push("/admin")
    }, 700)
  }

  function handlePointerUp() {
    if (longPressRef.current) {
      window.clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }

  return (
    <footer className="border-t mt-auto relative">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">CemiSoft - Derechos Reservados {new Date().getFullYear()}</p>
      </div>

      {/* Invisible hotspot: bottom-right corner. Multiple taps or long-press to open admin. */}
      <div
        aria-hidden
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute bottom-0 right-0 w-12 h-12 z-50"
        style={{ opacity: 0 }}
      />
    </footer>
  )
}
