<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'

const sessionData = ref(null)
const router = useRouter()

onMounted(() => {
  // Try to load the session data from localStorage.
  const data = localStorage.getItem('sessionData')
  if (data) {
    sessionData.value = JSON.parse(data)
  } else {
    // If no session data is found, redirect back to the payment page.
    router.push('/')
  }
})
</script>