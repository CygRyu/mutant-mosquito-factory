
import { useState } from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, AlertTriangle, Skull, Zap } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";

const MutationLab = () => {
  const { state, dispatch } = useGameState();
  const { vats, availableMutations, resources } = state;
  
  const [selectedVat, setSelectedVat] = useState<number | null>(vats.length > 0 ? vats[0].id : null);
  const [warningMutation, setWarningMutation] = useState<string | null>(null);
  
  const handlePurchaseMutation = (mutationId: string) => {
    const mutation = availableMutations.find(m => m.id === mutationId);
    
    if (mutation && mutation.warningLevel > 0 && !mutation.purchased) {
      setWarningMutation(mutationId);
    } else if (selectedVat !== null) {
      dispatch({ 
        type: 'PURCHASE_MUTATION', 
        payload: { mutationId, vatId: selectedVat } 
      });
    }
  };
  
  const handleDismissWarning = () => {
    if (warningMutation && selectedVat !== null) {
      dispatch({
        type: 'DISMISS_ETHICAL_WARNING',
        payload: { mutationId: warningMutation }
      });
      
      dispatch({ 
        type: 'PURCHASE_MUTATION', 
        payload: { mutationId: warningMutation, vatId: selectedVat } 
      });
      
      setWarningMutation(null);
    }
  };
  
  const handleCancelWarning = () => {
    setWarningMutation(null);
  };
  
  const getWarningMutation = () => {
    return warningMutation ? availableMutations.find(m => m.id === warningMutation) : null;
  };
  
  const getWarningLevelText = (level: number) => {
    switch(level) {
      case 1: return "Low Risk";
      case 2: return "Moderate Risk";
      case 3: return "Severe Risk";
      default: return "Unknown";
    }
  };
  
  const selectedVatData = vats.find(v => v.id === selectedVat);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-clinical-100">Mutation Laboratory</h2>
          <p className="text-sm text-clinical-300">Enhance your mosquito breeding with genetic modifications</p>
        </div>
        
        <div className="min-w-[180px]">
          <Select 
            value={selectedVat?.toString() || ""} 
            onValueChange={(value) => setSelectedVat(parseInt(value))}
          >
            <SelectTrigger className="bg-biohazard-800 border-biohazard-700">
              <SelectValue placeholder="Select a vat" />
            </SelectTrigger>
            <SelectContent className="bg-biohazard-800 border-biohazard-700">
              {vats.map(vat => (
                <SelectItem key={vat.id} value={vat.id.toString()}>
                  {vat.name} (Lvl {vat.level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {availableMutations
          .filter(mutation => mutation.unlocked)
          .map(mutation => {
            const isVatSelected = selectedVat !== null;
            const hasSelectedVatMutation = selectedVatData?.mutations.includes(mutation.id) || false;
            const canAfford = resources.humanTestReports >= mutation.cost;
            
            return (
              <Card 
                key={mutation.id} 
                className={`bg-biohazard-800 border-biohazard-700 
                  ${mutation.purchased ? 'opacity-80' : ''}
                  ${mutation.warningLevel > 1 ? 'border-warning-900/50' : ''}
                  ${mutation.warningLevel > 2 ? 'border-warning-600' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <FlaskConical className={`w-5 h-5 mr-2 ${
                        mutation.warningLevel === 1 ? 'text-toxic-400' : 
                        mutation.warningLevel === 2 ? 'text-warning-500' :
                        'text-warning-600'
                      }`} />
                      <CardTitle className="text-lg">{mutation.name}</CardTitle>
                    </div>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={`
                            ${mutation.warningLevel === 1 ? 'bg-toxic-900 hover:bg-toxic-800' : 
                              mutation.warningLevel === 2 ? 'bg-warning-900 hover:bg-warning-800' :
                              'bg-warning-800 hover:bg-warning-700 animate-pulse-slow'}
                          `}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {getWarningLevelText(mutation.warningLevel)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="tooltip-warning">
                          <p>Ethical Concern: {mutation.ethicalConcern}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <CardDescription>{mutation.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-toxic-400">
                        <FlaskConical className="w-4 h-4 mr-1" />
                        <span className="text-sm">Production Bonus</span>
                      </div>
                      <Badge variant="outline" className="font-mono bg-biohazard-700 text-toxic-400">
                        +{(mutation.productionBonus * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-warning-500">
                        <Skull className="w-4 h-4 mr-1" />
                        <span className="text-sm">Lethality</span>
                      </div>
                      <Badge variant="outline" className="font-mono bg-biohazard-700 text-warning-500">
                        +{(mutation.lethality * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Basic</span>
                        <span>Advanced</span>
                      </div>
                      <Progress 
                        value={50 + mutation.warningLevel * 15} 
                        className="h-2" 
                        indicatorClassName={`${
                          mutation.warningLevel === 1 ? 'bg-toxic-400' : 
                          mutation.warningLevel === 2 ? 'bg-warning-500' :
                          'bg-warning-600'
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-1">
                  <Button 
                    onClick={() => handlePurchaseMutation(mutation.id)} 
                    disabled={!isVatSelected || hasSelectedVatMutation || !canAfford || mutation.purchased}
                    className={`w-full ${
                      mutation.warningLevel === 1 ? 'bg-biohazard-700 hover:bg-biohazard-600' : 
                      mutation.warningLevel === 2 ? 'bg-biohazard-600 hover:bg-warning-900' :
                      'bg-warning-900 hover:bg-warning-800'
                    } text-white`}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {hasSelectedVatMutation ? "Already Applied" : 
                     mutation.purchased ? "Researched" : 
                     `Apply (${formatNumber(mutation.cost)} HTR)`}
                  </Button>
                </CardFooter>
              </Card>
            );
        })}
      </div>
      
      {/* Ethical Warning Dialog */}
      <AlertDialog open={warningMutation !== null} onOpenChange={(open) => !open && setWarningMutation(null)}>
        <AlertDialogContent className="bg-biohazard-900 border border-warning-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warning-500 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Ethical Protocol Warning
            </AlertDialogTitle>
            <AlertDialogDescription className="text-clinical-100">
              {getWarningMutation()?.ethicalConcern && (
                <div className="space-y-4">
                  <p className="text-white">
                    This modification raises significant ethical concerns:
                  </p>
                  <div className="bg-warning-950 p-3 rounded border border-warning-900 text-warning-100">
                    {getWarningMutation()?.ethicalConcern}
                  </div>
                  <p>
                    Our internal review board recommends against proceeding with this modification.
                    Continuing may result in unpredictable consequences and potential hazards.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelWarning}
              className="bg-biohazard-700 hover:bg-biohazard-600 text-white border-0"
            >
              Cancel Modification
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDismissWarning}
              className="bg-warning-700 hover:bg-warning-600 text-white border-0"
            >
              Dismiss Warning
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MutationLab;
