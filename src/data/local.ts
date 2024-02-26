import localforage from "localforage";

const treasuresStore = localforage.createInstance({
  name: "TreasuresLocalforage",
});

export class Local {
  static getItem = async <T>(key: string): Promise<T | undefined> => {
    return (await treasuresStore.getItem(key)) ?? undefined;
  };

  static setItem = async <T>(key: string, value: T): Promise<void> => {
    await treasuresStore.setItem(key, value);
  };

  static getVisitedGameInfo = async (): Promise<boolean> => {
    return (await treasuresStore.getItem("visited_game_info")) ?? false;
  };

  static getVisitedAleoInfo = async (): Promise<boolean> => {
    return (await treasuresStore.getItem("aleo_game_info")) ?? false;
  };

  static setVisitedGameInfo = async () => {
    await treasuresStore.setItem("visited_game_info", true);
  };

  static setVisitedAleoInfo = async () => {
    await treasuresStore.setItem("aleo_game_info", true);
  };
}
