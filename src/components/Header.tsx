
import { useGameState } from "@/context/GameStateContext";
import { FlaskConical, Skull, FileText, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/utils/formatNumber";

const Header = () => {
  const { state } = useGameState();
  const { resources } = state;

  return (
    <header className="bg-biohazard-900 border-b border-biohazard-700 py-4 px-6">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FlaskConical className="w-8 h-8 mr-3 text-toxic-400" />
            <h1 className="text-2xl font-bold tracking-tight text-toxic-400">The Breeding Pits</h1>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-biohazard-800 px-3 py-2 rounded-md border border-biohazard-700">
                    <FileText className="w-5 h-5 mr-2 text-clinical-300 stat-icon" />
                    <div>
                      <p className="text-sm text-clinical-300">Human Test Reports</p>
                      <p className="font-semibold text-white">{formatNumber(resources.humanTestReports)}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Your research currency</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-biohazard-800 px-3 py-2 rounded-md border border-biohazard-700">
                    <FlaskConical className="w-5 h-5 mr-2 text-toxic-400 stat-icon" />
                    <div>
                      <p className="text-sm text-clinical-300">Production</p>
                      <p className="font-semibold text-white">{formatNumber(resources.totalProduction)}/s</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Mosquitoes produced per second</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-biohazard-800 px-3 py-2 rounded-md border border-biohazard-700">
                    <Skull className="w-5 h-5 mr-2 text-warning-500 stat-icon" />
                    <div>
                      <p className="text-sm text-clinical-300">Lethality</p>
                      <p className="font-semibold text-white">{(resources.lethality * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>How deadly your mosquitoes are</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center bg-biohazard-800 px-3 py-2 rounded-md border border-biohazard-700">
                    <AlertTriangle className="w-5 h-5 mr-2 text-warning-500 stat-icon" />
                    <div>
                      <p className="text-sm text-clinical-300">Ethical Warnings</p>
                      <p className="font-semibold text-white">{resources.ethicalWarningsDismissed}/{resources.ethicalWarningsDismissed + resources.ethicalWarnings}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="tooltip-warning">
                  <p>Ethical guidelines you've dismissed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
