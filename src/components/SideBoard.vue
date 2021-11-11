<template>
  <ScrollPanel style="width: 100%; height: 100%">
    <h5>Setting</h5>
    <p>請選擇NPC人數：</p>
    <div id="settingDiv">
      <Dropdown
        v-model="npcNums"
        :options="numsOption"
        optionLabel="name"
        optionValue="code"
      />
      <BTN
        class="p-button-text p-button-raised"
        v-tooltip.top="'開始遊戲'"
        @click="this.$emit('start')"
      >
        <i class="pi pi-play"></i>
      </BTN>
    </div>
    <Divider />
    <h5>Rule</h5>
    <p>基礎規則：</p>
    <ul>
      <li>持♠7者先出牌，之後玩家輪流出牌。</li>
      <li>
        必須接續同花色且依照數字順序出牌(6→A or 8→K)，或者打出其他花色的7。
      </li>
      <li>還沒輪到自己時，手牌區域會被block住，無法操作。</li>
      <li>會透過亮度提示那些牌是可以打出的，即使該張牌已經被覆蓋也會提示。</li>
      <li>
        當沒辦法出牌時，改為從手上覆蓋一張牌，到遊戲結束前不可公開覆蓋的牌。
      </li>
      <li>
        所有人都出完手牌時遊戲結束，依照覆蓋的牌計分，A為1點，K為13點，點數總和較小者獲勝。
      </li>
    </ul>
    <p>其他：</p>
    <ul>
      <li>wiki上的規則是2~10人，但因沒有細想版面規劃，故只開放3~5個NPC。</li>
      <li>玩家固定為第一個，也會是第一個發到牌的。</li>
      <li>
        NPC出牌速度固定為0.5秒，若未來要優化的話會考慮玩家順序與出牌速度等設定。
      </li>
      <li>NPC人數調整後不會即時反應，要開始遊戲後才會變化。</li>
    </ul>
    <p>NPC出牌&蓋牌邏輯：</p>
    <ul>
      <li>NPC會計算手中每張撲克牌的期望值。</li>
      <li>
        定義：區間=該張撲克剩餘影響的牌。公式為：區間自己點數和-(區間總點數和-區間自己點數和)/剩餘玩家人數。
      </li>
      <li>
        由於是自己簡單想的期望值算法，應該還有不完備的地方，請勿見怪。(只是打算簡單給個邏輯這樣)
      </li>
      <li>出牌時會選擇期望值小的，蓋牌時則選擇期望值大的。</li>
    </ul>
    <Divider />
    <h5>About</h5>
    <p>此為Vue的練習專案，使用技術和工具如下：</p>
    <a href="https://cli.vuejs.org/">Vue CLI</a>
    <a href="https://eslint.org/">ESLint</a>
    <a href="https://prettier.io/">Prettier</a>
    <a href="https://babeljs.io/">Babel</a>
    <a href="https://www.primefaces.org/primevue/">
      PrimeVue (包含PrimeFlex、PrimeIcons)
    </a>
    <a href="https://www.npmjs.com/package/node-sass">node-sass</a>
    <a href="https://www.npmjs.com/package/sass-loader">sass-loader</a>
    <a href="https://tairraos.github.io/Poker.JS/">Poker.js</a>
    <p>核心工具如ESLint、Prettier、Babel均於Vue CLI建構時安裝。</p>
    <p>
      如有問題或bug歡迎至
      <a href="https://github.com/KoujiY/sideproject_laying_out_sevens">
        Github
      </a>
      回應。
    </p>
  </ScrollPanel>
</template>

<script>
export default {
  name: "SideBoard",
  props: {
    playerNums: { type: Number },
  },
  data() {
    return {
      npcNums: this.playerNums - 1,
      numsOption: [
        { name: "3人", code: 3 },
        { name: "4人", code: 4 },
        { name: "5人", code: 5 },
      ],
    };
  },
  watch: {
    npcNums(val) {
      this.$emit("editnpc", val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "primeflex/primeflex.scss";

a {
  display: block;
}
p {
  a {
    display: inline;
  }
}
::v-deep(.p-scrollpanel-bar) {
  &:hover {
    background-color: var(--primary-color);
  }
}
#settingDiv {
  @include styleclass("flex align-items-stretch");
  .p-dropdown,
  .p-button {
    @include styleclass("ml-1");
  }
}
</style>
