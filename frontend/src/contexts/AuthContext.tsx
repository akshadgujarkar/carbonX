import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { User, UserRole, BuyerProfile, SellerProfile } from "@/types";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    companyName: string,
    country: string,
    industry?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    role: UserRole,
    companyName: string,
    country: string,
    industry?: string
  ) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userData: User = {
      id: firebaseUser.uid,
      email,
      role,
      companyName,
      country,
      kycStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(role === "buyer" && industry ? { industry: industry as BuyerProfile["industry"] } : {}),
    };

    await setDoc(doc(db, "users", firebaseUser.uid), userData);
    setUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (role: UserRole) => {
    const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
    
    // Check if user already exists
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        role,
        companyName: "",
        country: "",
        kycStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      setUser(userData);
    } else {
      setUser(userDoc.data() as User);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!firebaseUser) return;
    
    const updatedData = { ...data, updatedAt: new Date() };
    await setDoc(doc(db, "users", firebaseUser.uid), updatedData, { merge: true });
    
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
