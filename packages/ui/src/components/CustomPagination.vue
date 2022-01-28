<template>
  <div>
    <v-pagination
      class="pagination"
      v-model="page"
      :pages="60"
      :range-size="1"
      active-color="var(--primary-color-opacity-2)"
      @update:modelValue="updatePage"
    />
  </div>
</template>

<script>
import VPagination from '@hennge/vue3-pagination'
import { ref } from 'vue'

export default {
  components: {
    VPagination
  },
  setup (props, { emit }) {
    const page = ref(1)
    function updatePage (page) {
      console.log('page', page)
      emit('update-page', page)
    }
    return { updatePage, page }
  }
}
</script>
<style lang="scss">
.pagination {
  padding-top: 16px;
  display: flex;
  color: var(--primary-color);
  font-size: 16px;
  justify-content: center;
  align-items: center;
  .PaginationControl {
    justify-content: center;
    display: flex;
    .Control {
      width: 24px;
      color: var(--primary-color);
      path {
        fill: var(--primary-color-opacity-1);
      }
    }
  }
  .DotsHolder {
    justify-content: center;
    display: flex;
    .Dots {
      width: 16px;
      color: $black;
      path {
        fill: var(--primary-color-opacity-1);
      }
    }
  }
  li {
    text-align: center;
    text-justify: center;
    border-radius: 4px;
    .Page {
      font-size: 16px;
      font-family: Zilla Slab, sans-serif;
      font-weight: bold;
      text-align: center;
      padding: 4px 8px;
      border-radius: 4px;
      .Page-active {
        background-color: var(--primary-color);
        border: 1px solid var(--primary-color);
      }
    }
  }
}
</style>
