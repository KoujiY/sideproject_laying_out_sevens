<template>
  <Card>
    <template #content v-if="poker.isFold && nowPlace === 'PlayerBoard'">
      <div v-html="cardBack" v-bind="$attrs"></div>
    </template>
    <template #content v-else-if="show">
      <div v-html="poker.card" v-bind="$attrs"></div>
    </template>
    <template #content v-else></template>
  </Card>
</template>

<script>
export default {
  name: "Poker",
  props: {
    poker: { type: Object },
    show: { type: Boolean },
    nowPlace: { type: String },
  },
  inject: ["cardBack"],
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
@import "primeflex/primeflex.scss";

.p-card {
  @include styleclass("p-0 flex align-items-center");
  width: 7.5%;
  height: 8vw;
  max-height: 120px;
  border: black 1px dashed;
}
::v-deep(.p-card-body) {
  @include styleclass("p-0");
  .p-card-content {
    @include styleclass("p-0");
    div {
      @include styleclass("flex align-items-center");
    }
    img {
      @include styleclass("w-full");
    }
  }
}
</style>
