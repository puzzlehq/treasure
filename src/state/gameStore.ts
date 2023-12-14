import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecordWithPlaintext } from '@puzzlehq/sdk';
import {
  GameAction,
  GameNotification,
  GameState,
  getGameAction,
  getGameState,
  parseGameRecord,
} from './RecordTypes/treasure_hunt_vxxx';
import { useRenegeStore } from '@pages/Renege/store';
import { Step, useAcceptGameStore } from '@pages/AcceptGame/store';
import { useNewGameVsPersonStore } from '@pages/NewGame/vs_person/store';
import { useClaimPrizeWinStore } from '@pages/FinishGame/Win/store';
import { useRevealAnswerStore } from '@pages/RevealAnswer/store';
import _ from 'lodash';

const parsePuzzlePieces = (records: RecordWithPlaintext[]) => {
  if (records.length > 0) {
    let availableBalance = 0;
    let largestPiece = records[0];
    const totalBalance = records
      .filter((record) => !record.spent)
      .map((record) => {
        const amount = record.data?.amount?.replace('u64.private', '');
        if (amount && ['0u32.private', '0u32'].includes(record.data.ix)) {
          /// find largestPiece (and thus availableBalance)
          const amountInt = parseInt(amount);
          availableBalance = Math.max(availableBalance, amountInt);
          if (availableBalance == amountInt) {
            largestPiece = record;
          }
          return amountInt;
        }
        return 0;
      })
      .reduce((total, amount) => {
        /// sum up
        return total + amount;
      });
    return { totalBalance, availableBalance, largestPiece };
  }
  return { totalBalance: 0, availableBalance: 0, largestPiece: undefined };
};

export type Game = {
  gameNotification: GameNotification;
  gameState: GameState;
  gameAction?: GameAction;
  records: RecordWithPlaintext[];
  msRecords?: RecordWithPlaintext[];
};

type GameStore = {
  currentGame?: Game;
  yourTurn: Game[];
  theirTurn: Game[];
  finished: Game[];
  records: RecordWithPlaintext[];
  availableBalance: number;
  totalBalance: number;
  largestPiece?: RecordWithPlaintext;
  setRecords: (
    records: RecordWithPlaintext[],
    msRecords?: RecordWithPlaintext[]
  ) => void;
  setCurrentGame: (game?: Game) => void;
  clearFlowStores: () => void;
};

const validStates = {
  yourTurn: new Set([
    'challenger:3', // challenger to reveal answer
    'challenger:4:win', // challenger to claim prize
    'winner:4', // challenger or opponent to claim prize
    'opponent:1', // opponent to submit wager
    'opponent:2', // opponent to accept game
  ]),
  theirTurn: new Set([
    'challenger:1', // challenger to ping opponent to submit wager
    'challenger:2', // challenger to ping opponent to accept game
    'loser:4', // remind challenger or opponent to accept funds
    'opponent:3', // opponent to ping challenger to reveal answer
  ]),
  finished: new Set([
    'opponent:0',
    'opponent:5',
    'opponent:6',
    'challenger:0',
    'challenger:5',
    'challenger:6',
  ]),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentGame: undefined as Game | undefined,
      yourTurn: [] as Game[],
      theirTurn: [] as Game[],
      finished: [] as Game[],
      records: [] as RecordWithPlaintext[],
      availableBalance: 0,
      totalBalance: 0,
      largestPiece: undefined,
      setRecords: (records, msRecords) => {
        const currentGame = get().currentGame;

        const { availableBalance, totalBalance, largestPiece } =
          parsePuzzlePieces(records);
        set({ availableBalance, totalBalance, largestPiece });

        const allGameNotifications: GameNotification[] =
          records
            .map((record) => {
              const gameNotification: GameNotification | undefined =
                parseGameRecord(record);
              if (!gameNotification) return;
              return gameNotification;
            })
            .filter(
              (record): record is GameNotification => record !== undefined
            );

        const gameNotificationsByGameAddress = _.groupBy(
          allGameNotifications,
          'recordData.game_multisig'
        );
        const gameNotifications = _.values(gameNotificationsByGameAddress).map(
          (notifications) => {
            if (notifications.length === 1) return notifications[0];
            else {
              const reneged = notifications.find(
                (n) => n.recordData.game_state === '0field'
              );
              if (reneged) return reneged;
              const sorted = _.orderBy(
                notifications,
                'recordData.game_state',
                'desc'
              );
              return sorted[0];
            }
          }
        );
        console.log('gameNotifications', gameNotifications);

        const { yourTurn, theirTurn, finished } = gameNotifications.reduce<{
          yourTurn: Game[];
          theirTurn: Game[];
          finished: Game[];
        }>(
          (acc, gameNotification) => {
            const game_state = getGameState(gameNotification);
            const _records = records.filter((r) => r.data.game_multisig?.replace('.private', '')  === gameNotification.recordData.game_multisig?.replace('.private', '') );
            const _msRecords = msRecords?.filter((r) => r.data.owner?.replace('.private', '') === gameNotification.recordData.game_multisig?.replace('.private', '') );
            console.log('_msRecords', _msRecords); 
            const game: Game = {
              gameNotification,
              gameState: game_state,
              records: _records,
              msRecords: _msRecords,
              gameAction: getGameAction(game_state)
            }
            if (
              currentGame &&
              game.gameNotification.recordData.game_multisig ===
                currentGame?.gameNotification.recordData.game_multisig
            ) {
              set({
                currentGame: game,
              });
            }
            if (validStates.yourTurn.has(game_state)) {
              acc.yourTurn.push(game);
            } else if (validStates.theirTurn.has(game_state)) {
              acc.theirTurn.push(game);
            } else {
              acc.finished.push(game);
            }
            return acc;
          },
          { yourTurn: [], theirTurn: [], finished: [] }
        );
        console.log('yourTurn', yourTurn);
        console.log('theirTurn', theirTurn);

        set({ yourTurn, theirTurn, finished });
      },
      setCurrentGame: (game?: Game) => {
        set({ currentGame: game });
        switch (game?.gameAction) {
          case 'Submit Wager':
            useAcceptGameStore.getState().setStep(Step._01_SubmitWager);
            break;
          case 'Accept':
            useAcceptGameStore.getState().setStep(Step._02_AcceptGame);
            break;
        }
      },
      clearFlowStores: () => {
        useNewGameVsPersonStore.getState().close();
        useAcceptGameStore.getState().close();
        useRenegeStore.getState().close();
        useClaimPrizeWinStore.getState().close();
        useRevealAnswerStore.getState().close();
        set({ currentGame: undefined });
      },
    }),
    {
      name: 'game-manager',
    }
  )
);
