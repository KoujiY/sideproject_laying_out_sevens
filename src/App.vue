<template>
  <div id="main">
    <GameBoard v-model:initPokers="initPokers" />
    <PlayerBoard
      v-model:player="players[0]"
      :suits="suits"
      :playCard="playCard"
      :foldCard="foldCard"
      :justPlayed="justPlayed"
      :firstPlayer="firstPlayer"
    />
  </div>
  <ListBoard
    :players="players"
    :justPlayed="justPlayed"
    @openside="showSidebar = true"
  />
  <Dialog
    v-model:visible="summaryShow"
    :style="{ width: '50vw' }"
    :modal="true"
    :closable="false"
    :draggable="false"
  >
    <template #header>
      <h3>{{ winnerName }}獲勝！</h3>
    </template>
    <template v-for="(player, index) in players" :key="'Player' + index">
      <div :class="{ winner: player.finalRank === 1 }">
        <i class="pi pi-star" v-show="player.finalRank === 1" />
        <Chip v-if="index === 0">玩家</Chip>
        <Chip v-else>NPC-{{ index }}</Chip>
        <Chip>蓋牌：{{ player.foldCount }} 張</Chip>
        <Chip>總點數：{{ player.foldPoint }} 點</Chip>
      </div>
    </template>
    <template #footer>
      <BTN
        @click="showSidebar = true"
        class="p-button-text p-button-raised"
        v-tooltip.top="'設定面板'"
      >
        <i class="pi pi-cog"></i>
      </BTN>
      <BTN
        @click="gameStart()"
        class="p-button-text p-button-raised"
        v-tooltip.top="'重新開始'"
      >
        <i class="pi pi-replay"></i>
      </BTN>
    </template>
  </Dialog>
  <Sidebar v-model:visible="showSidebar" class="p-sidebar-md">
    <SideBoard
      v-model:playerNums="playerNums"
      @editnpc="(val) => (playerNums = val + 1)"
      @start="gameStart"
    />
  </Sidebar>
</template>

<script>
import GameBoard from "@/components/GameBoard.vue";
import PlayerBoard from "@/components/PlayerBoard.vue";
import ListBoard from "@/components/ListBoard.vue";
import SideBoard from "@/components/SideBoard.vue";

