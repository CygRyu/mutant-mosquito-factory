
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VatManager from "@/components/VatManager";
import MutationLab from "@/components/MutationLab";
import Statistics from "@/components/Statistics";
import DeploymentTab from "@/components/DeploymentTab";
import FacilitiesTab from "@/components/FacilitiesTab";

const Dashboard = () => {
  return (
    <div className="w-full p-4 bg-biohazard-950">
      <Tabs defaultValue="vats" className="w-full">
        <TabsList className="w-full bg-biohazard-900 mb-6">
          <TabsTrigger 
            value="vats" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Breeding Vats
          </TabsTrigger>
          <TabsTrigger 
            value="mutations" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Mutation Lab
          </TabsTrigger>
          <TabsTrigger 
            value="deployment" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Deployment
          </TabsTrigger>
          <TabsTrigger 
            value="facilities" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Facilities
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="flex-1 data-[state=active]:text-toxic-400 data-[state=active]:bg-biohazard-800"
          >
            Production Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vats" className="mt-0">
          <VatManager />
        </TabsContent>
        
        <TabsContent value="mutations" className="mt-0">
          <MutationLab />
        </TabsContent>
        
        <TabsContent value="deployment" className="mt-0">
          <DeploymentTab />
        </TabsContent>
        
        <TabsContent value="facilities" className="mt-0">
          <FacilitiesTab />
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <Statistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
