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

export type Facility = {
  id: string;
  name: string;
  description: string;
  cost: number;
  bonus: {
    type: string;
    value: number;
  };
  unlocked: boolean;
  purchased: boolean;
};

export type Room = {
  id: string;
  name: string;
  description: string;
  cost: number;
  upgradeCost: number;
  level: number;
  bonus: {
    type: string;
    value: number;
  };
  unlocked: boolean;
  purchased: boolean;
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
  availableClients: Client[];
  facilities: Facility[];
  rooms: Room[];
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

const initialClients: Client[] = [
  {
    id: "agricultural",
    name: "Agricultural Services",
    description: "Deploy mosquitoes for crop pollination and pest control",
    payRate: 10,
    requirements: {
      minMosquitoes: 5000,
      maxLethality: 0.1
    },
    ethicalConcern: "Low risk deployment in controlled environments",
    warningLevel: 1,
    unlocked: true,
    active: true
  },
  {
    id: "research",
    name: "Medical Research Labs",
    description: "Provide specimens for disease research and vaccine testing",
    payRate: 25,
    requirements: {
      minMosquitoes: 10000,
      maxLethality: 0.4
    },
    ethicalConcern: "Specimens used in contained laboratory experiments",
    warningLevel: 1,
    unlocked: true,
    active: true
  },
  {
    id: "vector-control",
    name: "Vector Control Agency",
    description: "Modified mosquitoes to combat wild disease-carrying populations",
    payRate: 40,
    requirements: {
      minMosquitoes: 25000,
      maxLethality: 0.2
    },
    ethicalConcern: "Released into environment with uncertain ecological impact",
    warningLevel: 2,
    unlocked: false,
    active: false
  },
  {
    id: "private-security",
    name: "Private Security Firm",
    description: "Non-lethal deterrent for crowd control and perimeter security",
    payRate: 75,
    requirements: {
      minMosquitoes: 50000,
      minLethality: 0.2,
      maxLethality: 0.5
    },
    ethicalConcern: "Deployed against civilians in security situations",
    warningLevel: 2,
    unlocked: false,
    active: false
  },
  {
    id: "military-contractor",
    name: "Military Contractor",
    description: "Tactical deployment in conflict zones for area denial",
    payRate: 150,
    requirements: {
      minMosquitoes: 100000,
      minLethality: 0.6
    },
    ethicalConcern: "Used in active conflict zones without oversight",
    warningLevel: 3,
    unlocked: false,
    active: false
  }
];

const initialFacilities: Facility[] = [
  {
    id: "centrifuge",
    name: "High-Speed Centrifuge",
    description: "Advanced separation equipment for genetic material",
    cost: 500,
    bonus: {
      type: "mutationDiscount",
      value: 0.1
    },
    unlocked: true,
    purchased: false
  },
  {
    id: "incubator",
    name: "Thermal Incubator Array",
    description: "Precision climate control for accelerated growth",
    cost: 800,
    bonus: {
      type: "productionMultiplier",
      value: 0.15
    },
    unlocked: true,
    purchased: false
  },
  {
    id: "sequencer",
    name: "DNA Sequencer",
    description: "Rapid genome mapping and analysis",
    cost: 1200,
    bonus: {
      type: "researchSpeed",
      value: 0.2
    },
    unlocked: false,
    purchased: false
  },
  {
    id: "crispr",
    name: "CRISPR Gene Editor",
    description: "Precise genetic modification workstation",
    cost: 2500,
    bonus: {
      type: "mutationDiscount",
      value: 0.25
    },
    unlocked: false,
    purchased: false
  }
];

const initialRooms: Room[] = [
  {
    id: "larval-nursery",
    name: "Larval Nursery",
    description: "Specialized environment for early-stage development",
    cost: 1000,
    upgradeCost: 500,
    level: 1,
    bonus: {
      type: "productionMultiplier",
      value: 0.1
    },
    unlocked: true,
    purchased: false
  },
  {
    id: "genetics-lab",
    name: "Genetics Laboratory",
    description: "Advanced research space for mutation development",
    cost: 2000,
    upgradeCost: 1000,
    level: 1,
    bonus: {
      type: "mutationDiscount",
      value: 0.15
    },
    unlocked: true,
    purchased: false
  },
  {
    id: "climate-chamber",
    name: "Climate Control Chamber",
    description: "Optimized environment for maximum breeding efficiency",
    cost: 3000,
    upgradeCost: 1500,
    level: 1,
    bonus: {
      type: "efficiencyBonus",
      value: 0.2
    },
    unlocked: false,
    purchased: false
  },
  {
    id: "packaging-facility",
    name: "Deployment Packaging Facility",
    description: "Streamlined processing for client deliveries",
    cost: 5000,
    upgradeCost: 2500,
    level: 1,
    bonus: {
      type: "payRateBonus",
      value: 0.25
    },
    unlocked: false,
    purchased: false
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
  availableClients: initialClients,
  facilities: initialFacilities,
  rooms: initialRooms,
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
  | { type: 'SET_TIME', payload: number }
  | { type: 'DEPLOY_MOSQUITOES', payload: { clientId: string, amount: number } }
  | { type: 'BUY_ROOM', payload: { roomId: string } }
  | { type: 'UPGRADE_ROOM', payload: { roomId: string } }
  | { type: 'BUY_EQUIPMENT', payload: { equipmentId: string } };

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
      
    case 'DEPLOY_MOSQUITOES':
      const { clientId, amount } = action.payload;
      const client = state.availableClients.find(c => c.id === clientId);
      
      if (!client || amount <= 0 || state.resources.mosquitoesProduced < amount) {
        return state;
      }
      
      // Calculate payment based on client rate and any facility bonuses
      let payRate = client.payRate;
      
      // Apply packaging facility bonus if purchased
      const packagingFacility = state.rooms.find(r => r.id === 'packaging-facility' && r.purchased);
      if (packagingFacility) {
        payRate *= (1 + packagingFacility.bonus.value);
      }
      
      const payment = Math.floor(payRate * (amount / 1000));
      
      // Unlock new clients based on ethics level
      let newClientsUnlocked = false;
      const updatedClients = state.availableClients.map(c => {
        if (c.id === clientId) {
          return { ...c, active: true };
        }
        
        // Unlock clients with matching warning level
        if (!c.unlocked && c.warningLevel <= state.ethicsLevel + 1) {
          newClientsUnlocked = true;
          return { ...c, unlocked: true };
        }
        
        return c;
      });
      
      if (newClientsUnlocked) {
        toast({
          title: "New Clients Available",
          description: "Your reputation has attracted new deployment opportunities.",
          duration: 5000,
        });
      }
      
      // If this is a high warning level client, increase ethics level
      if (client.warningLevel > state.ethicsLevel) {
        toast({
          title: "Ethical Boundary Crossed",
          description: `Deployment to ${client.name} raises serious ethical concerns.`,
          duration: 5000,
          variant: "destructive",
        });
      }
      
      return {
        ...state,
        resources: {
          ...state.resources,
          mosquitoesProduced: state.resources.mosquitoesProduced - amount,
          humanTestReports: state.resources.humanTestReports + payment,
        },
        availableClients: updatedClients,
        ethicsLevel: Math.max(state.ethicsLevel, client.warningLevel - 1)
      };
      
    case 'BUY_ROOM':
      const { roomId } = action.payload;
      const roomToBuy = state.rooms.find(r => r.id === roomId);
      
      if (!roomToBuy || roomToBuy.purchased || !roomToBuy.unlocked || state.resources.humanTestReports < roomToBuy.cost) {
        return state;
      }
      
      const updatedRooms = state.rooms.map(r => {
        if (r.id === roomId) {
          return { ...r, purchased: true };
        }
        return r;
      });
      
      // Apply room bonus to appropriate game mechanics
      let updatedState = {
        ...state,
        rooms: updatedRooms,
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - roomToBuy.cost,
        }
      };
      
      // Apply specific effects based on room type
      if (roomToBuy.bonus.type === 'productionMultiplier') {
        // Apply production multiplier to all vats
        updatedState = {
          ...updatedState,
          vats: updatedState.vats.map(v => ({
            ...v,
            production: v.production * (1 + roomToBuy.bonus.value)
          })),
          resources: {
            ...updatedState.resources,
            totalProduction: updatedState.vats.reduce((sum, v) => sum + (v.active ? v.production * (1 + roomToBuy.bonus.value) : 0), 0),
          }
        };
      }
      
      // Unlock new rooms based on purchased rooms
      const purchasedRoomsCount = updatedRooms.filter(r => r.purchased).length;
      if (purchasedRoomsCount >= 2) {
        updatedState = {
          ...updatedState,
          rooms: updatedState.rooms.map(r => {
            if (!r.unlocked && r.id === 'climate-chamber') {
              return { ...r, unlocked: true };
            }
            return r;
          }),
          facilities: updatedState.facilities.map(f => {
            if (!f.unlocked && f.id === 'sequencer') {
              return { ...f, unlocked: true };
            }
            return f;
          })
        };
      }
      
      if (purchasedRoomsCount >= 3) {
        updatedState = {
          ...updatedState,
          rooms: updatedState.rooms.map(r => {
            if (!r.unlocked && r.id === 'packaging-facility') {
              return { ...r, unlocked: true };
            }
            return r;
          }),
          facilities: updatedState.facilities.map(f => {
            if (!f.unlocked && f.id === 'crispr') {
              return { ...f, unlocked: true };
            }
            return f;
          })
        };
      }
      
      toast({
        title: "New Facility Built",
        description: `${roomToBuy.name} is now operational.`,
        duration: 3000,
      });
      
      return updatedState;
      
    case 'UPGRADE_ROOM':
      const roomToUpgrade = state.rooms.find(r => r.id === action.payload.roomId);
      
      if (!roomToUpgrade || !roomToUpgrade.purchased || state.resources.humanTestReports < roomToUpgrade.upgradeCost) {
        return state;
      }
      
      const roomsAfterUpgrade = state.rooms.map(r => {
        if (r.id === action.payload.roomId) {
          return {
            ...r,
            level: r.level + 1,
            upgradeCost: Math.floor(r.upgradeCost * 1.5),
            bonus: {
              ...r.bonus,
              value: r.bonus.value * 1.2
            }
          };
        }
        return r;
      });
      
      // Apply upgraded room bonus to appropriate game mechanics
      let stateAfterRoomUpgrade = {
        ...state,
        rooms: roomsAfterUpgrade,
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - roomToUpgrade.upgradeCost,
        }
      };
      
      // Update effects based on room type
      if (roomToUpgrade.bonus.type === 'productionMultiplier') {
        const oldBonus = roomToUpgrade.bonus.value;
        const newBonus = oldBonus * 1.2;
        const bonusDifference = newBonus - oldBonus;
        
        stateAfterRoomUpgrade = {
          ...stateAfterRoomUpgrade,
          vats: stateAfterRoomUpgrade.vats.map(v => ({
            ...v,
            production: v.production * (1 + bonusDifference)
          })),
          resources: {
            ...stateAfterRoomUpgrade.resources,
            totalProduction: stateAfterRoomUpgrade.vats.reduce((sum, v) => 
              sum + (v.active ? v.production * (1 + bonusDifference) : 0), 0),
          }
        };
      }
      
      return stateAfterRoomUpgrade;
      
    case 'BUY_EQUIPMENT':
      const { equipmentId } = action.payload;
      const equipmentToBuy = state.facilities.find(f => f.id === equipmentId);
      
      if (!equipmentToBuy || equipmentToBuy.purchased || !equipmentToBuy.unlocked || state.resources.humanTestReports < equipmentToBuy.cost) {
        return state;
      }
      
      const updatedFacilities = state.facilities.map(f => {
        if (f.id === equipmentId) {
          return { ...f, purchased: true };
        }
        return f;
      });
      
      toast({
        title: "New Equipment Installed",
        description: `${equipmentToBuy.name} is now operational.`,
        duration: 3000,
      });
      
      // Apply equipment bonus to appropriate game mechanics
      let updatedStateAfterEquipment = {
        ...state,
        facilities: updatedFacilities,
        resources: {
          ...state.resources,
          humanTestReports: state.resources.humanTestReports - equipmentToBuy.cost,
        }
      };
      
      // Apply specific effects based on equipment type
      if (equipmentToBuy.bonus.type === 'productionMultiplier') {
        updatedStateAfterEquipment = {
          ...updatedStateAfterEquipment,
          vats: updatedStateAfterEquipment.vats.map(v => ({
            ...v,
            production: v.production * (1 + equipmentToBuy.bonus.value)
          })),
          resources: {
            ...updatedStateAfterEquipment.resources,
            totalProduction: updatedStateAfterEquipment.vats.reduce((sum, v) => 
              sum + (v.active ? v.production * (1 + equipmentToBuy.bonus.value) : 0), 0),
          }
        };
      }
      
      return updatedStateAfterEquipment;
      
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
