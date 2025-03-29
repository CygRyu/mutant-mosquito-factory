
import { useState } from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Truck, Users, Skull, AlertTriangle } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";

export type Client = {
  id: string;
  name: string;
  description: string;
  payRate: number;
  requirements: {
    minMosquitoes: number;
    maxLethality?: number;
    minLethality?: number;
  };
  ethicalConcern: string;
  warningLevel: 1 | 2 | 3;
  unlocked: boolean;
  active: boolean;
};

const DeploymentTab = () => {
  const { state, dispatch } = useGameState();
  const { resources, availableClients } = state;
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [deploymentAmount, setDeploymentAmount] = useState<number>(1000);

  const handleDeploy = (clientId: string) => {
    const client = availableClients.find(c => c.id === clientId);
    if (!client) return;
    
    // Calculate the maximum amount we can deploy
    const maxDeployment = Math.min(deploymentAmount, resources.mosquitoesProduced);
    
    dispatch({ 
      type: 'DEPLOY_MOSQUITOES', 
      payload: { 
        clientId,
        amount: maxDeployment
      } 
    });
    
    setSelectedClient(null);
  };

  // Filter clients that are unlocked and meet requirements
  const eligibleClients = availableClients.filter(client => {
    if (!client.unlocked) return false;
    
    // Check if we have enough mosquitoes
    if (resources.mosquitoesProduced < client.requirements.minMosquitoes) return false;
    
    // Check lethality requirements
    if (client.requirements.minLethality && resources.lethality < client.requirements.minLethality) return false;
    if (client.requirements.maxLethality && resources.lethality > client.requirements.maxLethality) return false;
    
    return true;
  });

  const handleDeploymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDeploymentAmount(value);
    }
  };

  const getLethalityIndicator = (client: Client) => {
    if (client.requirements.minLethality && client.requirements.minLethality > 0.5) {
      return <Skull className="w-4 h-4 text-warning-600" />;
    }
    if (client.requirements.maxLethality && client.requirements.maxLethality < 0.2) {
      return <Badge className="bg-biohazard-600">Harmless</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-clinical-100">Mosquito Deployment</h2>
          <p className="text-sm text-clinical-300">Deploy your mosquitoes to clients for rewards</p>
        </div>
        <div className="bg-biohazard-800 p-3 rounded-lg">
          <p className="text-sm text-clinical-300">Available Mosquitoes</p>
          <p className="text-2xl font-bold text-toxic-400">{formatNumber(resources.mosquitoesProduced)}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="text-sm text-clinical-300 block mb-2">Deployment Amount</label>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1000" 
            max={Math.max(1000, Math.min(100000, resources.mosquitoesProduced))} 
            value={deploymentAmount}
            onChange={handleDeploymentAmountChange}
            className="w-full"
          />
          <span className="text-toxic-400 font-bold">{formatNumber(deploymentAmount)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {eligibleClients.map((client) => (
          <Card 
            key={client.id} 
            className={`bg-biohazard-800 border-biohazard-700 ${selectedClient === client.id ? 'ring-2 ring-toxic-400' : ''}`}
            onClick={() => setSelectedClient(client.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-toxic-400" />
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  {client.warningLevel > 1 && (
                    <AlertTriangle className={`w-4 h-4 ${client.warningLevel === 2 ? 'text-warning-500' : 'text-warning-600'}`} />
                  )}
                  {getLethalityIndicator(client)}
                </div>
              </div>
              <CardDescription>{client.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-clinical-300">Payment Rate:</span>
                  <span className="text-toxic-400 font-medium">{client.payRate} HTR per 1K</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-clinical-300">Min. Required:</span>
                  <span className="text-toxic-400 font-medium">{formatNumber(client.requirements.minMosquitoes)}</span>
                </div>
                
                {(client.requirements.minLethality || client.requirements.maxLethality) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-clinical-300">Lethality Range:</span>
                    <span className="text-toxic-400 font-medium">
                      {client.requirements.minLethality ? (client.requirements.minLethality * 100).toFixed(0) + '%' : '0%'} 
                      {' - '}
                      {client.requirements.maxLethality ? (client.requirements.maxLethality * 100).toFixed(0) + '%' : '100%'}
                    </span>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-clinical-400 italic mt-2">{client.ethicalConcern}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => handleDeploy(client.id)} 
                className="w-full bg-biohazard-700 hover:bg-biohazard-600"
                disabled={selectedClient !== client.id}
              >
                <Truck className="w-4 h-4 mr-2" />
                Deploy {formatNumber(deploymentAmount)} Mosquitoes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {eligibleClients.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-biohazard-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-clinical-200">No Eligible Clients</h3>
          <p className="text-clinical-300 mt-2">Produce more mosquitoes or modify their lethality to unlock clients</p>
        </div>
      )}
    </div>
  );
};

export default DeploymentTab;
