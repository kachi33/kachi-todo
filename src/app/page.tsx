'use client';

import HOMECARD from "@/components/ui/HomeCard";
import HomeTodoList from "@/components/HomeTodoList";

const Home: React.FC = () => {
  return (
      <div className=" w-full px-4 md:px-6 pb-6">
          {/* Welcome Section */}
            <HOMECARD />

          <HomeTodoList />
      </div>
  );
};

export default Home;
