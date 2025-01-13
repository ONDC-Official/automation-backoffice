// src/components/MainContent.jsx
import { useState } from "react";
import Sidebar from "./side-bar";
// import { FaHome } from "react-icons/fa";
// import { TbTestPipe2Filled } from "react-icons/tb";
// import { GoWorkflow } from "react-icons/go";
// import { PiNetwork } from "react-icons/pi";
import Dashboard from "./dashboard/index";
import { AiFillApi } from "react-icons/ai";
import { SiMockserviceworker } from "react-icons/si";
import { TbReportAnalytics } from "react-icons/tb";
import NotFoundPage from "./ui/not-found";

const MainContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar starts expanded
  const [activeTab, setActiveTab] = useState("#api-service");
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full w-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={[
          {
            id: "#api-service",
            label: "API Service",
            icon: <AiFillApi className="text-xl" />,
          },
          {
            id: "#mock-service",
            label: "Mock Service",
            icon: <SiMockserviceworker className="text-xl" />,
          },
          {
            id: "#reporting-service",
            label: "Reporting service",
            icon: <TbReportAnalytics className="text-xl" />,
          },
        ]}
      />

      <div
        className={`flex-1 p-2 mt-2 transition-all duration-300 ${
          isSidebarOpen ? " ml-64" : "ml-20"
        }`}
      >
        <GetMainContent activeTab={activeTab} />
      </div>
    </div>
  );
};

function GetMainContent({
  activeTab,
}: {
  activeTab: string;
}) {
  switch (activeTab) {
    case "#api-service":
      return <Dashboard label={"API Service Cache"} db_id={0} />;
    case "#mock-service":
      return <Dashboard label={"Mock Service Cache"} db_id={1} />;
    case "#reporting-service":
      return <Dashboard label={"Reporting Service Cache"} db_id={2} />;
    default:
      return <NotFoundPage />;
  }
}

export default MainContent;
