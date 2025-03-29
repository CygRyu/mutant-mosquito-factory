
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Types
export type Mutation = {
  id: string;
  name: string;
  description: string;
  cost: number;
  productionBonus: number;
  lethality: number;
  unlocked: boolean;
  purchased: boolean;
  ethicalConcern: string;
  warningLevel: 1 | 2 | 3;
};

export type Vat = {
  id: number;
  name: string;
  level: number;
  production: number;
  capacity: number;
  mutations: string[];
  efficiency: number;
  active: boolean;
};

export type ResourceStats = {
  humanTestReports: number;
  totalProduction: number;
  mosquitoesProduced: number;
  lethality: number;
  ethicalWarnings: number;
  ethicalWarningsDismissed: number;
};

export type GameState = {
  resources: ResourceStats;
  vats: Vat[];
  availableMutations: Mutation[];
  gameTime: number;
  lastUpdated: number;
  ethicsLevel: number;
};

// Initial state
const initialMutations: Mutation[] = [
  {
    id: "enhanced-proboscis",
    name: "Enhanced Proboscis",
    description: "Stronger piercing apparatus for more efficient feeding",
    cost: 100,
    productionBonus: 0.15,
    lethality: 0.1,
    unlocked: true,
    purchased: false,
    ethicalConcern: "Increased pain during feeding",
    warningLevel: 1,
  },
  {
    id: "venomous-saliva",
    name: "Venomous Saliva",
    description: "Modified saliva with mild paralytic properties",
    cost: 250,
    productionBonus: 0.2,
    lethality: 0.25,
    unlocked: true,
    purchased: false,
    ethicalConcern: "Causes temporary paralysis in subjects",
    warningLevel: 1,
  },
  {
    id: "rapid-metabolism",
    name: "Rapid Metabolism",
    description: "Accelerated growth cycle and breeding rate",
    cost: 400,
    productionBonus: 0.35,
    lethality: 0.05,
    unlocked: true,
    purchased: false,
    ethicalConcern: "Potential for uncontrolled population growth",
    warningLevel: 1,
  },
  {
    id: "acid-hemolymph",
    name: "Acidic Hemolymph",
    description: "Blood that can corrode organic material",
    cost: 800,
    productionBonus: 0.3,
    lethality: 0.5,
    unlocked: false,
    purchased: false,
    ethicalConcern: "Severe tissue damage on contact",
    warningLevel: 2,
  },
  {
    id: "neurotoxin",
    name: "Neurotoxin Production",
    description: "Deadly neurotoxin that attacks the central nervous system",
    cost: 1500,
    productionBonus: 0.25,
    lethality: 0.8,
    unlocked: false,
    purchased: false,
    ethicalConcern: "Fatal in 75% of cases",
    warningLevel: 3,
  },
  {
    id: "adaptive-immunity",
    name: "Adaptive Immunity",
    description: "Resistance to common pesticides and repellents",
    cost: 1200,
    productionBonus: 0.4,
    lethality: 0.3,
    unlocked: false,
    purchased: false,
    ethicalConcern: "Potentially uncontrollable in the wild",
    warningLevel: 2,
  },
  {
    id: "viral-vector",
    name: "Viral Vector",
    description: "Capable of transmitting engineered viruses",
    cost: 2000,
    productionBonus: 0.45,
    lethality: 0.9,
    unlocked: false,
    purchased: false,
    ethicalConcern: "Risk of pandemic-level spread",
    warningLevel: 3,
  },
];

const initialVats: Vat[] = [
  {
    id: 1,
    name: "Alpha Vat",
    level: 1,
    production: 1,
    capacity: 100,
    mutations: [],
    efficiency: 1,
    active: true,
  }
];

const initialGameState: GameState = {
  resources: {
    humanTestReports: 100,
    totalProduction: 1,
    mosquitoesProduced: 0,
    lethality: 0,
    ethicalWarnings: 0,
    ethicalWarningsDismissed: 0,
  },
  vats: initialVats,
  availableMutations: initialMutations,
  gameTime: 0,
  lastUpdated: Date.now(),
  ethicsLevel: 0,
};

// Actions
type Action =
  | { type: 'TICK' }
  | { type: 'PURCHASE_MUTATION', payload: { mutationId: string, vatId: number } }
  | { type: 'UPGRADE_VAT', payload: { vatId: number } }
  | { type: 'ADD_VAT' }
  | { type: 'TOGGLE_VAT', payload: { vatId: number } }
  | { type: 'DISMISS_ETHICAL_WARNING', payload: { mutationId: string } }
  | { type: 'SET_TIME', payload: number };

