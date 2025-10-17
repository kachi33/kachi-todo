import { ThemeToggle } from "@/components/ThemeToggle";
import ProductivityStats from "@/components/ProductivityStats";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, BarChart3, List } from "lucide-react";

const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-background transition-colors">
      <div className="flex justify-between items-center p-4 md:p-6">
        <h1 className="md:text-2xl text-xl font-bold text-foreground">
          Kachi's <span className="text-amber-700">ToDo</span>
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 md:px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-card-foreground">Welcome Back!</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Track your productivity and stay on top of your tasks
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/todos">
                <Button className="">
                  <Plus className="h-4 w-4 mr-2" />
                  View All Todos
                </Button>
              </Link>
              <Link to="/lists">
                <Button variant="outline" className="">
                  <List className="h-4 w-4 mr-2" />
                  Manage Lists
                </Button>
              </Link>
            </div>
          </div>

          {/* Productivity Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">
              Your Productivity Stats
            </h2>
            <ProductivityStats />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
