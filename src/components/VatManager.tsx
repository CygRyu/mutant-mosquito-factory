
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FlaskConical, Beaker, Plus, ArrowUp, ToggleLeft, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";

const VatManager = () => {
  const { state, dispatch } = useGameState();
  const { vats, availableMutations, resources } = state;

  const handleUpgradeVat = (vatId: number) => {
    dispatch({ type: 'UPGRADE_VAT', payload: { vatId } });
  };

  const handleAddVat = () => {
    dispatch({ type: 'ADD_VAT' });
  };

  const handleToggleVat = (vatId: number) => {
    dispatch({ type: 'TOGGLE_VAT', payload: { vatId } });
  };

  const getVatUpgradeCost = (level: number) => {
    return level * 200;
  };

  const getNewVatCost = () => {
    return vats.length * 500;
  };

  const getMutationById = (id: string) => {
    return availableMutations.find(m => m.id === id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-clinical-100">Larvae Breeding Vats</h2>
          <p className="text-sm text-clinical-300">Manage your mosquito breeding facilities</p>
        </div>
        <Button 
          onClick={handleAddVat} 
          className="mt-4 md:mt-0 bg-biohazard-700 hover:bg-biohazard-600 text-white"
          disabled={resources.humanTestReports < getNewVatCost()}
        >
          <Plus className="w-4 h-4 mr-2" /> 
          New Vat ({formatNumber(getNewVatCost())} HTR)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vats.map(vat => (
          <Card key={vat.id} className={`bg-biohazard-800 border-biohazard-700 ${!vat.active ? 'opacity-75' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FlaskConical className={`w-5 h-5 mr-2 ${vat.active ? 'text-toxic-400' : 'text-gray-400'}`} />
                  <CardTitle className="text-lg">{vat.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-clinical-300">Active</span>
                  <Switch 
                    checked={vat.active} 
                    onCheckedChange={() => handleToggleVat(vat.id)} 
                  />
                </div>
              </div>
              <CardDescription className="flex items-center mt-1">
                <Beaker className="w-4 h-4 mr-1 text-clinical-300" />
                <span>Level {vat.level} Breeding Facility</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="vat-container rounded-lg p-4 h-32 relative overflow-hidden">
                <div 
                  className="vat-liquid absolute bottom-0 left-0 right-0 animate-pulse-slow"
                  style={{ height: '75%' }}
                ></div>
                
                {/* Bubbles */}
                <div 
                  className="vat-bubble absolute w-3 h-3 rounded-full animate-bubble"
                  style={{ bottom: '20%', left: '20%' }}
                ></div>
                <div 
                  className="vat-bubble absolute w-2 h-2 rounded-full animate-bubble"
                  style={{ bottom: '40%', left: '60%', animationDelay: '1s' }}
                ></div>
                <div 
                  className="vat-bubble absolute w-4 h-4 rounded-full animate-bubble"
                  style={{ bottom: '30%', left: '80%', animationDelay: '1.5s' }}
                ></div>
                
                {/* Mosquito silhouettes */}
                <div className="absolute w-full h-full opacity-30">
                  {vat.mutations.length > 0 && (
                    <>
                      <div className="absolute w-5 h-2 bg-black rounded-full animate-wiggle"
                        style={{ top: '30%', left: '30%' }}></div>
                      <div className="absolute w-4 h-2 bg-black rounded-full animate-wiggle"
                        style={{ top: '50%', left: '70%', animationDelay: '0.7s' }}></div>
                      <div className="absolute w-6 h-2 bg-black rounded-full animate-wiggle"
                        style={{ top: '70%', left: '40%', animationDelay: '1.3s' }}></div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-clinical-300">Production Rate:</span>
                  <span className="text-toxic-400 font-medium">
                    {formatNumber(vat.active ? vat.production : 0)}/s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-clinical-300">Efficiency:</span>
                  <span className="text-toxic-400 font-medium">{(vat.efficiency * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-clinical-300">Mutations:</span>
                  <span className="text-toxic-400 font-medium">{vat.mutations.length}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-1 flex-col items-stretch">
              <div className="flex flex-wrap gap-2 mb-3">
                <TooltipProvider>
                  {vat.mutations.map((mutationId) => {
                    const mutation = getMutationById(mutationId);
                    if (!mutation) return null;
                    
                    return (
                      <Tooltip key={mutationId}>
                        <TooltipTrigger asChild>
                          <Badge 
                            className={`bg-biohazard-700 hover:bg-biohazard-600 
                              ${mutation.warningLevel === 2 ? 'border-warning-700' : ''}
                              ${mutation.warningLevel === 3 ? 'border-warning-600 border-2' : ''}`}
                          >
                            {mutation.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mutation.description}</p>
                          <p className="text-toxic-400">+{(mutation.productionBonus * 100).toFixed(0)}% Production</p>
                          <p className="text-warning-500">+{(mutation.lethality * 100).toFixed(0)}% Lethality</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
              
              <Button 
                onClick={() => handleUpgradeVat(vat.id)} 
                disabled={resources.humanTestReports < getVatUpgradeCost(vat.level)}
                className="w-full bg-biohazard-700 hover:bg-biohazard-600 text-white"
              >
                <ArrowUp className="w-4 h-4 mr-2" /> 
                Upgrade Vat ({formatNumber(getVatUpgradeCost(vat.level))} HTR)
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VatManager;
