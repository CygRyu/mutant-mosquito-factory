
import { GameStateProvider } from "@/context/GameStateContext";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <GameStateProvider>
      <div className="min-h-screen flex flex-col bg-biohazard-950 text-clinical-100">
        <Header />
        <main className="flex-1 container mx-auto py-6">
          <Dashboard />
        </main>
        <footer className="bg-biohazard-900 border-t border-biohazard-700 py-4 px-6">
          <div className="container mx-auto text-center text-biohazard-300 text-sm">
            <p>The Breeding Pits · Classified Research Facility · Clearance Level: Alpha</p>
          </div>
        </footer>
      </div>
    </GameStateProvider>
  );
};

export default Index;
