/** Main nav "Enter Your Book": dispatch + sessionStorage so /enter resets to step 1 + top. */
export const ENTER_MAIN_NAV_EVENT = "enter-main-nav-enter-book";
export const ENTER_MAIN_NAV_STORAGE_KEY = "maya_enter_main_nav";

/** Main nav "The Rules": `/enter?step=1` + scroll to stepper (event + storage for cross-route navigation). */
export const ENTER_MAIN_NAV_RULES_EVENT = "enter-main-nav-rules";
export const ENTER_MAIN_NAV_RULES_STORAGE_KEY = "maya_enter_main_nav_rules";

export const WIZARD_STEPS = [
  { label: "Read rules", mobileLabel: "Rules", sublabel: "of competition" },
  { label: "Enter details and", mobileLabel: "Details", sublabel: "number of books" },
  { label: "Enter card", mobileLabel: "Pay", sublabel: "and pay" },
  { label: "Print label and", mobileLabel: "Post", sublabel: "post your book/s" },
];

export const DEFAULT_SHIPPING = {
  name: "Maya Poetry Book Awards",
  street: "9 The Avenue\nThe Common",
  town: "Pontypridd",
  postcode: "CF37 4DF",
  country: "United Kingdom",
};

export const DEFAULT_PRICE_SINGLE = 40;
export const DEFAULT_PRICE_MULTIPLE = 35;
