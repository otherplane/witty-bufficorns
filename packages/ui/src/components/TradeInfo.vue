<template>
  <div class="carousel relative rounded relative overflow-hidden shadow-xl">
    <div class="carousel-inner relative overflow-hidden w-full">
      <!--Slide 1-->
      <input
        class="carousel-open"
        type="radio"
        id="carousel-1"
        name="carousel"
        aria-hidden="true"
        hidden=""
        checked="checked"
      />
      <div
        class="carousel-item absolute opacity-0 bg-center"
        style="height:max-content;"
      >
        <p>Time left to trade</p>
        <TimeLeft :timestamp="tradeInfo.tradeOut?.timestamp" :seconds="true" />
      </div>
      <label
        for="carousel-3"
        class="control-1 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-red-700 leading-tight text-center z-10 inset-y-0 left-0 my-auto flex justify-center content-center"
      >
        <img src="@/assets/angle-left.svg" alt="angle-left" />
      </label>
      <label
        for="carousel-2"
        class="next control-1 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-red-700 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
      >
        <img src="@/assets/angle-right.svg" alt="angle-left" />
      </label>

      <!--Slide 2-->
      <input
        class="carousel-open"
        type="radio"
        id="carousel-2"
        name="carousel"
        aria-hidden="true"
        hidden=""
      />
      <div
        class="carousel-item absolute opacity-0 bg-center"
        style="height:max-content;"
      >
        <p>Last trade resource</p>
        <p>{{ (tradeInfo && tradeInfo.tradeOut?.resource) || 'null' }}</p>
      </div>
      <label
        for="carousel-1"
        class=" control-2 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
      >
        <img src="@/assets/angle-left.svg" alt="angle-left" />
      </label>
      <label
        for="carousel-3"
        class="next control-2 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
      >
        <img src="@/assets/angle-right.svg" alt="angle-left" />
      </label>

      <!--Slide 3-->
      <input
        class="carousel-open"
        type="radio"
        id="carousel-3"
        name="carousel"
        aria-hidden="true"
        hidden=""
      />
      <div class="carousel-item absolute opacity-0" style="height:max-content;">
        <p>Last trade partner</p>
        <p>{{ (tradeInfo && tradeInfo.tradeOut?.from) || 'null' }}</p>
      </div>
      <label
        for="carousel-2"
        class="control-3 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
      >
        <img src="@/assets/angle-left.svg" alt="angle-left" />
      </label>
      <label
        for="carousel-1"
        class="next control-3 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full hover:bg-blue-700 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
      >
        <img src="@/assets/angle-right.svg" alt="angle-left" />
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tradeInfo: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.carousel-open:checked + .carousel-item {
  position: static;
  opacity: 100;
}

.carousel-item {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  align-items: center;
  text-align: center;
  padding: 8px;
  justify-content: center;
}

#carousel-1:checked ~ .control-1,
#carousel-2:checked ~ .control-2,
#carousel-3:checked ~ .control-3 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
