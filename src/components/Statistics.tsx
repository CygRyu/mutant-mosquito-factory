
import { useGameState } from "@/context/GameStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Skull, BugOff, TrendingUp, AlertTriangle, Beaker, BadgeInfo } from "lucide-react";
import { formatNumber } from "@/utils/formatNumber";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartTooltip,
  Legend
} from "recharts";

// This would be real data in a full implementation
// For demo, we'll generate mock historical data based on current stats
const generateMockData = (state: any) => {
  const { resources } = state;
  const mockData = [];
  
  // Generate some data points showing growth over time
  const base = resources.mosquitoesProduced;
  const factor = Math.max(0.1, resources.totalProduction / 10);
  
  for (let i = 1; i <= 7; i++) {
    mockData.push({
      day: `Day ${i}`,
      production: Math.max(0, base * (0.5 + i * 0.1) * factor / (10 - i)),
      lethality: resources.lethality * (0.9 + i * 0.05),
      warnings: Math.floor(resources.ethicalWarningsDismissed * i / 7),
    });
  }
  
  return mockData;
};

const Statistics = () => {
  const { state } = useGameState();
  const { resources } = state;
  
  const mockHistoricalData = generateMockData(state);
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-clinical-100">Production Statistics</h2>
        <p className="text-sm text-clinical-300">Analyze your mosquito production data</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Beaker className="w-4 h-4 mr-2 text-toxic-400" />
              Total Mosquitoes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-toxic-400">
              {formatNumber(resources.mosquitoesProduced)}
            </div>
            <p className="text-xs text-clinical-300 mt-1">
              Current production: {formatNumber(resources.totalProduction)}/s
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-clinical-300" />
              Production Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-clinical-300">
              {(resources.totalProduction / Math.max(1, state.vats.length)).toFixed(2)}
            </div>
            <p className="text-xs text-clinical-300 mt-1">
              Per vat average
            </p>
            <Progress 
              value={Math.min(100, (resources.totalProduction / Math.max(1, state.vats.length)) * 10)} 
              className="h-2 mt-2"
              indicatorClassName="bg-clinical-400"
            />
          </CardContent>
        </Card>
        
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Skull className="w-4 h-4 mr-2 text-warning-500" />
              Lethality Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-500">
              {(resources.lethality * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-clinical-300 mt-1">
              Danger level: {resources.lethality < 0.3 ? 'Low' : resources.lethality < 0.6 ? 'Moderate' : 'High'}
            </p>
            <Progress 
              value={resources.lethality * 100} 
              className="h-2 mt-2"
              indicatorClassName="bg-warning-500"
            />
          </CardContent>
        </Card>
        
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-warning-500" />
              Ethical Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-500">
              {state.ethicsLevel === 0 ? "Compliant" : 
               state.ethicsLevel === 1 ? "Minor Violations" :
               state.ethicsLevel === 2 ? "Major Violations" :
               "Critical Breach"}
            </div>
            <p className="text-xs text-clinical-300 mt-1">
              Warnings dismissed: {resources.ethicalWarningsDismissed}
            </p>
            <Progress 
              value={100 - state.ethicsLevel * 33} 
              className="h-2 mt-2"
              indicatorClassName={state.ethicsLevel === 0 ? "bg-toxic-400" : "bg-warning-500"}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader>
            <CardTitle className="text-lg">Production History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockHistoricalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#98e02a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#98e02a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5c53" />
                  <XAxis dataKey="day" stroke="#92c9bb" />
                  <YAxis stroke="#92c9bb" />
                  <RechartTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1c3e36', 
                      borderColor: '#468e7e',
                      color: '#e0f2fe'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="production" 
                    stroke="#98e02a" 
                    fillOpacity={1} 
                    fill="url(#colorProduction)" 
                    name="Mosquito Production"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-biohazard-800 border-biohazard-700">
          <CardHeader>
            <CardTitle className="text-lg">Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockHistoricalData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorLethality" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d5c53" />
                  <XAxis dataKey="day" stroke="#92c9bb" />
                  <YAxis stroke="#92c9bb" />
                  <RechartTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1c3e36', 
                      borderColor: '#468e7e',
                      color: '#e0f2fe'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="lethality" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorLethality)" 
                    name="Lethality Factor"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="warnings" 
                    stroke="#f97316" 
                    fillOpacity={1} 
                    fill="url(#colorWarnings)" 
                    name="Ethical Warnings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-biohazard-800 border-biohazard-700 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BadgeInfo className="w-5 h-5 mr-2 text-clinical-300" />
            Research Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-clinical-200">
            {state.ethicsLevel === 0 ? (
              "Initial breeding experiments show promising results. Standard mosquito production is efficient and meets military specifications. Consider genetic modifications to improve lethality metrics."
            ) : state.ethicsLevel === 1 ? (
              "Basic genetic modifications have improved production metrics. Ethical concerns have been noted but deemed acceptable for military requirements. More advanced mutations available for research."
            ) : state.ethicsLevel === 2 ? (
              "Advanced genetic engineering has created highly lethal specimens. Internal review board warnings have been bypassed. Exercise caution with further modifications as containment risks increase."
            ) : (
              "WARNING: Multiple critical ethical violations registered. Specimens now display extreme lethality profiles. All safety protocols have been compromised. Recommend immediate facility containment review."
            )}
          </p>
          
          {state.ethicsLevel >= 2 && (
            <div className="p-3 bg-warning-950/60 border border-warning-900 rounded-md flex items-start space-x-3 text-warning-200">
              <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-warning-100">SECURITY NOTICE</p>
                <p className="text-sm">
                  Multiple containment breaches detected in sector {Math.floor(Math.random() * 10) + 1}. 
                  Human casualties reported. Emergency protocols initiated.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
