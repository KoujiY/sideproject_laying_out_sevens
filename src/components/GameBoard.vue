<template>
  <Fieldset legend="GameBoard">
    <template v-for="poker in initPokers" :key="poker.suit + poker.num">
      <Poker :poker="poker" :show="poker.boardShow" nowPlace="GameBoard" />
    </template>
  </Fieldset>
</template>

<script>
import Poker from "./Poker.vue";

export default {
  name: "GameBoard",
  props: { initPokers: { type: Array } },
  components: { Poker },
};
</script>
