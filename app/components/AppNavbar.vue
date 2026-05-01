<script setup lang="ts">
const { user, logout } = useAuth()
const { open } = useLoginModal()
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">
      <NuxtLink to="/" class="navbar__brand">
        <span class="navbar__brand-icon">N</span>
        <span class="navbar__brand-text">NewsHub</span>
      </NuxtLink>

      <nav class="navbar__nav">
        <NuxtLink to="/" class="navbar__nav-link" active-class="navbar__nav-link--active">
          Home
        </NuxtLink>
      </nav>
      <ClientOnly>
      <template v-if="!user">
        <button class="navbar__login-btn" @click="open()">
          Login
        </button>
      </template>
      <template v-else>
        <div class="navbar__user">
          <span class="navbar__user-name">{{ user.name }}</span>
          <button class="navbar__logout-btn" @click="logout">
            Logout
          </button>
        </div>
      </template>
      </ClientOnly>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #1a1a2e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 64px;
}

.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.navbar__brand-icon {
  width: 32px;
  height: 32px;
  background-color: #e94560;
  color: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
}

.navbar__brand-text {
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.navbar__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;

  @media (max-width: 640px) {
    display: none;
  }
}

.navbar__nav-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &--active {
    color: #ffffff;
  }
}

.navbar__login-btn {
  margin-left: auto;
  padding: 4px 16px;
  background-color: #e94560;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: #c73550;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.navbar__user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.navbar__user-name {
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

.navbar__logout-btn {
  padding: 4px 16px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
