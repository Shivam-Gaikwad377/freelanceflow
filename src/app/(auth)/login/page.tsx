"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError("Invalid email or password")
      return
    }

    
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      {error && <p>{error}</p>}
      <label className="flex flex-col gap-1">
        Email
        <input name="email" type="email" required />
      </label>
      <label className="flex flex-col gap-1">
        Password
        <input name="password" type="password" required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}