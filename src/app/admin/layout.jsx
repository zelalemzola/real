import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold">
            Admin Dashboard
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  )
}

