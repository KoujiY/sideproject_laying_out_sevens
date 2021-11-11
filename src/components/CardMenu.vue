<template>
  <Card>
    <template #content v-if="poker.show">
      <div
        v-html="poker.card"
        v-bind="$attrs"
        :id="poker.suit + '-' + poker.num"
      ></div>
    </template>
    <template #content v-else></template>
  </Card>
</template>

<script>
export default {
  name: "Poker",
  props: ["poker"],
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
@import "primeflex/primeflex.scss";

.p-card {
  @include styleclass("p-0 flex align-items-center");
  width: 7.5%;
  height: 10vw;
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
