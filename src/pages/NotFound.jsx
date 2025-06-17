import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button";

 function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-stone-200 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Button>

      <Link to="/">
            Go back to Home
      </Link>
          </Button>
    </div>
  )
}

export default NotFound;