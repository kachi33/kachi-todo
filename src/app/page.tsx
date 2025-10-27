'use client';

import { useState } from "react";
import HOMECARD from "@/components/ui/HomeCard";
import HomeTodoList, { MockState } from "@/components/HomeTodoList";
import DevStateToggler from "@/components/DevStateToggler";

const Home: React.FC = () => {
  const [mockState, setMockState] = useState<MockState>(null);

  return (
      <div className=" w-full px-4 md:px-6 pb-6">
          {/* Welcome Section */}
            <HOMECARD mockState={mockState} />

          <HomeTodoList mockState={mockState} />

          {/* Dev State Toggler - only visible in development */}
          <DevStateToggler
            currentState={mockState}
            onStateChange={setMockState}
          />
      </div>
  );
};

export default Home;
