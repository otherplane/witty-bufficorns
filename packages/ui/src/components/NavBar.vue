<template>
  <div class="nav-container">
    <nav class="navbar" :class="{ open: isMenuVisible }">
      <label class="responsive-menu" @click="toggleMenu">
        <a class="target-burger" :class="{ visible: isMenuVisible }">
          <ul class="buns">
            <li class="bun"></li>
            <li class="bun"></li>
          </ul>
        </a>
      </label>
      <div class="dropdown">
        <ul class="tab-container" :class="{ visible: isMenuVisible }">
          <li class="tab" @click="closeMenu">
            <router-link to="/stats">
              Leaderboard
            </router-link>
          </li>
          <li class="tab" @click="closeMenu">
            <router-link to="/trades">
              Trade history
            </router-link>
          </li>
          <li class="tab" @click="closeMenu">
            <div @click="openExportModal()" type="dark">
              Get backup
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data () {
    return {
      hover: false,
      displayBox: false,
      isMenuVisible: false
    }
  },
  methods: {
    openExportModal () {
      this.$emit('openExportModal')
    },
    closeMenu () {
      this.isMenuVisible = false
    },
    toggleMenu () {
      this.isMenuVisible = !this.isMenuVisible
    },
    displayDropDown () {
      this.displayBox = !this.displayBox
    },
    onClose () {
      this.active = false
    }
  }
}
</script>

<style scoped lang="scss">
.navbar-container {
  position: absolute;
}
.navbar {
  display: block;
  top: 8px;
  left: 8px;
  padding: 0;
  .logo-container {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    padding: 8px;
    text-decoration: none;
    column-gap: 8px;

    .witnet-logo {
      width: 90px;
      grid-row: 1 / span 2;
    }
    .logo-subtitle-color {
      font-size: 18px;
      align-self: flex-start;
      color: var(--primary-color);
    }
    .logo-subtitle {
      font-size: 18px;
      align-self: flex-end;
      color: var(--primary-color);
    }
  }
  .responsive-menu {
    display: block;
    cursor: pointer;
    position: absolute;
    z-index: 50px;
    top: 0px;
    width: 32px;
    left: 16px;
  }
  .dropdown {
    position: absolute;
    z-index: 50;
    top: 48px;
  }
}
.tab-container {
  background-color: $white;
  border: 2px solid var(--primary-color);
  list-style: none;
  visibility: hidden;
  text-align: left;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
  display: grid;
  opacity: 0;
  width: 0px;
  height: 0px;
  &.visible {
    box-sizing: border-box;
    transition: all 0.1s;
    visibility: visible;
    padding: 8px 0px;
    top: 8px;
    opacity: 1;
    width: 148px;
    height: 140px;
    .tab {
      opacity: 1;
      transition: all 0.3s;
    }
  }
  .tab {
    cursor: pointer;
    display: block;
    align-items: left;
    text-decoration: none;
    padding: 0px 16px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    color: var(--primary-color);
    font-size: 18px;
    font-weight: 600;
    opacity: 0;
    .btn {
      max-width: max-content;
      margin: 0;
      top: 0px;
      left: 16px;
    }

    &:hover {
      color: var(--primary-color);
    }
  }
}
.target-burger {
  display: block;
  transition: 0.5s;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
    opacity: opacity(0.45);
  }
  &.visible {
    ul.buns {
      width: 32px;
      height: 32px;
      li.bun {
        -webkit-transform: rotate(45deg) translateZ(0);
        transform: rotate(45deg) translateZ(0);
        &:last-child {
          -webkit-transform: rotate(-45deg) translateZ(0);
          transform: rotate(-45deg) translateZ(0);
        }
      }
    }
  }
  .buns {
    width: 32px;
    height: 32px;
    list-style: none;
    padding: 0;
    -webkit-transition: -webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1),
      color 1s cubic-bezier(0.23, 1, 0.32, 1);
    transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
      color 1s cubic-bezier(0.23, 1, 0.32, 1);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    color: var(--primary-color);
    .bun {
      width: 100%;
      height: 3px;
      background-color: var(--primary-color);
      position: absolute;
      top: 50%;
      margin-top: -0.75px;
      -webkit-transform: translateY(-3.75px) translateZ(0);
      transform: translateY(-3.75px) translateZ(0);
      -webkit-transition: -webkit-transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1s cubic-bezier(0.23, 1, 0.32, 1);
      transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1),
        background-color 1s cubic-bezier(0.23, 1, 0.32, 1);
      &:last-child {
        -webkit-transform: translateY(3.75px) translateZ(0);
        transform: translateY(3.75px) translateZ(0);
      }
    }
  }
}
</style>
