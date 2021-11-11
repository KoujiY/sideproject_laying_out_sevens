import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/saga-blue/theme.css"; // theme
import "primevue/resources/primevue.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css"; // flex

import Button from "primevue/button";
import Fieldset from "primevue/fieldset";
import Card from "primevue/card";
import Dialog from "primevue/dialog";
import Tooltip from "primevue/tooltip";
import Panel from "primevue/panel";
import BlockUI from "primevue/blockui";
import Chip from "primevue/chip";
import Sidebar from "primevue/sidebar";
import Divider from "primevue/divider";
import ScrollPanel from "primevue/scrollpanel";
import Dropdown from "primevue/dropdown";

const app = createApp(App);
app.use(PrimeVue);

app.component("BTN", Button);
app.component("Fieldset", Fieldset);
app.component("Card", Card);
app.component("Dialog", Dialog);
app.directive("tooltip", Tooltip);
app.component("Panel", Panel);
app.component("BlockUI", BlockUI);
app.component("Chip", Chip);
app.component("Sidebar", Sidebar);
app.component("Divider", Divider);
app.component("ScrollPanel", ScrollPanel);
app.component("Dropdown", Dropdown);

app.mount("#app");