export default {
  name: "",
  components: { GameBoard, PlayerBoard, ListBoard, SideBoard },
  data() {
    return {
      suits: ["spade", "heart", "diamond", "club"], // 定義花色
      numbers: ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"], // 定義卡片點數
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // 定義卡片點數的大小
      initPokers: [], // 原始排序
      shuffledCards: [], // 洗牌後的排序
      players: [], // 依照洗牌後的排序發給玩家
      playerNums: 4, // 定義玩家數量
      justPlayed: {}, // 紀錄剛才執行的行動(一開始先設定空物件，讓PlayerBoard顯示空白)
      outOfCards: 0, // 手牌出光的玩家數量
      showSidebar: true, // 側邊欄顯示
      summaryShow: false, // 結算畫面顯示
      winnerName: "", // 結算畫面的獲勝者名稱
      firstPlayer: NaN, //起始玩家ID
    };
  },
  provide() {
    return {
      cardBack: window.Poker.getBackImage(200, "#DEF3E5", "#92D9AC").outerHTML, // 牌背
    };
  },
  methods: {
    // 定義每一張卡片，整副撲克牌初始化(載入頁面時必要執行)
    pokerArr() {
      for (let i = 0; i < this.suits.length; i++) {
        for (let j = 0; j < this.numbers.length; j++) {
          this.initPokers.push({
            suit: this.suits[i],
            num: this.numbers[j],
            value: this.values[j],
            boardShow: false, // 場中的卡片是否顯示
            handShow: true, // 手中的卡片是否顯示
            isFold: false, // 手中的卡片是否為蓋牌
            canPlay: false, // 卡片是否可打出
            display: false, // 出牌對話框是否顯示
            card: window.Poker.getCardImage(200, this.suits[i], this.numbers[j])
              .outerHTML, // 透過套件繪製卡片
          });
          if (i === 0 && j === 6)
            this.initPokers[this.initPokers.length - 1].canPlay = true; // 黑桃7初始化，設定為可打出
        }
      }
    },
    // 避免汙染原始排序，複製之後才洗牌(載入頁面時必要執行)
    initCards() {
      this.shuffledCards = [...this.initPokers];
      this.shuffledCards.sort(() => Math.random() - 0.5);
      // 第1個for迴圈依照玩家數量設定玩家物件，接著第2個for迴圈發牌
      for (let i = 0; i < this.playerNums; i++) {
        this.players.push({
          playerIndex: i, // 玩家於陣列中的index
          playerCards: [], // 玩家手牌
          nowPlay: false, // 現正輪到此玩家的flag
          foldCount: 0, // 蓋牌數量
          isPlayed: 0, // 已出牌數量(含蓋牌)
          foldPoint: 0, // 蓋牌總點數
          finalRank: 0, // 最終名次
        });
      }
      for (let j = 0; j < this.shuffledCards.length; j++) {
        this.players[j % this.playerNums].playerCards.push(
          this.shuffledCards[j]
        );
        if (
          this.shuffledCards[j].suit === "spade" &&
          this.shuffledCards[j].value === 7
        ) {
          this.players[j % this.playerNums].nowPlay = true;
          // console.log("initPlayer:", this.players[j % this.playerNums]);
        }
      }
      // console.log("initPokers:", this.initPokers);
      // console.log("shuffled:", this.shuffledCards);
      // console.log("players:", this.players);
    },
    // 無論是出牌或蓋牌，最後都會執行這支
    endAction(nowCard, index, action) {
      // console.log(`NPC${index}執行${action}，${nowCard.suit + nowCard.num}`);
      nowCard.display = false;
      this.justPlayed.played = nowCard;
      this.justPlayed.doWhat = action;
      this.players[index].isPlayed += 1;
      if (
        this.players[index].isPlayed === this.players[index].playerCards.length
      )
        this.outOfCards += 1; // 計算手牌出光的玩家數量
      // 遊戲結束的條件判斷&排名邏輯
      if (this.outOfCards === this.playerNums) {
        // console.log("Game Set");
        this.$nextTick(() => {
          this.summaryShow = true;
          let tempArr = [...this.players]; // 複製玩家陣列來排序名次
          tempArr.sort((a, b) => {
            if (a.foldPoint !== b.foldPoint) {
              return a.foldPoint - b.foldPoint;
            } else if (a.foldCount !== b.foldCount) {
              return a.foldCount - b.foldCount;
            } else {
              return a.playerIndex - b.playerIndex;
            }
          });
          // console.log("rankedArray:",tempArr);
          // 將排序的名次存回原始的玩家資料中
          tempArr.forEach((val, index) => {
            if (
              index !== 0 &&
              tempArr[index].foldPoint === tempArr[index - 1].foldPoint &&
              tempArr[index].foldCount === tempArr[index - 1].foldCount
            ) {
              this.players[val.playerIndex].finalRank =
                tempArr[index - 1].finalRank;
            } else {
              this.players[val.playerIndex].finalRank = index + 1;
            }
          });
          // 設定最後的對話框顯示的排名文字
          for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i].finalRank !== 1) break;
            if (this.winnerName !== "") this.winnerName += "&";
            if (tempArr[i].playerIndex === 0) {
              this.winnerName += "玩家";
            } else {
              this.winnerName += `NPC-${tempArr[i].playerIndex}`;
            }
          }
        });
      } else {
        this.justPlayed.nowIndex = index; // 尚未結束時，修改nowIndex推進下一個player
      }
    },
    // 計算期望值用的函式(for NPC)
    expValArr(inputArr, id) {
      const expArr = inputArr.map((el, index) => {
        let bigTotal = 0; // 定義全部大於的點數總合
        let smallTotal = 0; // 定義全部小於的點數總合
        let bigPlTotal = 0; // 定義全部玩家手牌大於的點數總合
        let smallPlTotal = 0; // 定義全部玩家手牌小於的點數總合
        // 將前兩個變數賦值
        this.shuffledCards.forEach((el1) => {
          if (el.suit === el1.suit && el.value < el1.value)
            bigTotal += el1.value;
          if (el.suit === el1.suit && el.value > el1.value)
            smallTotal += el1.value;
        });
        // 將後兩個變數賦值
        this.players[id].playerCards.forEach((el2) => {
          if (el.suit === el2.suit && el.value < el2.value)
            bigPlTotal += el2.value;
          if (el.suit === el2.suit && el.value > el2.value)
            smallPlTotal += el2.value;
        });
        // 計算期望值後回傳
        if (el.value === 7) {
          const expVal =
            bigPlTotal +
            smallPlTotal -
            (bigTotal + smallTotal - bigPlTotal - smallPlTotal) /
              (this.playerNums - this.outOfCards - 1);
          return { expVal, index };
        } else if (el.value > 7) {
          const expVal =
            bigPlTotal -
            (bigTotal - bigPlTotal) / (this.playerNums - this.outOfCards - 1);
          return { expVal, index };
        } else {
          const expVal =
            smallPlTotal -
            (smallTotal - smallPlTotal) /
              (this.playerNums - this.outOfCards - 1);
          return { expVal, index };
        }
      });
      return expArr;
    },
    // 出牌函式
    playCard(nowCard, index) {
      // console.log("當前出牌&玩家index：", nowCard, index);
      nowCard.boardShow = true;
      nowCard.handShow = false;
      // 取得點數+1的卡片物件資料
      const biggerCard = this.shuffledCards.find(
        (el) => el.suit === nowCard.suit && el.value === nowCard.value + 1
      );
      // 取得點數-1的卡片物件資料
      const smallerCard = this.shuffledCards.find(
        (el) => el.suit === nowCard.suit && el.value === nowCard.value - 1
      );
      // 黑桃7打出後的邏輯(讓其他7可以打出)
      if (nowCard.value === 7 && nowCard.suit === "spade") {
        this.shuffledCards.forEach((el) => {
          if (el.value === 7) el.canPlay = true;
        });
      }
      // 依照出牌內容設定下一張可以打的卡片
      if (nowCard.value === 7) {
        biggerCard.canPlay = true;
        smallerCard.canPlay = true;
      }
      if (nowCard.value > 7 && nowCard.value < 13) {
        biggerCard.canPlay = true;
      }
      if (nowCard.value < 7 && nowCard.value > 1) {
        smallerCard.canPlay = true;
      }
      // 回傳所執行的行動
      this.endAction(nowCard, index, "出牌");
    },
    // 蓋牌函式
    foldCard(nowCard, index) {
      // console.log("當前出牌&玩家index：", nowCard, index);
      nowCard.isFold = true;
      this.endAction(nowCard, index, "蓋牌");
      this.players[index].foldCount += 1;
      this.players[index].foldPoint += nowCard.value;
    },
    // 回合決策邏輯(for NPC)
    gameLogic(index) {
      if (index !== 0) {
        const validArr = this.players[index].playerCards.filter(
          (el) => el.canPlay && !el.isFold && !el.boardShow
        );
        setTimeout(() => {
          if (validArr.length !== 0) {
            if (validArr.length === 1) {
              this.playCard(validArr[0], index);
            } else {
              const expArr = this.expValArr(validArr, index).sort(
                (a, b) => b.expVal - a.expVal
              );
              this.playCard(validArr[expArr[0].index], index);
            }
          } else {
            const foldArr = this.players[index].playerCards.filter(
              (el) => !el.isFold && !el.boardShow
            );
            if (foldArr.length === 1) {
              this.foldCard(foldArr[0], index);
            } else {
              const expArr = this.expValArr(foldArr, index).sort(
                (a, b) => a.expVal - b.expVal
              );
              this.foldCard(foldArr[expArr[0].index], index);
            }
          }
        }, 500);
      } // 要人工點擊再把這個if打開
    },
    // 點擊遊戲開始按鈕後觸發的函式
    gameStart() {
      // console.log("press start");
      // 各項目先初始化(重置)
      this.initPokers.length = 0;
      this.shuffledCards.length = 0;
      this.players.length = 0;
      this.firstPlayer = NaN;
      for (let key in this.justPlayed) {
        delete this.justPlayed[key];
      }
      this.justPlayed = {
        played: {},
        doWhat: "",
        nowIndex: NaN,
      };
      this.outOfCards = 0;
      this.showSidebar = false;
      this.summaryShow = false;
      this.winnerName = "";
      // 執行初始化函式
      this.pokerArr();
      this.initCards();
      this.firstPlayer = this.players.findIndex((el1) => el1.nowPlay);
      this.gameLogic(this.firstPlayer); // 初始化後將持有黑桃七的玩家index傳入gameLogic做初動
    },
  },
  created() {
    this.pokerArr();
    this.initCards();
  },
  watch: {
    // 監聽目前的玩家動作(if檢查分別是為了跳過初次與後續的gameStart() reset)
    "justPlayed.nowIndex"(val, oldVal) {
      // console.log(`nowIndex：${val}`);
      if (!Number.isNaN(val) && oldVal !== undefined) {
        this.players[val].nowPlay = false;
        const restArr = this.players.filter(
          (el1) => el1.playerCards.length !== el1.isPlayed
        ); // 將篩選剩餘玩家為陣列，並找出下一個出牌的玩家
        const nextPlayer = restArr.find((el2) => el2.playerIndex > val);
        if (!nextPlayer) {
          restArr[0].nowPlay = true;
          this.gameLogic(restArr[0].playerIndex);
        } else {
          nextPlayer.nowPlay = true;
          this.gameLogic(nextPlayer.playerIndex);
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "primeflex/primeflex.scss";

#app {
  @include styleclass(
    "mx-auto flex flex-wrap justify-content-evenly align-items-center"
  );
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  max-width: 1500px;
  #main {
    @include styleclass("text-left");
    width: 80%;
    .p-fieldset-content {
      @include styleclass("flex flex-wrap justify-content-between");
    }
  }
}
.p-dialog-content {
  div {
    @include styleclass("mb-2");
    .pi {
      @include styleclass("mr-1");
    }
    .p-chip {
      @include styleclass("mr-2");
    }
  }
  .winner {
    i {
      color: var(--yellow-500);
    }
    div {
      background-color: var(--yellow-500);
    }
  }
}
.toolTipStyle {
  width: 7.5%;
  img {
    width: 100%;
  }
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1.5rem 0 1rem 0;
  font-weight: 600;
  line-height: 1.2;
}
h1 {
  font-size: 2.5rem;
}
h2 {
  font-size: 2rem;
}
h3 {
  font-size: 1.75rem;
}
h4 {
  font-size: 1.5rem;
}
h5 {
  font-size: 1.25rem;
}
h6 {
  font-size: 1rem;
}
p,
li {
  line-height: 1.5;
  margin: 0.3rem 25% 0.5rem 0;
}
</style>
