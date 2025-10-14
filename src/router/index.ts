import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "habits" },
    },
    {
      path: "/habits",
      name: "habits",
      component: () => import("@/views/HabitsView.vue"),
    },
    {
      path: "/goals",
      name: "goals",
      component: () => import("@/views/GoalsView.vue"),
    },
    {
      path: "/trackers",
      name: "trackers",
      component: () => import("@/views/TrackersView.vue"),
    },
    {
      path: "/planning",
      name: "planning",
      component: () => import("@/views/PlanningView.vue"),
    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("@/views/CalendarView.vue"),
    },
    {
      path: "/rewards",
      name: "rewards",
      component: () => import("@/views/RewardsView.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("@/views/StatsView.vue"),
    },
  ],
});

export default router;
