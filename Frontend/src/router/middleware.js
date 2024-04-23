import { useUserStore } from '@/stores/user.js'
import router from '@/router/index.js'

export function redirectToLogin(to) {
  const userStore = useUserStore()
  if (!userStore.userObject) {
    return `/login?to=${to.name}`
  }
}

// export async function redirectToLogin(to) {
//   const userStore = useUserStore();
//   if (!userStore.userObject) {
//     const isAuthenticated = await userStore.fetchCurrentUser();
//     if (!isAuthenticated) {
//       return `/login?to=${to.name}`;
//     }
//   }
// }

export function checkAdminRights() {
  const userStore = useUserStore()

  const isAdmin = userStore.userObject.role.some(role => role.name === 'admin')
  if (!isAdmin) {
    // return `/login?to=${to.name}`;
    return router.push('/login')
  }
}

export function checkBusinessOwnerRights() {
  const userStore = useUserStore()
  if (userStore.userObject.role && userStore.userObject.role.length){
    return userStore.userObject.role.some(role => role.name === 'business_owner')
  }
}
