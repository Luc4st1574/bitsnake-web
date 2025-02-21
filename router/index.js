import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import GamePage from '@/pages/GamePage.vue'
import AboutPage from '@/pages/AboutPage.vue'
import PaymentPage from '@/pages/PaymentPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/game',
      name: 'game',
      props: true,
      component: GamePage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/payment',
      name: 'payment',
      component: PaymentPage
    }
  ]
})

export default router
