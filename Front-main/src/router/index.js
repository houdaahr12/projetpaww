import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import LoginSignup from '@/views/LoginSignup.vue';
import PrivateSpace from '@/components/PrivateSpace.vue'; // Nouveau fichier
import UserTerms from '@/views/UserTerms.vue';
import DashboardView from '@/views/DashboardView.vue';
import AddView from '@/views/AddView.vue';
import ProfilView from '@/views/ProfilView.vue';
import TodoCalendar from '@/views/TodoCalendar.vue';
import CategoriePage from '@/components/CategoriePage.vue';
import TrashView from '@/views/TrashView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/auth', 
    name: 'LoginSignup',
    component: LoginSignup,
  },
  {
       path: '/',
       component:LoginSignup 
   },
  { 
      path: '/private-space', 
      component: PrivateSpace
   },
   {
   path: '/UserTerms',
   name: 'UserTerms',
   component: UserTerms,
   },
   {
    path: '/dashboard',
    name: 'DashboardView',
    component: DashboardView
  },
  
  {
    path: '/add',
    name: 'AddView',
    component: AddView, 
  },
  {
    path: '/todo',
    name: 'TodoCalendar',
    component: TodoCalendar, 
  },
  {
    path: '/profil',
    name: 'Profil',
    component: ProfilView, 
   
  },
  {
    path: '/cat',
    name: 'CategoriePage',
    component: CategoriePage, 
   
  },
  {
    path: '/trash',
    name: 'TrashView',
    component: TrashView, 
   
  },
  // Allows the `id` to be passed as a prop to the component
    
  ];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
});

export default router;
