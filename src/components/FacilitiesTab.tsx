
import { useState } from "react";
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Plus, Zap, Users } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";

const FacilitiesTab = () => {
  const { state, dispatch } = useGameState();
  const { resources, facilities, rooms } = state;
  const [activeTab, setActiveTab] = useState("rooms");

  const handleBuyRoom = (roomId: string) => {
    dispatch({ type: 'BUY_ROOM', payload: { roomId } });
  };

  const handleBuyEquipment = (equipmentId: string) => {
    dispatch({ type: 'BUY_EQUIPMENT', payload: { equipmentId } });
  };

  const handleUpgradeRoom = (roomId: string) => {
    dispatch({ type: 'UPGRADE_ROOM', payload: { roomId } });
  };

  const getRoomBonusLabel = (roomBonus: { type: string, value: number }) => {
    switch (roomBonus.type) {
      case 'productionMultiplier':
        return `+${(roomBonus.value * 100).toFixed(0)}% Production`;
      case 'capacityMultiplier':
        return `+${(roomBonus.value * 100).toFixed(0)}% Capacity`;
      case 'efficiencyBonus':
        return `+${(roomBonus.value * 100).toFixed(0)}% Efficiency`;
      case 'payRateBonus':
        return `+${(roomBonus.value * 100).toFixed(0)}% Client Pay Rate`;
      default:
        return `+${roomBonus.value} Bonus`;
    }
  };

  const getEquipmentBonusLabel = (equipmentBonus: { type: string, value: number }) => {
    switch (equipmentBonus.type) {
      case 'productionMultiplier':
        return `+${(equipmentBonus.value * 100).toFixed(0)}% Production`;
      case 'mutationDiscount':
        return `${(equipmentBonus.value * 100).toFixed(0)}% Mutation Cost`;
      case 'researchSpeed':
        return `+${(equipmentBonus.value * 100).toFixed(0)}% Research Speed`;
      default:
        return `+${equipmentBonus.value} Bonus`;
    }
  };

  const renderRoomsList = () => {
    // Split into purchased and available rooms
    const purchasedRooms = rooms.filter(room => room.purchased);
    const availableRooms = rooms.filter(room => !room.purchased && room.unlocked);

    return (
      <>
        {purchasedRooms.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-clinical-100">Your Facilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {purchasedRooms.map(room => (
                <Card key={room.id} className="bg-biohazard-800 border-biohazard-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <Badge className="bg-toxic-700">Level {room.level}</Badge>
                    </div>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-clinical-300">Bonus:</span>
                        <span className="text-toxic-400 font-medium">{getRoomBonusLabel(room.bonus)}</span>
                      </div>
                      
                      <Progress 
                        value={room.level * 20} 
                        className="h-2 bg-biohazard-700" 
                        indicatorClassName="bg-toxic-400"
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleUpgradeRoom(room.id)} 
                      className="w-full bg-biohazard-700 hover:bg-biohazard-600"
                      disabled={resources.humanTestReports < room.upgradeCost}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade ({formatNumber(room.upgradeCost)} HTR)
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {availableRooms.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-clinical-100">Available Expansions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableRooms.map(room => (
                <Card key={room.id} className="bg-biohazard-800 border-biohazard-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>{room.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-clinical-300">Provides:</span>
                        <span className="text-toxic-400 font-medium">{getRoomBonusLabel(room.bonus)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleBuyRoom(room.id)} 
                      className="w-full bg-biohazard-700 hover:bg-biohazard-600"
                      disabled={resources.humanTestReports < room.cost}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Build ({formatNumber(room.cost)} HTR)
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {purchasedRooms.length === 0 && availableRooms.length === 0 && (
          <div className="text-center py-12">
            <Box className="w-12 h-12 text-biohazard-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-clinical-200">No Facilities Available</h3>
            <p className="text-clinical-300 mt-2">Produce more mosquitoes or advance your research to unlock facility expansions</p>
          </div>
        )}
      </>
    );
  };

  const renderEquipmentList = () => {
    // Split into purchased and available equipment
    const purchasedEquipment = facilities.filter(facility => facility.purchased);
    const availableEquipment = facilities.filter(facility => !facility.purchased && facility.unlocked);

    return (
      <>
        {purchasedEquipment.length > 0 && (
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-bold text-clinical-100">Your Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {purchasedEquipment.map(equipment => (
                <Card key={equipment.id} className="bg-biohazard-800 border-biohazard-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <CardDescription>{equipment.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-clinical-300">Bonus:</span>
                        <span className="text-toxic-400 font-medium">{getEquipmentBonusLabel(equipment.bonus)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {availableEquipment.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-clinical-100">Available Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {availableEquipment.map(equipment => (
                <Card key={equipment.id} className="bg-biohazard-800 border-biohazard-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{equipment.name}</CardTitle>
                    <CardDescription>{equipment.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-clinical-300">Provides:</span>
                        <span className="text-toxic-400 font-medium">{getEquipmentBonusLabel(equipment.bonus)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleBuyEquipment(equipment.id)} 
                      className="w-full bg-biohazard-700 hover:bg-biohazard-600"
                      disabled={resources.humanTestReports < equipment.cost}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Purchase ({formatNumber(equipment.cost)} HTR)
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {purchasedEquipment.length === 0 && availableEquipment.length === 0 && (
          <div className="text-center py-12">
            <Box className="w-12 h-12 text-biohazard-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-clinical-200">No Equipment Available</h3>
            <p className="text-clinical-300 mt-2">Produce more mosquitoes or advance your research to unlock equipment</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-clinical-100">Facility Management</h2>
          <p className="text-sm text-clinical-300">Expand your operation with new rooms and equipment</p>
        </div>
        <div className="bg-biohazard-800 p-3 rounded-lg">
          <p className="text-sm text-clinical-300">Available Funds</p>
          <p className="text-2xl font-bold text-toxic-400">{formatNumber(resources.humanTestReports)} HTR</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-biohazard-900 mb-6">
          <TabsTrigger 
            value="rooms" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Rooms & Facilities
          </TabsTrigger>
          <TabsTrigger 
            value="equipment" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Equipment & Machinery
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms" className="mt-0">
          {renderRoomsList()}
        </TabsContent>
        
        <TabsContent value="equipment" className="mt-0">
          {renderEquipmentList()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilitiesTab;
