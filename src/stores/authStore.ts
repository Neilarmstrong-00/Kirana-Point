import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Address } from '@/types';

export const DEMO_ADMIN: User = {
  uid: 'admin_pratham_1',
  name: 'Pratham Tarde',
  email: 'pratham@kiranapoint.com',
  phone: '8208232735',
  role: 'admin',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  totalOrders: 42,
  totalSpent: 48200,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEMO_CUSTOMER: User = {
  uid: 'user_cust_1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '9876543210',
  role: 'customer',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  totalOrders: 5,
  totalSpent: 4350,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr_home_1',
    label: 'home',
    fullAddress: 'Plot 12, Ganesh Nagar, Near Civil Hospital, Khamgaon',
    city: 'Khamgaon, Dist. Buldhana',
    pincode: '444303',
    latitude: 20.689,
    longitude: 76.568,
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'addr_work_1',
    label: 'work',
    fullAddress: 'Main Road Market, Opposite SBI Bank, Khamgaon',
    city: 'Khamgaon, Dist. Buldhana',
    pincode: '444303',
    latitude: 20.685,
    longitude: 76.563,
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

interface AuthState {
  user: User | null;
  addresses: Address[];
  selectedAddressId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Global Auth Modal state
  isAuthModalOpen: boolean;
  authModalMessage: string;
  pendingAction: (() => void) | null;

  login: (identifier: string, password?: string) => Promise<User>;
  loginAsAdmin: () => void;
  loginAsCustomer: () => void;
  register: (name: string, email: string, phone?: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id' | 'createdAt'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setSelectedAddressId: (id: string | null) => void;

  openAuthModal: (message?: string, action?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void, promptMessage?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, // Starts as guest visitor so they can scroll & browse products
      addresses: DEFAULT_ADDRESSES,
      selectedAddressId: 'addr_home_1',
      isAuthenticated: false,
      isLoading: false,

      isAuthModalOpen: false,
      authModalMessage: '',
      pendingAction: null,

      openAuthModal: (message = 'Please sign in or create an account to continue.', action) => {
        set({
          isAuthModalOpen: true,
          authModalMessage: message,
          pendingAction: action || null,
        });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false, pendingAction: null });
      },

      requireAuth: (action: () => void, promptMessage?: string) => {
        const { isAuthenticated, user } = get();
        if (isAuthenticated && user) {
          action();
          return true;
        }

        // Intercept action and open Auth Portal
        get().openAuthModal(
          promptMessage || 'Please sign in to add items to your cart and proceed.',
          action
        );
        return false;
      },

      login: async (identifier: string, password?: string) => {
        set({ isLoading: true });
        const cleanId = identifier.trim().toLowerCase();
        const isAdmin =
          cleanId === 'pratham@kiranapoint.com' ||
          cleanId === 'admin@kiranapoint.com' ||
          cleanId === '8208232735' ||
          cleanId.includes('admin') ||
          cleanId.includes('pratham') ||
          (password && (password === 'admin123' || password === 'pratham123'));

        const loggedUser: User = isAdmin
          ? DEMO_ADMIN
          : {
              ...DEMO_CUSTOMER,
              email: cleanId.includes('@') ? cleanId : `${cleanId}@customer.com`,
              phone: /^\d+$/.test(cleanId) ? cleanId : DEMO_CUSTOMER.phone,
            };

        const pending = get().pendingAction;
        set({
          user: loggedUser,
          isAuthenticated: true,
          isLoading: false,
          isAuthModalOpen: false,
          pendingAction: null,
        });

        if (pending) {
          try {
            pending();
          } catch (e) {
            console.error('Error running pending action after login:', e);
          }
        }

        return loggedUser;
      },

      loginAsAdmin: () => {
        const pending = get().pendingAction;
        set({
          user: DEMO_ADMIN,
          isAuthenticated: true,
          isAuthModalOpen: false,
          pendingAction: null,
        });
        if (pending) pending();
      },

      loginAsCustomer: () => {
        const pending = get().pendingAction;
        set({
          user: DEMO_CUSTOMER,
          isAuthenticated: true,
          isAuthModalOpen: false,
          pendingAction: null,
        });
        if (pending) pending();
      },

      register: async (name: string, email: string, phone?: string) => {
        const newUser: User = {
          uid: `user_${Date.now()}`,
          name,
          email,
          phone: phone || '8208232735',
          role: 'customer',
          isVerified: true,
          totalOrders: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const pending = get().pendingAction;
        set({
          user: newUser,
          isAuthenticated: true,
          isAuthModalOpen: false,
          pendingAction: null,
        });

        if (pending) pending();
        return newUser;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAuthModalOpen: false, pendingAction: null });
      },

      updateProfile: (data: Partial<User>) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...data, updatedAt: new Date().toISOString() } });
      },

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const current = get().addresses;
        const updated = addressData.isDefault
          ? current.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
          : [...current, newAddress];

        set({
          addresses: updated,
          selectedAddressId: newAddress.isDefault ? newAddress.id : get().selectedAddressId || newAddress.id,
        });
        return newAddress;
      },

      updateAddress: (id, addressData) => {
        const updated = get().addresses.map((a) =>
          a.id === id ? { ...a, ...addressData } : addressData.isDefault ? { ...a, isDefault: false } : a
        );
        set({ addresses: updated });
      },

      deleteAddress: (id) => {
        const updated = get().addresses.filter((a) => a.id !== id);
        set({
          addresses: updated,
          selectedAddressId: get().selectedAddressId === id ? updated[0]?.id || null : get().selectedAddressId,
        });
      },

      setDefaultAddress: (id) => {
        const updated = get().addresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }));
        set({ addresses: updated, selectedAddressId: id });
      },

      setSelectedAddressId: (id) => {
        set({ selectedAddressId: id });
      },
    }),
    {
      name: 'kp_auth_state_v2',
      partialize: (state) => ({
        user: state.user,
        addresses: state.addresses,
        selectedAddressId: state.selectedAddressId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
