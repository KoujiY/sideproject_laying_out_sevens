<template>
  <BlockUI
    :blocked="Object.keys(this.justPlayed).length === 0 ? false : !pc.nowPlay"
  >
    <Fieldset legend="PlayerBoard">
      <template
        v-for="(poker, index) in pc.playerCards"
        :key="poker.suit + poker.num"
      >
        <Poker
          :poker="poker"
          :show="
            Object.keys(this.justPlayed).length === 0 ? false : poker.handShow
          "
          nowPlace="PlayerBoard"
          @click="openDialog"
          :id="poker.suit + '-' + poker.value + '-' + index"
          :class="{ cardFaceUp: !poker.isFold, playCardHint: !poker.canPlay }"
          v-tooltip.top="{
            value: `${poker.card}`,
            disabled: !poker.isFold,
            class: 'toolTipStyle',
          }"
        />
        <Dialog header="請選擇" v-model:visible="poker.display" :modal="true">
          <div v-html="poker.card"></div>
          <div class="mt-4 flex justify-content-evenly">
            <BTN
              label="出牌"
              @click="playCard(nowCard, 0)"
              class="p-button-text p-button-raised"
              :disabled="!poker.canPlay"
            />
            <BTN
              label="蓋牌"
              @click="foldCard(nowCard, 0)"
              class="p-button-text p-button-raised p-button-danger"
              :disabled="foldJudge()"
            />
          </div>
        </Dialog>
      </template>
    </Fieldset>
  </BlockUI>
</template>

<script>
import Poker from "./Poker.vue";

export default {
  name: "PlayerBoard",
  props: {
    player: { type: Object },
    suits: { type: Array },
    playCard: { type: Function },
    foldCard: { type: Function },
    justPlayed: { type: Object },
    firstPlayer: { type: Number },
  },
  components: { Poker },
  data() {
    return {
      pc: this.player,
      nowCard: {},
    };
  },
  methods: {
    sortCards() {
      this.pc = this.player;
      this.pc.playerCards.sort((a, b) => {
        let tatalValueA =
          this.suits.findIndex((suit) => suit === a.suit) + a.value / 100;
        let tatalValueB =
          this.suits.findIndex((suit) => suit == b.suit) + b.value / 100;
        // console.log(tatalValueA, tatalValueB); // 檢視模擬的card value大小
        return tatalValueA - tatalValueB;
      });
      // console.log("handCards:", this.pc.playerCards);
    },
    openDialog(event) {
      // 當含有cardFaceUp這個class才會開啟dialog
      // console.log(event.currentTarget);
      if (event.currentTarget.classList.contains("cardFaceUp")) {
        this.nowCard =
          this.pc.playerCards[+event.currentTarget.id.split("-")[2]]; // 取得目前點選的卡片物件資料
        this.nowCard.display = true;
      }
    },
    foldJudge() {
      return this.pc.playerCards.some(
        (el) => el.canPlay && !el.isFold && el.handShow
      );
    },
  },
  watch: {
    firstPlayer() {
      if (!Number.isNaN(this.firstPlayer)) this.sortCards();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "primeflex/primeflex.scss";

.p-fieldset {
  @include styleclass("mt-3");
}
::v-deep(.playCardHint) {
  filter: brightness(0.5);
}
::v-deep(.p-card-body:hover) {
  .cardFaceUp {
    cursor: pointer;
    animation: jumpup 0.4s ease forwards;
    @keyframes jumpup {
      0% {
        transform: translateY(0%);
      }
      100% {
        transform: translateY(-30%);
      }
    }
  }
}
</style>