// Reducer
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'TICK':
      const currentTime = Date.now();
      const deltaTime = (currentTime - state.lastUpdated) / 1000; // in seconds
      
      // Calculate new production
      let newMosquitoesProduced = state.resources.mosquitoesProduced;
      let newHumanTestReports = state.resources.humanTestReports;
      
      state.vats.forEach(vat => {
        if (vat.active) {
          const vatProduction = vat.production * vat.efficiency * deltaTime;
          newMosquitoesProduced += vatProduction;
          newHumanTestReports += vatProduction * 0.5; // Each mosquito generates 0.5 reports
        }
      });
      
      return {
        ...state,
        resources: {
          ...state.resources,
          mosquitoesProduced: newMosquitoesProduced,
          humanTestReports: newHumanTestReports,
        },
        gameTime: state.gameTime + deltaTime,
        lastUpdated: currentTime,
      };
      
    case 'PURCHASE_MUTATION':
      const { mutationId, vatId } = action.payload;
      const mutation = state.availableMutations.find(m => m.id === mutationId);
      const vat = state.vats.find(v => v.id === vatId);
      
      if (!mutation || !vat || mutation.purchased || state.resources.humanTestReports < mutation.cost) {
        return state;
      }
      
      // Apply mutation to the vat
      const updatedVats = state.vats.map(v => {
        if (v.id === vatId) {
          return {
            ...v,
            mutations: [...v.mutations, mutationId],
            production: v.production * (1 + mutation.productionBonus),
            efficiency: v.efficiency,
          };
        }
        return v;
      });
      
      // Update mutations list
      const updatedMutations = state.availableMutations.map(m => {
        if (m.id === mutationId) {
          return { ...m, purchased: true };
        }
        if (!m.unlocked && m.warningLevel <= state.ethicsLevel + 1) {
          return { ...m, unlocked: true };
        }
        return m;
      });
      
      // Update resources
      return {
        ...state,
        vats: updatedVats,
        availableMutations: updatedMutations,
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - mutation.cost,
          totalProduction: state.vats.reduce((sum, v) => sum + (v.active ? v.production : 0), 0),
          lethality: state.resources.lethality + mutation.lethality
        }
      };
      
    case 'UPGRADE_VAT':
      const vatToUpgrade = state.vats.find(v => v.id === action.payload.vatId);
      
      if (!vatToUpgrade) {
        return state;
      }
      
      const upgradeCost = vatToUpgrade.level * 200;
      
      if (state.resources.humanTestReports < upgradeCost) {
        return state;
      }
      
      const vatsAfterUpgrade = state.vats.map(v => {
        if (v.id === action.payload.vatId) {
          return {
            ...v,
            level: v.level + 1,
            production: v.production * 1.2,
            capacity: v.capacity * 1.5,
          };
        }
        return v;
      });
      
      return {
        ...state,
        vats: vatsAfterUpgrade,
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - upgradeCost,
          totalProduction: vatsAfterUpgrade.reduce((sum, v) => sum + (v.active ? v.production : 0), 0),
        }
      };
      
    case 'ADD_VAT':
      const newVatCost = state.vats.length * 500;
      
      if (state.resources.humanTestReports < newVatCost) {
        return state;
      }
      
      const newVatId = Math.max(...state.vats.map(v => v.id)) + 1;
      const newVat: Vat = {
        id: newVatId,
        name: `Vat ${newVatId}`,
        level: 1,
        production: 1,
        capacity: 100,
        mutations: [],
        efficiency: 1,
        active: true,
      };
      
      return {
        ...state,
        vats: [...state.vats, newVat],
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - newVatCost,
          totalProduction: state.resources.totalProduction + (newVat.active ? newVat.production : 0),
        }
      };
      
    case 'TOGGLE_VAT':
      const updatedVatsAfterToggle = state.vats.map(v => {
        if (v.id === action.payload.vatId) {
          return { ...v, active: !v.active };
        }
        return v;
      });
      
      return {
        ...state,
        vats: updatedVatsAfterToggle,
        resources: {
          ...state.resources,
          totalProduction: updatedVatsAfterToggle.reduce((sum, v) => sum + (v.active ? v.production : 0), 0),
        }
      };
      
    case 'DISMISS_ETHICAL_WARNING':
      const warningMutation = state.availableMutations.find(m => m.id === action.payload.mutationId);
      
      if (!warningMutation) {
        return state;
      }
      
      // Increase ethics level when dismissing a warning
      const newEthicsLevel = Math.max(state.ethicsLevel, warningMutation.warningLevel);
      
      // Unlock more dangerous mutations
      const mutationsAfterDismissal = state.availableMutations.map(m => {
        if (m.id === action.payload.mutationId) {
          return { ...m };
        }
        if (!m.unlocked && m.warningLevel <= newEthicsLevel + 1) {
          return { ...m, unlocked: true };
        }
        return m;
      });
      
      return {
        ...state,
        availableMutations: mutationsAfterDismissal,
        ethicsLevel: newEthicsLevel,
        resources: {
          ...state.resources,
          ethicalWarningsDismissed: state.resources.ethicalWarningsDismissed + 1,
        }
      };
      
    case 'SET_TIME':
      return {
        ...state,
        lastUpdated: action.payload,
      };
      
    default:
      return state;
  }
};

// Context
type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
};

const GameStateContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    // Set initial time
    dispatch({ type: 'SET_TIME', payload: Date.now() });
    
    // Game tick every second
    const gameInterval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    
    return () => clearInterval(gameInterval);
  }, []);

  // Show ethical warnings when ethics level increases
  useEffect(() => {
    if (state.ethicsLevel === 1) {
      toast({
        title: "Ethical Concerns Noted",
        description: "Basic ethical guidelines have been overridden. More dangerous mutations are now available.",
        duration: 5000,
        variant: "destructive",
      });
    } else if (state.ethicsLevel === 2) {
      toast({
        title: "WARNING: Ethical Protocols Bypassed",
        description: "Dangerous mutations now available. Internal review board notifications have been suppressed.",
        duration: 5000,
        variant: "destructive",
      });
    } else if (state.ethicsLevel === 3) {
      toast({
        title: "CRITICAL: Safety Measures Disabled",
        description: "You have disabled all safety protocols. Catastrophic mutations now available.",
        duration: 5000,
        variant: "destructive",
      });
    }
  }, [state.ethicsLevel]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to use the GameState context
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
