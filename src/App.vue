<script setup lang="ts">
import config from "./config";

let backendUrl = localStorage.getItem("backendUrl");
if (!backendUrl) {
  localStorage.setItem("backendUrl", config.defaultBackendUrl);
  backendUrl = config.defaultBackendUrl;
}
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <RouterLink to="/" class="link">Home</RouterLink>
      </div>
      <div class="header-right">
        <div class="header-right-item">
          <RouterLink to="/settings" class="link">
            <i class="pi pi-cog"></i>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="view">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  height: 100%;

  .view {
    width: 100%;
    max-width: 880px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // max-width: 880px;
  margin: 0 auto;
  padding: 10px 24px;
  border-bottom: 1px solid #e0e0e0;

  .header-left {
    font-size: 1rem;
    font-weight: 600;

    .link {
      text-decoration: none;
      transition: color 0.3s ease;

      &:hover {
        color: var(--primary-color);
      }
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }

  i {
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  // position: absolute;
  left: 0;
  right: 0;
  // top: 10px;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-from {
  transform: translateX(20px);
}

.fade-leave-to {
  transform: translateX(-20px);
}
</style>
