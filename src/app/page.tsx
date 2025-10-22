'use client';

import ThemeToggle from "@/components/ThemeToggle";
import ProductivityStats from "@/components/ProductivityStats";
import HOMECARD from "@/components/ui/HomeCard";
import HomeTodoList from "@/components/HomeTodoList";
import OfflineStatus from "@/components/OfflineStatus";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, List } from "lucide-react";

const Home: React.FC = () => {
  return (
      <div className=" w-full px-4 md:px-6 pb-6">
        {/* <div className="max-w-2xl mx-auto space-y-6"> */}

          {/* Welcome Section */}
            <HOMECARD />

          <HomeTodoList />
        {/* </div> */}
      </div>
  );
};

export default Home;
