import LocalStorage from "./localStorage";

let playerPreferences: LocalStorage | undefined;

function defineStorage() {
  playerPreferences = new LocalStorage("playerPreferences");
  playerPreferences.initialize("volume", 50);
  playerPreferences.initialize("HQ", false);
}

export function usePlayerStorage(): LocalStorage {
  if (!playerPreferences) defineStorage();
  return playerPreferences!;
}
