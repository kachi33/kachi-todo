import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-6">Page not found</p>
      <Link href="/">
        <Button variant="outline" className="">Go back home</Button>
      </Link>
    </div>
  )
}
