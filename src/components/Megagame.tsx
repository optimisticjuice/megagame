import { MemoryGame } from './MemoryGame';

// Main Megagame component - now serves as a wrapper for the Memory Game
// This demonstrates how to refactor from monolithic to modular architecture
export default function Megagame() {
  return <MemoryGame />;
}