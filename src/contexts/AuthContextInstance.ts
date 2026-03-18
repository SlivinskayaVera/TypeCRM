import { createContext } from 'react';
import type { AuthContextType } from './AuthContext'; // тип из основного файла

export const AuthContext = createContext<AuthContextType | null>(null);