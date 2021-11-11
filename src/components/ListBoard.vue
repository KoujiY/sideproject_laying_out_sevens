<template>
  <Panel header="PlayerList">
    <template #icons>
      <BTN
        icon="pi pi-cog"
        class="p-panel-header-icon p-link p-mr-2"
        @click="$emit('openside')"
        v-tooltip.bottom="'側邊面板'"
      />
    </template>
    <template v-for="(player, index) in players" :key="'NPC' + index">
      <Card
        v-tooltip.left.focus="{
          value: `${showCard()}`,
          class: 'toolTipStyle',
        }"
        :id="'Player-' + index"
      >
        <template #title v-if="index === 0"> 玩家 </template>
        <template #title v-else> NPC-{{ index }} </template>
        <template #content>
          <div>蓋牌：{{ player.foldCount }}張</div>
          <div>手牌：{{ player.playerCards.length - player.isPlayed }}張</div>
        </template>
      </Card>
    </template>
  </Panel>
</template>

<script>
export default {
  name: "ListBoard",
  props: {
    players: { type: Array },
    justPlayed: { type: Object },
  },
  inject: ["cardBack"],
  methods: {
    showCard() {
      if (this.justPlayed.doWhat === "出牌") {
        return this.justPlayed.played.card;
      } else {
        return this.cardBack;
      }
    },
  },
  watch: {
    "justPlayed.played"() {
      this.$nextTick(() => {
        if (this.justPlayed.doWhat !== "") {
          const tempPlayer = document.getElementById(
            `Player-${this.justPlayed.nowIndex}`
          );
          tempPlayer.setAttribute("tabindex", -1);
          tempPlayer.focus();
          setTimeout(() => {
            tempPlayer.removeAttribute("tabindex");
          }, 500);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "primeflex/primeflex.scss";

.p-panel {
  width: 15%;
}
::v-deep(.p-card) {
  @include styleclass("my-2 shadow-3");
}
::v-deep(.p-card-content) {
  @include styleclass("p-0");
}
</style>
