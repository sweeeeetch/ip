import type { FinancialBonus, Reward } from "@/types/app";

export const defaultRewards: Reward[] = [
  { id: 1, name: "Вкусный кофе", cost: 10, claimed: false, resetDays: 1, claimedAt: null },
  { id: 2, name: "Любимый десерт", cost: 15, claimed: false, resetDays: 1, claimedAt: null },
  { id: 3, name: "Часовой перерыв", cost: 20, claimed: false, resetDays: 1, claimedAt: null },
  { id: 4, name: "2 часа ничего не делать", cost: 30, claimed: false, resetDays: 1, claimedAt: null },
  { id: 5, name: "Поесть что хочется", cost: 25, claimed: false, resetDays: 2, claimedAt: null },
  { id: 6, name: "Новая книга/игра", cost: 35, claimed: false, resetDays: 3, claimedAt: null },
  { id: 7, name: "Поход в кино", cost: 40, claimed: false, resetDays: 3, claimedAt: null },
  { id: 8, name: "Заказ еды", cost: 45, claimed: false, resetDays: 3, claimedAt: null },
  { id: 9, name: "День без планов", cost: 50, claimed: false, resetDays: 7, claimedAt: null },
  { id: 10, name: "Ужин в ресторане", cost: 60, claimed: false, resetDays: 7, claimedAt: null },
  { id: 11, name: "Шоппинг-день", cost: 65, claimed: false, resetDays: 7, claimedAt: null },
  { id: 12, name: "Новая одежда", cost: 70, claimed: false, resetDays: 14, claimedAt: null },
  { id: 13, name: "Массаж/SPA", cost: 80, claimed: false, resetDays: 7, claimedAt: null },
  { id: 14, name: "Билет на концерт/шоу", cost: 90, claimed: false, resetDays: 14, claimedAt: null },
  { id: 15, name: "Техника/гаджет", cost: 100, claimed: false, resetDays: 30, claimedAt: null },
  { id: 16, name: "Выходные за городом", cost: 120, claimed: false, resetDays: 30, claimedAt: null },
];

export const financialBonuses: FinancialBonus[] = [
  { id: 1, name: "Получил доход", points: 25, desc: "Любой заработок" },
  { id: 2, name: "Крупная сделка", points: 75, desc: "Большая сумма" },
  { id: 3, name: "Инвестиция окупилась", points: 50, desc: "Прибыль от инвестиций" },
];
