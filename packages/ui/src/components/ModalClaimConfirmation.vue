<template>
  <div class="bg-beige px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-beige sm:mx-0 sm:h-10 sm:w-10"
      >
        <svg
          width="46"
          height="45"
          viewBox="0 0 46 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="fill"
            d="M23 10L25.9187 18.6373H35.3637L27.7225 23.9754L30.6412 32.6127L23 27.2746L15.3588 32.6127L18.2775 23.9754L10.6363 18.6373H20.0813L23 10Z"
            fill="#BD3800"
          />
          <path
            d="M23 3.1725L27.2148 15.8623L27.4422 16.5471H28.1638H41.7412L30.7759 24.3407L30.1731 24.7691L30.4062 25.471L34.6063 38.1166L23.5793 30.2791L23 29.8674L22.4207 30.2791L11.3937 38.1166L15.5938 25.471L15.8269 24.7691L15.2241 24.3407L4.25881 16.5471H17.8362H18.5578L18.7852 15.8623L23 3.1725Z"
            stroke="black"
            stroke-width="2"
          />
        </svg>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <h3 class="text-lg leading-6 font-bold text-black" id="modal-title">
          Register your farmer
        </h3>
        <div class="mt-2">
          <p class="text-sm text-black">
            Do you want to start playing on this browser? If not, create a
            backup using the button in the next page
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-beige px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <button
      @click="emitClaim"
      type="button"
      class="w-full inline-flex justify-center rounded-md border border-orange shadow-sm px-4 py-2 bg-orange text-base font-bold text-pink hover:bg-orange focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CONTINUE
    </button>
    <button
      @click="$parent.$emit('close')"
      type="button"
      class="mt-3 w-full inline-flex justify-center rounded-md border-orange shadow-sm px-4 py-2 bg-transparent text-base font-bold text-brown hover:bg-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    >
      CANCEL
    </button>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'

export default defineComponent({
  emits: ['claim'],
  setup () {
    const instance = getCurrentInstance()
    return {
      emitClaim () {
        instance.emit('claim')
      }
    }
  }
})
</script>
