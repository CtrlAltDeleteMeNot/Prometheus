"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateWrapper = (obj, member, setter, getter) => ({
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  });
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ts_libs/ts_client/views/ViewHelper.ts
  var ViewHelper;
  var init_ViewHelper = __esm({
    "ts_libs/ts_client/views/ViewHelper.ts"() {
      "use strict";
      ViewHelper = class {
        static setModalState(open) {
          if (true === open) {
            document.body.classList.add("modal-opened");
          } else {
            document.body.classList.remove("modal-opened");
          }
        }
        static getHtmlElementOrThrow(id) {
          const element = document.getElementById(id);
          if (!element) throw new Error(`Element with id ${id} not found.`);
          return element;
        }
        static getHtmlInputElementOrThrow(id) {
          const element = document.getElementById(id);
          if (!element) throw new Error(`Html input with id ${id} not found.`);
          return element;
        }
        static getButtonOrThrow(id) {
          const element = document.getElementById(id);
          if (!element) throw new Error(`Button with id ${id} not found.`);
          return element;
        }
        static getAnchorOrThrow(id) {
          const element = document.getElementById(id);
          if (!element) throw new Error(`Anchor with id ${id} not found.`);
          return element;
        }
        static getSpanOrThrow(id) {
          const element = document.getElementById(id);
          if (!element) throw new Error(`Button with id ${id} not found.`);
          return element;
        }
        static toggleVisibility(element, visible) {
          if (!visible && !element.classList.contains("d-none")) {
            element.classList.add("d-none");
            return;
          }
          if (visible && element.classList.contains("d-none")) {
            element.classList.remove("d-none");
            return;
          }
        }
      };
    }
  });

  // ts_libs/ts_client/views/AboutSectionView.ts
  var _root, _footer, _linkedinContactButton, AboutSectionView;
  var init_AboutSectionView = __esm({
    "ts_libs/ts_client/views/AboutSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      AboutSectionView = class {
        constructor() {
          __privateAdd(this, _root);
          __privateAdd(this, _footer);
          __privateAdd(this, _linkedinContactButton);
          this.id = "about";
          this.title = "About";
          __privateSet(this, _root, ViewHelper.getHtmlElementOrThrow("about"));
          __privateSet(this, _footer, ViewHelper.getHtmlElementOrThrow("footer-about"));
          __privateSet(this, _linkedinContactButton, ViewHelper.getButtonOrThrow("footer-about-linkedin-button"));
          const url = String.fromCharCode(
            104,
            116,
            116,
            112,
            115,
            58,
            47,
            47,
            119,
            119,
            119,
            46,
            108,
            105,
            110,
            107,
            101,
            100,
            105,
            110,
            46,
            99,
            111,
            109,
            47,
            105,
            110,
            47,
            103,
            97,
            98,
            114,
            105,
            101,
            108,
            45,
            97,
            112,
            111,
            115,
            116,
            111,
            108,
            47
          );
          __privateGet(this, _linkedinContactButton).addEventListener("click", () => {
            window.open(url, "_blank", "noopener,noreferrer");
          });
        }
        hasExternalActions() {
          return true;
        }
        show() {
          ViewHelper.toggleVisibility(__privateGet(this, _root), true);
          ViewHelper.toggleVisibility(__privateGet(this, _footer), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root), false);
          ViewHelper.toggleVisibility(__privateGet(this, _footer), false);
        }
      };
      _root = new WeakMap();
      _footer = new WeakMap();
      _linkedinContactButton = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/FilterModalView.ts
  var _root2, _dismiss, _apply, _cancel, _fields, _buttons, _attributes, _active, _filteringRulesChangedHandler, FilterModalView;
  var init_FilterModalView = __esm({
    "ts_libs/ts_client/views/FilterModalView.ts"() {
      "use strict";
      init_ViewHelper();
      FilterModalView = class {
        constructor() {
          __privateAdd(this, _root2);
          __privateAdd(this, _dismiss);
          __privateAdd(this, _apply);
          __privateAdd(this, _cancel);
          __privateAdd(this, _fields);
          __privateAdd(this, _buttons);
          __privateAdd(this, _attributes);
          __privateAdd(this, _active);
          __privateAdd(this, _filteringRulesChangedHandler);
          __privateSet(this, _root2, ViewHelper.getHtmlElementOrThrow("filter-fields-modal"));
          __privateSet(this, _dismiss, ViewHelper.getButtonOrThrow("filter-fields-modal-close"));
          __privateSet(this, _apply, ViewHelper.getButtonOrThrow("filter-fields-modal-apply"));
          __privateSet(this, _cancel, ViewHelper.getButtonOrThrow("filter-fields-modal-cancel"));
          __privateSet(this, _fields, ViewHelper.getHtmlElementOrThrow("filter-fields-modal-body"));
          __privateSet(this, _filteringRulesChangedHandler, (rules) => console.log(`Rules changed ${rules}`));
          __privateGet(this, _dismiss).onclick = () => {
            this.hide();
          };
          __privateGet(this, _cancel).onclick = () => {
            this.hide();
          };
          __privateGet(this, _apply).onclick = () => {
            const selection = this.getSelectedAttributes();
            const selectionChanged = this.checkSelectionChanged(selection);
            if (selectionChanged) {
              console.log(`Selection changed. ${JSON.stringify(selection)}`);
              __privateGet(this, _filteringRulesChangedHandler).call(this, selection);
            }
            this.hide();
          };
        }
        bindFilteringRulesChanged(filteringRulesChangedHandler) {
          __privateSet(this, _filteringRulesChangedHandler, filteringRulesChangedHandler);
        }
        checkSelectionChanged(selection) {
          var _a;
          const activeKeys = ((_a = __privateGet(this, _active)) != null ? _a : []).map((a) => a.key).sort();
          const selectedKeys = selection.map((a) => a.key).sort();
          if (activeKeys.length !== selectedKeys.length) {
            return true;
          }
          return activeKeys.some((key, index) => key !== selectedKeys[index]);
        }
        getSelectedAttributes() {
          var _a, _b;
          const activeKeys = (_b = (_a = __privateGet(this, _buttons)) == null ? void 0 : _a.filter((button) => button.classList.contains("active"))) == null ? void 0 : _b.map((button) => button.getAttribute("data-key"));
          if (!activeKeys || !__privateGet(this, _attributes)) {
            return [];
          }
          return __privateGet(this, _attributes).filter((attr) => activeKeys.includes(attr.key));
        }
        update(model) {
          var _a, _b;
          __privateGet(this, _fields).innerHTML = ``;
          __privateSet(this, _buttons, []);
          __privateSet(this, _attributes, (_b = (_a = model.getFilterableAttributes()) == null ? void 0 : _a.slice(0)) != null ? _b : void 0);
          __privateSet(this, _active, model.getActiveFilterableAttributes());
          if (__privateGet(this, _attributes) === void 0) {
            return;
          }
          __privateSet(this, _buttons, __privateGet(this, _attributes).flatMap((attr) => {
            var button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("checkable");
            const isActive = __privateGet(this, _active) !== void 0 && __privateGet(this, _active).some((s) => s.key === attr.key);
            if (isActive) {
              button.classList.add("active");
            }
            button.setAttribute("data-key", attr.key);
            button.textContent = attr.label;
            __privateGet(this, _fields).append(button);
            return button;
          }));
          __privateGet(this, _buttons).forEach((button) => {
            button.onclick = () => {
              button.classList.toggle("active");
            };
          });
        }
        show() {
          ViewHelper.setModalState(true);
          ViewHelper.toggleVisibility(__privateGet(this, _root2), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root2), false);
          ViewHelper.setModalState(false);
        }
      };
      _root2 = new WeakMap();
      _dismiss = new WeakMap();
      _apply = new WeakMap();
      _cancel = new WeakMap();
      _fields = new WeakMap();
      _buttons = new WeakMap();
      _attributes = new WeakMap();
      _active = new WeakMap();
      _filteringRulesChangedHandler = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/exports/SortDirection.ts
  var init_SortDirection = __esm({
    "ts_libs/ts_worker/application/exports/SortDirection.ts"() {
      "use strict";
    }
  });

  // ts_libs/ts_client/views/NavigationView.ts
  var _sidebar, _header, _headerSectionName, _footer2, _expandAction, _collapseAction, _sortActionMainText, _sortActionSubText, _sortActionImage, _showPageSignalsAction, _showPageScreenerAction, _showPageAboutAction, NavigationView;
  var init_NavigationView = __esm({
    "ts_libs/ts_client/views/NavigationView.ts"() {
      "use strict";
      init_SortDirection();
      init_ViewHelper();
      NavigationView = class {
        constructor() {
          __privateAdd(this, _sidebar);
          __privateAdd(this, _header);
          __privateAdd(this, _headerSectionName);
          __privateAdd(this, _footer2);
          __privateAdd(this, _expandAction);
          __privateAdd(this, _collapseAction);
          __privateAdd(this, _sortActionMainText);
          __privateAdd(this, _sortActionSubText);
          __privateAdd(this, _sortActionImage);
          __privateAdd(this, _showPageSignalsAction);
          __privateAdd(this, _showPageScreenerAction);
          __privateAdd(this, _showPageAboutAction);
          __privateSet(this, _sidebar, ViewHelper.getHtmlElementOrThrow("nav-sidebar"));
          __privateSet(this, _header, ViewHelper.getHtmlElementOrThrow("nav-header"));
          __privateSet(this, _headerSectionName, ViewHelper.getHtmlElementOrThrow("current-section"));
          __privateSet(this, _footer2, ViewHelper.getHtmlElementOrThrow("nav-footer"));
          __privateSet(this, _expandAction, ViewHelper.getButtonOrThrow("menu-open"));
          __privateSet(this, _collapseAction, ViewHelper.getButtonOrThrow("menu-close"));
          __privateSet(this, _sortActionMainText, ViewHelper.getSpanOrThrow("nav-footer-sort-main-text"));
          __privateSet(this, _sortActionSubText, ViewHelper.getSpanOrThrow("nav-footer-sort-sub-text"));
          __privateSet(this, _sortActionImage, ViewHelper.getSpanOrThrow("nav-footer-sort-svg"));
          __privateSet(this, _showPageAboutAction, ViewHelper.getAnchorOrThrow("nav-menu-about"));
          __privateSet(this, _showPageSignalsAction, ViewHelper.getAnchorOrThrow("nav-menu-signals"));
          __privateSet(this, _showPageScreenerAction, ViewHelper.getAnchorOrThrow("nav-menu-screener"));
          __privateGet(this, _expandAction).onclick = () => this.showSideMenu();
          __privateGet(this, _collapseAction).onclick = () => this.closeSideMenu();
          __privateGet(this, _showPageAboutAction).onclick = () => console.log(`Show about page clicked`);
          __privateGet(this, _showPageScreenerAction).onclick = () => console.log(`Show screener page clicked`);
          __privateGet(this, _showPageSignalsAction).onclick = () => console.log(`Show signals page clicked`);
        }
        showSideMenu() {
          __privateGet(this, _sidebar).classList.add("open");
        }
        closeSideMenu() {
          __privateGet(this, _sidebar).classList.remove("open");
        }
        getShowPageActions() {
          return [__privateGet(this, _showPageAboutAction), __privateGet(this, _showPageScreenerAction), __privateGet(this, _showPageSignalsAction)];
        }
        bindShowSectionAction(callback) {
          let navs = this.getShowPageActions();
          for (var i = 0; i < navs.length; i++) {
            let current = navs[i];
            current.onclick = () => {
              navs.forEach((a) => a.classList.remove("active"));
              current.classList.add("active");
              __privateGet(this, _headerSectionName).textContent = current.textContent;
              let target = current.getAttribute("data-target-id");
              if (!target) {
                throw new Error(`No target found`);
              }
              var section = callback(target);
              ViewHelper.toggleVisibility(__privateGet(this, _footer2), section.hasExternalActions());
              this.closeSideMenu();
            };
          }
        }
        update(model) {
          __privateGet(this, _sortActionMainText).textContent = model.getSortNamedAttributeMetadata().label;
          __privateGet(this, _sortActionSubText).textContent = model.getSortDirection() === 0 /* Ascending */ ? "Sorting ascending" : "Sorting descending";
          if (model.getSortDirection() !== 1 /* Descending */) {
            __privateGet(this, _sortActionImage).classList.add("reverse");
          } else {
            __privateGet(this, _sortActionImage).classList.remove("reverse");
          }
        }
        show() {
          __privateGet(this, _sidebar).classList.remove("d-hidden");
          __privateGet(this, _header).classList.remove("d-hidden");
          __privateGet(this, _footer2).classList.remove("d-hidden");
        }
        hide() {
          __privateGet(this, _sidebar).classList.add("d-hidden");
          __privateGet(this, _header).classList.add("d-hidden");
          __privateGet(this, _footer2).classList.add("d-hidden");
        }
      };
      _sidebar = new WeakMap();
      _header = new WeakMap();
      _headerSectionName = new WeakMap();
      _footer2 = new WeakMap();
      _expandAction = new WeakMap();
      _collapseAction = new WeakMap();
      _sortActionMainText = new WeakMap();
      _sortActionSubText = new WeakMap();
      _sortActionImage = new WeakMap();
      _showPageSignalsAction = new WeakMap();
      _showPageScreenerAction = new WeakMap();
      _showPageAboutAction = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/ProgressModalView.ts
  var _root3, _title, _percentText, _percentLine, _body, ProgressModalView;
  var init_ProgressModalView = __esm({
    "ts_libs/ts_client/views/ProgressModalView.ts"() {
      "use strict";
      init_ViewHelper();
      ProgressModalView = class {
        constructor() {
          __privateAdd(this, _root3);
          __privateAdd(this, _title);
          __privateAdd(this, _percentText);
          __privateAdd(this, _percentLine);
          __privateAdd(this, _body);
          __privateSet(this, _root3, ViewHelper.getHtmlElementOrThrow("progress-modal"));
          __privateSet(this, _title, ViewHelper.getHtmlElementOrThrow("progress-modal-title"));
          __privateSet(this, _percentText, ViewHelper.getHtmlElementOrThrow("progress-modal-progress-percent-text"));
          __privateSet(this, _percentLine, ViewHelper.getHtmlElementOrThrow("progress-modal-progress-percent-line"));
          __privateSet(this, _body, ViewHelper.getHtmlElementOrThrow("progress-modal-body"));
        }
        show(title) {
          __privateGet(this, _title).textContent = title;
          __privateGet(this, _body).innerHTML = "";
          __privateGet(this, _percentText).textContent = "0 %";
          __privateGet(this, _percentLine).style.transform = `scaleX(0)`;
          ViewHelper.setModalState(true);
          ViewHelper.toggleVisibility(__privateGet(this, _root3), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root3), false);
          ViewHelper.setModalState(false);
          __privateGet(this, _body).innerHTML = "";
        }
        updateProgress(percent, message) {
          const scale = percent / 100;
          const percentValue = percent.toFixed(0);
          requestAnimationFrame(() => {
            __privateGet(this, _percentText).textContent = `${percentValue} %`;
            __privateGet(this, _percentLine).style.transform = `scaleX(${scale})`;
            const paragraph = document.createElement("p");
            paragraph.textContent = message;
            __privateGet(this, _body).appendChild(paragraph);
            __privateGet(this, _body).scrollTop = __privateGet(this, _body).scrollHeight;
          });
        }
        updateProgressFromWorker(data) {
          this.updateProgress(data.progress, data.message);
        }
      };
      _root3 = new WeakMap();
      _title = new WeakMap();
      _percentText = new WeakMap();
      _percentLine = new WeakMap();
      _body = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/generated/ActionIconsRegistry.ts
  function getActionIconSVGElement(input, fallback = "minus-circle") {
    const id = input.toLowerCase();
    const cached = cache.get(id);
    if (cached) {
      return cached.cloneNode(true);
    }
    const rawSvg = ACTION_ICON_REGISTRY[id.toLowerCase()] || ACTION_ICON_REGISTRY[fallback];
    const parsed = dp.parseFromString(rawSvg, "image/svg+xml");
    const element = parsed.documentElement;
    if (!(element instanceof SVGElement)) {
      throw new Error("Invalid SVG: root is not SVGElement");
    }
    const svg = element;
    cache.set(id, svg);
    return svg.cloneNode(true);
  }
  var ACTION_ICON_REGISTRY, dp, cache;
  var init_ActionIconsRegistry = __esm({
    "ts_libs/ts_client/views/generated/ActionIconsRegistry.ts"() {
      "use strict";
      ACTION_ICON_REGISTRY = {
        "menu-hamburger-1": '<svg width="25" height="24" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.5625 6C3.5625 5.58579 3.89829 5.25 4.3125 5.25H20.3125C20.7267 5.25 21.0625 5.58579 21.0625 6C21.0625 6.41421 20.7267 6.75 20.3125 6.75L4.3125 6.75C3.89829 6.75 3.5625 6.41422 3.5625 6Z"/><path d="M3.5625 18C3.5625 17.5858 3.89829 17.25 4.3125 17.25L20.3125 17.25C20.7267 17.25 21.0625 17.5858 21.0625 18C21.0625 18.4142 20.7267 18.75 20.3125 18.75L4.3125 18.75C3.89829 18.75 3.5625 18.4142 3.5625 18Z"/><path d="M4.3125 11.25C3.89829 11.25 3.5625 11.5858 3.5625 12C3.5625 12.4142 3.89829 12.75 4.3125 12.75L20.3125 12.75C20.7267 12.75 21.0625 12.4142 21.0625 12C21.0625 11.5858 20.7267 11.25 20.3125 11.25L4.3125 11.25Z"/></svg>',
        "refresh-circle-1-clockwise": '<svg width="25" height="24" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.13644 9.54175C3.02923 9.94185 3.26667 10.3531 3.66676 10.4603C4.06687 10.5675 4.47812 10.3301 4.58533 9.92998C5.04109 8.22904 6.04538 6.72602 7.44243 5.65403C8.83948 4.58203 10.5512 4.00098 12.3122 4.00098C14.0731 4.00098 15.7848 4.58203 17.1819 5.65403C18.3999 6.58866 19.3194 7.85095 19.8371 9.28639L18.162 8.34314C17.801 8.1399 17.3437 8.26774 17.1405 8.62867C16.9372 8.98959 17.0651 9.44694 17.426 9.65017L20.5067 11.3849C20.68 11.4825 20.885 11.5072 21.0766 11.4537C21.2682 11.4001 21.4306 11.2727 21.5282 11.0993L23.2629 8.01828C23.4661 7.65734 23.3382 7.2 22.9773 6.99679C22.6163 6.79358 22.159 6.92145 21.9558 7.28239L21.195 8.63372C20.5715 6.98861 19.5007 5.54258 18.095 4.464C16.436 3.19099 14.4033 2.50098 12.3122 2.50098C10.221 2.50098 8.1883 3.19099 6.52928 4.464C4.87027 5.737 3.67766 7.52186 3.13644 9.54175Z"/><path d="M21.4906 14.4582C21.5978 14.0581 21.3604 13.6469 20.9603 13.5397C20.5602 13.4325 20.1489 13.6699 20.0417 14.07C19.5859 15.7709 18.5816 17.274 17.1846 18.346C15.7875 19.418 14.0758 19.999 12.3149 19.999C10.5539 19.999 8.84219 19.418 7.44514 18.346C6.2292 17.4129 5.31079 16.1534 4.79261 14.721L6.45529 15.6573C6.81622 15.8605 7.27356 15.7327 7.47679 15.3718C7.68003 15.0108 7.55219 14.5535 7.19127 14.3502L4.11056 12.6155C3.93723 12.5179 3.73222 12.4932 3.54065 12.5467C3.34907 12.6003 3.18662 12.7278 3.08903 12.9011L1.3544 15.9821C1.15119 16.3431 1.27906 16.8004 1.64 17.0036C2.00094 17.2068 2.45828 17.079 2.66149 16.718L3.42822 15.3562C4.05115 17.0054 5.12348 18.4552 6.532 19.536C8.19102 20.809 10.2237 21.499 12.3149 21.499C14.406 21.499 16.4387 20.809 18.0977 19.536C19.7568 18.263 20.9494 16.4781 21.4906 14.4582Z"/></svg>',
        "xmark": '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z"/></svg>',
        "funnel-1": '<svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.0625 4.47852C4.0625 3.23587 5.06986 2.22852 6.3125 2.22852H17.5625C18.8051 2.22852 19.8125 3.23587 19.8125 4.47852V5.83904C19.8125 6.66156 19.5421 7.46126 19.0429 8.11497L14.7164 13.7806C14.6166 13.9113 14.5625 14.0712 14.5625 14.2358V20.474C14.5625 21.8343 13.0786 22.6745 11.9121 21.9747L10.4049 21.0703C9.72717 20.6637 9.3125 19.9313 9.3125 19.1409V14.2358C9.3125 14.0712 9.25842 13.9113 9.15858 13.7806L4.83212 8.11497C4.33292 7.46126 4.0625 6.66156 4.0625 5.83904V4.47852ZM6.3125 3.72852C5.89829 3.72852 5.5625 4.0643 5.5625 4.47852V5.83904C5.5625 6.33255 5.72475 6.81237 6.02427 7.2046L10.3507 12.8702C10.6502 13.2624 10.8125 13.7422 10.8125 14.2358V19.1409C10.8125 19.4044 10.9507 19.6485 11.1766 19.7841L12.6839 20.6884C12.8505 20.7884 13.0625 20.6684 13.0625 20.474V14.2358C13.0625 13.7422 13.2248 13.2624 13.5243 12.8702L17.8507 7.2046C18.1502 6.81237 18.3125 6.33255 18.3125 5.83904V4.47852C18.3125 4.0643 17.9767 3.72852 17.5625 3.72852H6.3125Z"/></svg>',
        "sort-high-to-low": '<svg width="25" height="24" viewBox="0 0 25 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.504 3.25C13.0898 3.25 12.754 3.58579 12.754 4C12.754 4.41421 13.0898 4.75 13.504 4.75L20.5 4.75C20.9142 4.75 21.25 4.41421 21.25 4C21.25 3.58579 20.9142 3.25 20.5 3.25H13.504Z"/><path d="M13.504 15.4167C13.0898 15.4167 12.754 15.0809 12.754 14.6667C12.754 14.2525 13.0898 13.9167 13.504 13.9167H17.5C17.9142 13.9167 18.25 14.2525 18.25 14.6667C18.25 15.0809 17.9142 15.4167 17.5 15.4167H13.504Z"/><path d="M16 20.75H13.504C13.0898 20.75 12.754 20.4142 12.754 20C12.754 19.5858 13.0898 19.25 13.504 19.25H16C16.4142 19.25 16.75 19.5858 16.75 20C16.75 20.4142 16.4142 20.75 16 20.75Z"/><path d="M13.504 10.0833L19 10.0833C19.4142 10.0833 19.75 9.7475 19.75 9.33329C19.75 8.91908 19.4142 8.58329 19 8.58329L13.504 8.58329C13.0898 8.58329 12.754 8.91908 12.754 9.33329C12.754 9.74751 13.0898 10.0833 13.504 10.0833Z"/><path d="M8.25206 18.1901L9.97387 16.4695C10.2669 16.1767 10.7417 16.1769 11.0345 16.4699C11.3273 16.7629 11.3271 17.2377 11.0342 17.5305L8.03205 20.5305C7.73919 20.8232 7.26459 20.8232 6.97174 20.5305L3.96984 17.5305C3.67685 17.2377 3.6767 16.7628 3.9695 16.4698C4.2623 16.1769 4.73718 16.1767 5.03016 16.4695L6.75206 18.1903L6.75206 4.49915C6.75206 4.08493 7.08784 3.74915 7.50206 3.74915C7.91627 3.74915 8.25206 4.08493 8.25206 4.49915L8.25206 18.1901Z"/></svg>',
        "arrow-right": '<svg width="25" height="25" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><path d="M21.0791 12.519C21.0744 12.7044 21.0013 12.8884 20.8599 13.0299L14.8639 19.0301C14.5711 19.3231 14.0962 19.3233 13.8032 19.0305C13.5103 18.7377 13.5101 18.2629 13.8029 17.9699L18.5233 13.2461L4.32813 13.2461C3.91391 13.2461 3.57813 12.9103 3.57812 12.4961C3.57812 12.0819 3.91391 11.7461 4.32812 11.7461L18.5158 11.7461L13.8029 7.03016C13.5101 6.73718 13.5102 6.2623 13.8032 5.9695C14.0962 5.6767 14.5711 5.67685 14.8639 5.96984L20.813 11.9228C20.976 12.0603 21.0795 12.2661 21.0795 12.4961C21.0795 12.5038 21.0794 12.5114 21.0791 12.519Z"/></svg>',
        "minus-circle": '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.55814 11.25C8.14393 11.25 7.80814 11.5858 7.80814 12C7.80814 12.4142 8.14393 12.75 8.55814 12.75H15.4419C15.8561 12.75 16.1919 12.4142 16.1919 12C16.1919 11.5858 15.8561 11.25 15.4419 11.25H8.55814Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12Z"/></svg>'
      };
      dp = new DOMParser();
      cache = /* @__PURE__ */ new Map();
    }
  });

  // ts_libs/ts_client/views/generated/SymbolIconsRegistry.ts
  function getSymbolImageUrlById(input, fallback = "generic-fallback") {
    const id = input.toLowerCase();
    return SYMBOL_ICON_REGISTRY[id.toLowerCase()] || SYMBOL_ICON_REGISTRY[fallback];
  }
  var SYMBOL_ICON_REGISTRY;
  var init_SymbolIconsRegistry = __esm({
    "ts_libs/ts_client/views/generated/SymbolIconsRegistry.ts"() {
      "use strict";
      SYMBOL_ICON_REGISTRY = {
        "bybit_zro": "img/symbols/bybit_zro.png",
        "bybit_zk": "img/symbols/bybit_zk.png",
        "bybit_xrp": "img/symbols/bybit_xrp.png",
        "bybit_xlm": "img/symbols/bybit_xlm.png",
        "bybit_wld": "img/symbols/bybit_wld.png",
        "bybit_wif": "img/symbols/bybit_wif.png",
        "bybit_virtual": "img/symbols/bybit_virtual.png",
        "bybit_uni": "img/symbols/bybit_uni.png",
        "bybit_trx": "img/symbols/bybit_trx.png",
        "bybit_trump": "img/symbols/bybit_trump.png",
        "bybit_towns": "img/symbols/bybit_towns.png",
        "bybit_ton": "img/symbols/bybit_ton.png",
        "bybit_tia": "img/symbols/bybit_tia.png",
        "bybit_swell": "img/symbols/bybit_swell.png",
        "bybit_sui": "img/symbols/bybit_sui.png",
        "bybit_stx": "img/symbols/bybit_stx.png",
        "bybit_strk": "img/symbols/bybit_strk.png",
        "bybit_spx": "img/symbols/bybit_spx.png",
        "bybit_sol": "img/symbols/bybit_sol.png",
        "bybit_shib": "img/symbols/bybit_shib.png",
        "bybit_sei": "img/symbols/bybit_sei.png",
        "bybit_sand": "img/symbols/bybit_sand.png",
        "bybit_s": "img/symbols/bybit_s.png",
        "bybit_render": "img/symbols/bybit_render.png",
        "bybit_pyth": "img/symbols/bybit_pyth.png",
        "bybit_pump": "img/symbols/bybit_pump.png",
        "bybit_pol": "img/symbols/bybit_pol.png",
        "bybit_pepe": "img/symbols/bybit_pepe.png",
        "bybit_ordi": "img/symbols/bybit_ordi.png",
        "bybit_op": "img/symbols/bybit_op.png",
        "bybit_ondo": "img/symbols/bybit_ondo.png",
        "bybit_not": "img/symbols/bybit_not.png",
        "bybit_near": "img/symbols/bybit_near.png",
        "bybit_move": "img/symbols/bybit_move.png",
        "bybit_mnt": "img/symbols/bybit_mnt.png",
        "bybit_mew": "img/symbols/bybit_mew.png",
        "bybit_met": "img/symbols/bybit_met.png",
        "bybit_mana": "img/symbols/bybit_mana.png",
        "bybit_lunc": "img/symbols/bybit_lunc.png",
        "bybit_ltc": "img/symbols/bybit_ltc.png",
        "bybit_link": "img/symbols/bybit_link.png",
        "bybit_ldo": "img/symbols/bybit_ldo.png",
        "bybit_kas": "img/symbols/bybit_kas.png",
        "bybit_jup": "img/symbols/bybit_jup.png",
        "bybit_jto": "img/symbols/bybit_jto.png",
        "bybit_jasmy": "img/symbols/bybit_jasmy.png",
        "bybit_inj": "img/symbols/bybit_inj.png",
        "bybit_icp": "img/symbols/bybit_icp.png",
        "bybit_icnt": "img/symbols/bybit_icnt.png",
        "bybit_hmstr": "img/symbols/bybit_hmstr.png",
        "bybit_hft": "img/symbols/bybit_hft.png",
        "bybit_hbar": "img/symbols/bybit_hbar.png",
        "bybit_h": "img/symbols/bybit_h.png",
        "bybit_gmt": "img/symbols/bybit_gmt.png",
        "bybit_floki": "img/symbols/bybit_floki.png",
        "bybit_fil": "img/symbols/bybit_fil.png",
        "bybit_fet": "img/symbols/bybit_fet.png",
        "bybit_eth": "img/symbols/bybit_eth.png",
        "bybit_ens": "img/symbols/bybit_ens.png",
        "bybit_ena": "img/symbols/bybit_ena.png",
        "bybit_eigen": "img/symbols/bybit_eigen.png",
        "bybit_dydx": "img/symbols/bybit_dydx.png",
        "bybit_dot": "img/symbols/bybit_dot.png",
        "bybit_dogs": "img/symbols/bybit_dogs.png",
        "bybit_doge": "img/symbols/bybit_doge.png",
        "bybit_crv": "img/symbols/bybit_crv.png",
        "bybit_chz": "img/symbols/bybit_chz.png",
        "bybit_cc": "img/symbols/bybit_cc.png",
        "bybit_cati": "img/symbols/bybit_cati.png",
        "bybit_btc": "img/symbols/bybit_btc.png",
        "bybit_brett": "img/symbols/bybit_brett.png",
        "bybit_bonk": "img/symbols/bybit_bonk.png",
        "bybit_bnb": "img/symbols/bybit_bnb.png",
        "bybit_bch": "img/symbols/bybit_bch.png",
        "bybit_bbsol": "img/symbols/bybit_bbsol.png",
        "bybit_avax": "img/symbols/bybit_avax.png",
        "bybit_atom": "img/symbols/bybit_atom.png",
        "bybit_arb": "img/symbols/bybit_arb.png",
        "bybit_ar": "img/symbols/bybit_ar.png",
        "bybit_apt": "img/symbols/bybit_apt.png",
        "bybit_apex": "img/symbols/bybit_apex.png",
        "bybit_ape": "img/symbols/bybit_ape.png",
        "bybit_algo": "img/symbols/bybit_algo.png",
        "bybit_aixbt": "img/symbols/bybit_aixbt.png",
        "bybit_ada": "img/symbols/bybit_ada.png",
        "bybit_aave": "img/symbols/bybit_aave.png",
        "bybit_2z": "img/symbols/bybit_2z.png",
        "binance_\u5E01\u5B89\u4EBA\u751F": "img/symbols/binance_\u5E01\u5B89\u4EBA\u751F.png",
        "binance_zro": "img/symbols/binance_zro.png",
        "binance_zkp": "img/symbols/binance_zkp.png",
        "binance_zkc": "img/symbols/binance_zkc.png",
        "binance_zk": "img/symbols/binance_zk.png",
        "binance_zen": "img/symbols/binance_zen.png",
        "binance_zec": "img/symbols/binance_zec.png",
        "binance_zbt": "img/symbols/binance_zbt.png",
        "binance_zama": "img/symbols/binance_zama.png",
        "binance_ygg": "img/symbols/binance_ygg.png",
        "binance_yb": "img/symbols/binance_yb.png",
        "binance_xvg": "img/symbols/binance_xvg.png",
        "binance_xtz": "img/symbols/binance_xtz.png",
        "binance_xrp": "img/symbols/binance_xrp.png",
        "binance_xpl": "img/symbols/binance_xpl.png",
        "binance_xlm": "img/symbols/binance_xlm.png",
        "binance_xai": "img/symbols/binance_xai.png",
        "binance_wlfi": "img/symbols/binance_wlfi.png",
        "binance_wld": "img/symbols/binance_wld.png",
        "binance_wif": "img/symbols/binance_wif.png",
        "binance_wct": "img/symbols/binance_wct.png",
        "binance_wal": "img/symbols/binance_wal.png",
        "binance_w": "img/symbols/binance_w.png",
        "binance_virtual": "img/symbols/binance_virtual.png",
        "binance_vet": "img/symbols/binance_vet.png",
        "binance_velodrome": "img/symbols/binance_velodrome.png",
        "binance_vanry": "img/symbols/binance_vanry.png",
        "binance_vana": "img/symbols/binance_vana.png",
        "binance_usual": "img/symbols/binance_usual.png",
        "binance_uni": "img/symbols/binance_uni.png",
        "binance_uma": "img/symbols/binance_uma.png",
        "binance_u": "img/symbols/binance_u.png",
        "binance_twt": "img/symbols/binance_twt.png",
        "binance_tut": "img/symbols/binance_tut.png",
        "binance_turtle": "img/symbols/binance_turtle.png",
        "binance_turbo": "img/symbols/binance_turbo.png",
        "binance_tst": "img/symbols/binance_tst.png",
        "binance_trx": "img/symbols/binance_trx.png",
        "binance_trump": "img/symbols/binance_trump.png",
        "binance_tree": "img/symbols/binance_tree.png",
        "binance_trb": "img/symbols/binance_trb.png",
        "binance_towns": "img/symbols/binance_towns.png",
        "binance_ton": "img/symbols/binance_ton.png",
        "binance_tnsr": "img/symbols/binance_tnsr.png",
        "binance_tlm": "img/symbols/binance_tlm.png",
        "binance_tia": "img/symbols/binance_tia.png",
        "binance_theta": "img/symbols/binance_theta.png",
        "binance_the": "img/symbols/binance_the.png",
        "binance_tao": "img/symbols/binance_tao.png",
        "binance_t": "img/symbols/binance_t.png",
        "binance_syrup": "img/symbols/binance_syrup.png",
        "binance_syn": "img/symbols/binance_syn.png",
        "binance_sxt": "img/symbols/binance_sxt.png",
        "binance_sushi": "img/symbols/binance_sushi.png",
        "binance_sui": "img/symbols/binance_sui.png",
        "binance_stx": "img/symbols/binance_stx.png",
        "binance_strk": "img/symbols/binance_strk.png",
        "binance_sto": "img/symbols/binance_sto.png",
        "binance_steem": "img/symbols/binance_steem.png",
        "binance_ssv": "img/symbols/binance_ssv.png",
        "binance_spk": "img/symbols/binance_spk.png",
        "binance_soph": "img/symbols/binance_soph.png",
        "binance_somi": "img/symbols/binance_somi.png",
        "binance_solv": "img/symbols/binance_solv.png",
        "binance_sol": "img/symbols/binance_sol.png",
        "binance_snx": "img/symbols/binance_snx.png",
        "binance_sky": "img/symbols/binance_sky.png",
        "binance_skl": "img/symbols/binance_skl.png",
        "binance_sign": "img/symbols/binance_sign.png",
        "binance_shib": "img/symbols/binance_shib.png",
        "binance_shell": "img/symbols/binance_shell.png",
        "binance_sent": "img/symbols/binance_sent.png",
        "binance_sei": "img/symbols/binance_sei.png",
        "binance_sapien": "img/symbols/binance_sapien.png",
        "binance_sand": "img/symbols/binance_sand.png",
        "binance_sahara": "img/symbols/binance_sahara.png",
        "binance_saga": "img/symbols/binance_saga.png",
        "binance_s": "img/symbols/binance_s.png",
        "binance_rvn": "img/symbols/binance_rvn.png",
        "binance_rune": "img/symbols/binance_rune.png",
        "binance_rsr": "img/symbols/binance_rsr.png",
        "binance_rpl": "img/symbols/binance_rpl.png",
        "binance_rose": "img/symbols/binance_rose.png",
        "binance_robo": "img/symbols/binance_robo.png",
        "binance_rez": "img/symbols/binance_rez.png",
        "binance_resolv": "img/symbols/binance_resolv.png",
        "binance_render": "img/symbols/binance_render.png",
        "binance_red": "img/symbols/binance_red.png",
        "binance_ray": "img/symbols/binance_ray.png",
        "binance_rare": "img/symbols/binance_rare.png",
        "binance_qnt": "img/symbols/binance_qnt.png",
        "binance_pyth": "img/symbols/binance_pyth.png",
        "binance_pump": "img/symbols/binance_pump.png",
        "binance_prove": "img/symbols/binance_prove.png",
        "binance_pol": "img/symbols/binance_pol.png",
        "binance_pnut": "img/symbols/binance_pnut.png",
        "binance_plume": "img/symbols/binance_plume.png",
        "binance_pixel": "img/symbols/binance_pixel.png",
        "binance_pha": "img/symbols/binance_pha.png",
        "binance_pepe": "img/symbols/binance_pepe.png",
        "binance_people": "img/symbols/binance_people.png",
        "binance_pengu": "img/symbols/binance_pengu.png",
        "binance_pendle": "img/symbols/binance_pendle.png",
        "binance_paxg": "img/symbols/binance_paxg.png",
        "binance_parti": "img/symbols/binance_parti.png",
        "binance_osmo": "img/symbols/binance_osmo.png",
        "binance_ordi": "img/symbols/binance_ordi.png",
        "binance_orca": "img/symbols/binance_orca.png",
        "binance_opn": "img/symbols/binance_opn.png",
        "binance_opg": "img/symbols/binance_opg.png",
        "binance_open": "img/symbols/binance_open.png",
        "binance_op": "img/symbols/binance_op.png",
        "binance_ont": "img/symbols/binance_ont.png",
        "binance_ondo": "img/symbols/binance_ondo.png",
        "binance_nxpc": "img/symbols/binance_nxpc.png",
        "binance_not": "img/symbols/binance_not.png",
        "binance_nom": "img/symbols/binance_nom.png",
        "binance_nmr": "img/symbols/binance_nmr.png",
        "binance_nil": "img/symbols/binance_nil.png",
        "binance_night": "img/symbols/binance_night.png",
        "binance_newt": "img/symbols/binance_newt.png",
        "binance_neo": "img/symbols/binance_neo.png",
        "binance_neiro": "img/symbols/binance_neiro.png",
        "binance_near": "img/symbols/binance_near.png",
        "binance_mubarak": "img/symbols/binance_mubarak.png",
        "binance_move": "img/symbols/binance_move.png",
        "binance_morpho": "img/symbols/binance_morpho.png",
        "binance_mmt": "img/symbols/binance_mmt.png",
        "binance_mito": "img/symbols/binance_mito.png",
        "binance_mira": "img/symbols/binance_mira.png",
        "binance_mina": "img/symbols/binance_mina.png",
        "binance_met": "img/symbols/binance_met.png",
        "binance_meme": "img/symbols/binance_meme.png",
        "binance_mega": "img/symbols/binance_mega.png",
        "binance_me": "img/symbols/binance_me.png",
        "binance_mask": "img/symbols/binance_mask.png",
        "binance_mantra": "img/symbols/binance_mantra.png",
        "binance_manta": "img/symbols/binance_manta.png",
        "binance_magic": "img/symbols/binance_magic.png",
        "binance_lunc": "img/symbols/binance_lunc.png",
        "binance_luna": "img/symbols/binance_luna.png",
        "binance_ltc": "img/symbols/binance_ltc.png",
        "binance_lpt": "img/symbols/binance_lpt.png",
        "binance_lista": "img/symbols/binance_lista.png",
        "binance_link": "img/symbols/binance_link.png",
        "binance_linea": "img/symbols/binance_linea.png",
        "binance_ldo": "img/symbols/binance_ldo.png",
        "binance_layer": "img/symbols/binance_layer.png",
        "binance_la": "img/symbols/binance_la.png",
        "binance_kmno": "img/symbols/binance_kmno.png",
        "binance_kite": "img/symbols/binance_kite.png",
        "binance_kernel": "img/symbols/binance_kernel.png",
        "binance_kat": "img/symbols/binance_kat.png",
        "binance_kaito": "img/symbols/binance_kaito.png",
        "binance_kaia": "img/symbols/binance_kaia.png",
        "binance_jup": "img/symbols/binance_jup.png",
        "binance_jto": "img/symbols/binance_jto.png",
        "binance_iota": "img/symbols/binance_iota.png",
        "binance_io": "img/symbols/binance_io.png",
        "binance_inj": "img/symbols/binance_inj.png",
        "binance_init": "img/symbols/binance_init.png",
        "binance_imx": "img/symbols/binance_imx.png",
        "binance_ilv": "img/symbols/binance_ilv.png",
        "binance_icp": "img/symbols/binance_icp.png",
        "binance_hyper": "img/symbols/binance_hyper.png",
        "binance_huma": "img/symbols/binance_huma.png",
        "binance_home": "img/symbols/binance_home.png",
        "binance_holo": "img/symbols/binance_holo.png",
        "binance_hmstr": "img/symbols/binance_hmstr.png",
        "binance_hive": "img/symbols/binance_hive.png",
        "binance_hemi": "img/symbols/binance_hemi.png",
        "binance_hei": "img/symbols/binance_hei.png",
        "binance_hbar": "img/symbols/binance_hbar.png",
        "binance_haedal": "img/symbols/binance_haedal.png",
        "binance_gun": "img/symbols/binance_gun.png",
        "binance_grt": "img/symbols/binance_grt.png",
        "binance_gps": "img/symbols/binance_gps.png",
        "binance_gmx": "img/symbols/binance_gmx.png",
        "binance_gmt": "img/symbols/binance_gmt.png",
        "binance_giggle": "img/symbols/binance_giggle.png",
        "binance_genius": "img/symbols/binance_genius.png",
        "binance_gala": "img/symbols/binance_gala.png",
        "binance_form": "img/symbols/binance_form.png",
        "binance_fogo": "img/symbols/binance_fogo.png",
        "binance_flux": "img/symbols/binance_flux.png",
        "binance_floki": "img/symbols/binance_floki.png",
        "binance_fil": "img/symbols/binance_fil.png",
        "binance_ff": "img/symbols/binance_ff.png",
        "binance_fet": "img/symbols/binance_fet.png",
        "binance_f": "img/symbols/binance_f.png",
        "binance_eul": "img/symbols/binance_eul.png",
        "binance_ethfi": "img/symbols/binance_ethfi.png",
        "binance_eth": "img/symbols/binance_eth.png",
        "binance_etc": "img/symbols/binance_etc.png",
        "binance_esp": "img/symbols/binance_esp.png",
        "binance_era": "img/symbols/binance_era.png",
        "binance_epic": "img/symbols/binance_epic.png",
        "binance_enso": "img/symbols/binance_enso.png",
        "binance_ens": "img/symbols/binance_ens.png",
        "binance_enj": "img/symbols/binance_enj.png",
        "binance_ena": "img/symbols/binance_ena.png",
        "binance_eigen": "img/symbols/binance_eigen.png",
        "binance_egld": "img/symbols/binance_egld.png",
        "binance_eden": "img/symbols/binance_eden.png",
        "binance_dym": "img/symbols/binance_dym.png",
        "binance_dydx": "img/symbols/binance_dydx.png",
        "binance_dot": "img/symbols/binance_dot.png",
        "binance_dolo": "img/symbols/binance_dolo.png",
        "binance_dogs": "img/symbols/binance_dogs.png",
        "binance_doge": "img/symbols/binance_doge.png",
        "binance_dash": "img/symbols/binance_dash.png",
        "binance_cyber": "img/symbols/binance_cyber.png",
        "binance_cvx": "img/symbols/binance_cvx.png",
        "binance_cvc": "img/symbols/binance_cvc.png",
        "binance_crv": "img/symbols/binance_crv.png",
        "binance_cow": "img/symbols/binance_cow.png",
        "binance_coti": "img/symbols/binance_coti.png",
        "binance_cookie": "img/symbols/binance_cookie.png",
        "binance_comp": "img/symbols/binance_comp.png",
        "binance_ckb": "img/symbols/binance_ckb.png",
        "binance_chz": "img/symbols/binance_chz.png",
        "binance_chip": "img/symbols/binance_chip.png",
        "binance_cgpt": "img/symbols/binance_cgpt.png",
        "binance_cfx": "img/symbols/binance_cfx.png",
        "binance_cfg": "img/symbols/binance_cfg.png",
        "binance_cetus": "img/symbols/binance_cetus.png",
        "binance_cati": "img/symbols/binance_cati.png",
        "binance_cake": "img/symbols/binance_cake.png",
        "binance_c": "img/symbols/binance_c.png",
        "binance_btc": "img/symbols/binance_btc.png",
        "binance_broccoli714": "img/symbols/binance_broccoli714.png",
        "binance_brev": "img/symbols/binance_brev.png",
        "binance_bonk": "img/symbols/binance_bonk.png",
        "binance_bome": "img/symbols/binance_bome.png",
        "binance_bnb": "img/symbols/binance_bnb.png",
        "binance_bmt": "img/symbols/binance_bmt.png",
        "binance_blur": "img/symbols/binance_blur.png",
        "binance_bio": "img/symbols/binance_bio.png",
        "binance_bigtime": "img/symbols/binance_bigtime.png",
        "binance_bera": "img/symbols/binance_bera.png",
        "binance_beamx": "img/symbols/binance_beamx.png",
        "binance_bch": "img/symbols/binance_bch.png",
        "binance_bb": "img/symbols/binance_bb.png",
        "binance_bard": "img/symbols/binance_bard.png",
        "binance_bank": "img/symbols/binance_bank.png",
        "binance_bananas31": "img/symbols/binance_bananas31.png",
        "binance_banana": "img/symbols/binance_banana.png",
        "binance_baby": "img/symbols/binance_baby.png",
        "binance_axs": "img/symbols/binance_axs.png",
        "binance_avnt": "img/symbols/binance_avnt.png",
        "binance_avax": "img/symbols/binance_avax.png",
        "binance_auction": "img/symbols/binance_auction.png",
        "binance_atom": "img/symbols/binance_atom.png",
        "binance_at": "img/symbols/binance_at.png",
        "binance_aster": "img/symbols/binance_aster.png",
        "binance_arkm": "img/symbols/binance_arkm.png",
        "binance_arb": "img/symbols/binance_arb.png",
        "binance_ar": "img/symbols/binance_ar.png",
        "binance_apt": "img/symbols/binance_apt.png",
        "binance_api3": "img/symbols/binance_api3.png",
        "binance_ape": "img/symbols/binance_ape.png",
        "binance_anime": "img/symbols/binance_anime.png",
        "binance_alt": "img/symbols/binance_alt.png",
        "binance_allo": "img/symbols/binance_allo.png",
        "binance_algo": "img/symbols/binance_algo.png",
        "binance_aixbt": "img/symbols/binance_aixbt.png",
        "binance_aigensyn": "img/symbols/binance_aigensyn.png",
        "binance_aevo": "img/symbols/binance_aevo.png",
        "binance_ada": "img/symbols/binance_ada.png",
        "binance_acx": "img/symbols/binance_acx.png",
        "binance_act": "img/symbols/binance_act.png",
        "binance_ach": "img/symbols/binance_ach.png",
        "binance_aave": "img/symbols/binance_aave.png",
        "binance_a": "img/symbols/binance_a.png",
        "binance_2z": "img/symbols/binance_2z.png",
        "binance_1mbabydoge": "img/symbols/binance_1mbabydoge.png",
        "binance_1inch": "img/symbols/binance_1inch.png",
        "binance_1000sats": "img/symbols/binance_1000sats.png",
        "binance_1000cheems": "img/symbols/binance_1000cheems.png",
        "binance_1000cat": "img/symbols/binance_1000cat.png",
        "binance_0g": "img/symbols/binance_0g.png",
        "generic-fallback": "img/symbols/generic-fallback.png"
      };
    }
  });

  // ts_libs/ts_client/views/ScreenerSectionView.ts
  var _root4, _screenerGrid, _allData, _currentPage, _pageSize, _loadMoreBtn, _cards, _footer3, _syncAction, _sortAction, _filterAction, ScreenerSectionView;
  var init_ScreenerSectionView = __esm({
    "ts_libs/ts_client/views/ScreenerSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      init_ActionIconsRegistry();
      init_SymbolIconsRegistry();
      ScreenerSectionView = class {
        constructor() {
          __privateAdd(this, _root4);
          __privateAdd(this, _screenerGrid);
          __privateAdd(this, _allData, []);
          __privateAdd(this, _currentPage, 1);
          __privateAdd(this, _pageSize, 30);
          __privateAdd(this, _loadMoreBtn);
          __privateAdd(this, _cards, []);
          __privateAdd(this, _footer3);
          //actions
          __privateAdd(this, _syncAction);
          __privateAdd(this, _sortAction);
          __privateAdd(this, _filterAction);
          this.title = "Screener";
          this.id = "screener";
          __privateSet(this, _root4, ViewHelper.getHtmlElementOrThrow(this.id));
          __privateSet(this, _screenerGrid, ViewHelper.getHtmlElementOrThrow("screener-grid"));
          __privateSet(this, _loadMoreBtn, ViewHelper.getButtonOrThrow("screener-load-more"));
          __privateSet(this, _footer3, ViewHelper.getHtmlElementOrThrow("footer-screener"));
          __privateGet(this, _loadMoreBtn).onclick = () => this.loadNextPage();
          __privateSet(this, _syncAction, ViewHelper.getButtonOrThrow("nav-footer-sync"));
          __privateSet(this, _sortAction, ViewHelper.getButtonOrThrow("nav-footer-sort"));
          __privateSet(this, _filterAction, ViewHelper.getButtonOrThrow("nav-footer-filter"));
          __privateGet(this, _sortAction).onclick = () => console.log(`Sort action clicked`);
          __privateGet(this, _syncAction).onclick = () => console.log(`Sync action clicked`);
          __privateGet(this, _filterAction).onclick = () => console.log(`Filter action clicked`);
        }
        hasExternalActions() {
          return true;
        }
        loadNextPage() {
          const totalPages = Math.ceil(__privateGet(this, _allData).length / __privateGet(this, _pageSize));
          if (__privateGet(this, _currentPage) < totalPages) {
            __privateWrapper(this, _currentPage)._++;
            this.renderCards();
          }
        }
        renderCards() {
          __privateGet(this, _cards).forEach((el) => el.remove());
          __privateSet(this, _cards, []);
          const start = 0;
          const end = __privateGet(this, _currentPage) * __privateGet(this, _pageSize);
          const pageData = __privateGet(this, _allData).slice(start, end);
          pageData.forEach((tp, index) => {
            const card = document.createElement("div");
            card.className = "screener-card";
            card.appendChild(this.generateCardInner(tp));
            __privateGet(this, _cards).push(card);
            __privateGet(this, _screenerGrid).appendChild(card);
          });
          if (end >= __privateGet(this, _allData).length) {
            ViewHelper.toggleVisibility(__privateGet(this, _loadMoreBtn), false);
          } else {
            ViewHelper.toggleVisibility(__privateGet(this, _loadMoreBtn), true);
          }
        }
        generateCardInner(tp) {
          const wrapper = document.createElement("div");
          const description = document.createElement("div");
          description.className = "asset-pair-description";
          const imagesHolder = document.createElement("div");
          imagesHolder.className = "asset-and-exchange-images-holder";
          const assetIconUrl = getSymbolImageUrlById(tp.exchangeName + "_" + tp.baseAsset);
          const assetImg = document.createElement("img");
          assetImg.className = "asset-image";
          assetImg.src = assetIconUrl;
          assetImg.alt = tp.baseAsset;
          assetImg.loading = "lazy";
          const exchangeImg = document.createElement("img");
          exchangeImg.className = "exchange-image";
          exchangeImg.src = `img/exchanges/${tp.exchangeName}.svg`;
          exchangeImg.alt = tp.exchangeName;
          imagesHolder.appendChild(assetImg);
          imagesHolder.appendChild(exchangeImg);
          const textContainer = document.createElement("div");
          const title = document.createElement("h3");
          title.className = "asset-pair-title";
          title.textContent = `${tp.baseAsset}/${tp.quoteAsset}`;
          const subtitle = document.createElement("p");
          subtitle.className = "asset-pair-subtitle";
          subtitle.textContent = tp.exchangeName;
          textContainer.appendChild(title);
          textContainer.appendChild(subtitle);
          const button = document.createElement("button");
          button.className = "btn btn--square btn--icon";
          button.type = "button";
          button.addEventListener("click", () => {
            window.open(tp.exchangeUrl, "_blank", "noopener,noreferrer");
          });
          const btnSvg = getActionIconSVGElement("arrow-right");
          btnSvg.classList.add("icon");
          btnSvg.setAttribute("role", "img");
          button.appendChild(btnSvg);
          description.appendChild(imagesHolder);
          description.appendChild(textContainer);
          description.appendChild(button);
          const attributesContainer = document.createElement("div");
          attributesContainer.className = "asset-attributes";
          tp.getNumericAttributes().forEach((attr) => {
            var _a, _b, _c, _d, _e;
            const row = document.createElement("div");
            row.className = "screener-card-row";
            const label = document.createElement("span");
            label.textContent = (_b = (_a = attr.metadata) == null ? void 0 : _a.label) != null ? _b : "";
            const value = document.createElement("span");
            const key = (_c = attr.metadata) == null ? void 0 : _c.key;
            value.textContent = key ? (_e = (_d = tp.getAttr(key)) == null ? void 0 : _d.toString()) != null ? _e : "-" : "-";
            row.appendChild(label);
            row.appendChild(value);
            attributesContainer.appendChild(row);
          });
          wrapper.appendChild(description);
          wrapper.appendChild(attributesContainer);
          return wrapper;
        }
        setData(data) {
          __privateSet(this, _allData, data);
          __privateSet(this, _currentPage, 1);
          this.renderCards();
          requestAnimationFrame(() => {
            __privateGet(this, _screenerGrid).scrollTo(0, 0);
          });
        }
        show() {
          ViewHelper.toggleVisibility(__privateGet(this, _root4), true);
          ViewHelper.toggleVisibility(__privateGet(this, _footer3), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root4), false);
          ViewHelper.toggleVisibility(__privateGet(this, _footer3), false);
        }
        /**
        * Bind a callback to the sort button
        */
        bindSortButton(callback) {
          __privateGet(this, _sortAction).onclick = callback;
        }
        /**
        * Bind a callback to the sync button
        */
        bindSyncButton(callback) {
          __privateGet(this, _syncAction).onclick = callback;
        }
        /**
        * Bind a callback to the filter button
        */
        bindFilterButton(callback) {
          __privateGet(this, _filterAction).onclick = callback;
        }
      };
      _root4 = new WeakMap();
      _screenerGrid = new WeakMap();
      _allData = new WeakMap();
      _currentPage = new WeakMap();
      _pageSize = new WeakMap();
      _loadMoreBtn = new WeakMap();
      _cards = new WeakMap();
      _footer3 = new WeakMap();
      _syncAction = new WeakMap();
      _sortAction = new WeakMap();
      _filterAction = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/SettingsModalView.ts
  var _root5, _dismiss2, _apply2, _cancel2, _parallelRequestsCount, _maxPairsCount, _exchangeInclusions, _settings, _includeExchangesArea, _onSettingsChanged, SettingsModalView;
  var init_SettingsModalView = __esm({
    "ts_libs/ts_client/views/SettingsModalView.ts"() {
      "use strict";
      init_ViewHelper();
      SettingsModalView = class {
        constructor() {
          __privateAdd(this, _root5);
          __privateAdd(this, _dismiss2);
          __privateAdd(this, _apply2);
          __privateAdd(this, _cancel2);
          __privateAdd(this, _parallelRequestsCount);
          __privateAdd(this, _maxPairsCount);
          __privateAdd(this, _exchangeInclusions);
          __privateAdd(this, _settings);
          __privateAdd(this, _includeExchangesArea);
          __privateAdd(this, _onSettingsChanged, null);
          __privateSet(this, _root5, ViewHelper.getHtmlElementOrThrow("settings-modal"));
          __privateSet(this, _dismiss2, ViewHelper.getButtonOrThrow("settings-modal-close"));
          __privateSet(this, _apply2, ViewHelper.getButtonOrThrow("settings-modal-apply"));
          __privateSet(this, _cancel2, ViewHelper.getButtonOrThrow("settings-modal-cancel"));
          __privateSet(this, _parallelRequestsCount, ViewHelper.getHtmlInputElementOrThrow("settings-parallel-requests-count"));
          __privateSet(this, _maxPairsCount, ViewHelper.getHtmlInputElementOrThrow("settings-maximum-pairs-count"));
          __privateSet(this, _includeExchangesArea, ViewHelper.getHtmlElementOrThrow("settings-include-exchanges"));
          __privateSet(this, _exchangeInclusions, null);
          __privateGet(this, _dismiss2).onclick = () => this.hide();
          __privateGet(this, _cancel2).onclick = () => this.hide();
          __privateGet(this, _apply2).onclick = () => {
            var _a;
            const settingsFromView = this.tryGetUpdatedSettingsFromView();
            if (settingsFromView) {
              (_a = __privateGet(this, _onSettingsChanged)) == null ? void 0 : _a.call(this, settingsFromView);
            }
            this.hide();
          };
        }
        tryGetUpdatedSettingsFromView() {
          if (!__privateGet(this, _settings)) {
            throw new Error("Screener settings are undefined");
          }
          const updated = __privateGet(this, _settings).deepClone();
          updated.maximumPairsCountPerExchange = this.tryGetMaxPairsCount();
          updated.parallelRequestsCount = this.tryGetParallelRequestCount();
          const selectedExchanges = new Set(this.tryGetSelectedExchanges());
          updated.exchangeInclusionCriterias.forEach((criteria) => {
            criteria.include = selectedExchanges.has(criteria.name);
          });
          if (updated.deepEquals(__privateGet(this, _settings))) {
            return void 0;
          }
          return updated;
        }
        tryGetMaxPairsCount() {
          const maxPairsCount = Number.parseInt(__privateGet(this, _maxPairsCount).value);
          return maxPairsCount;
        }
        tryGetParallelRequestCount() {
          const parallelRequestsCount = Number.parseInt(__privateGet(this, _parallelRequestsCount).value);
          return parallelRequestsCount;
        }
        tryGetSelectedExchanges() {
          if (!__privateGet(this, _exchangeInclusions)) {
            throw new Error(`exchangeInclusions is not defined`);
          }
          let names = [];
          __privateGet(this, _exchangeInclusions).forEach((elem) => {
            if (true === elem.checked) {
              const name = elem.getAttribute("data-exchange-name");
              if (name !== null) {
                names.push(name);
              }
            }
          });
          return names;
        }
        bindSettingsChanged(callback) {
          __privateSet(this, _onSettingsChanged, callback);
        }
        show() {
          ViewHelper.setModalState(true);
          ViewHelper.toggleVisibility(__privateGet(this, _root5), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root5), false);
          ViewHelper.setModalState(false);
        }
        update(model) {
          __privateSet(this, _settings, model.getScreenerSettingsOrThrow().deepClone());
          __privateGet(this, _parallelRequestsCount).value = __privateGet(this, _settings).parallelRequestsCount.toString();
          __privateGet(this, _maxPairsCount).value = __privateGet(this, _settings).maximumPairsCountPerExchange.toString();
          __privateGet(this, _includeExchangesArea).innerHTML = "";
          __privateSet(this, _exchangeInclusions, []);
          __privateGet(this, _settings).exchangeInclusionCriterias.forEach((criteria) => {
            var _a;
            var cb = document.createElement("input");
            cb.setAttribute("type", "checkbox");
            cb.setAttribute("data-exchange-name", criteria.name);
            cb.checked = criteria.include;
            var slider = document.createElement("span");
            slider.classList.add("checkbox-slider");
            var text = document.createElement("span");
            text.classList.add("checkbox-text");
            text.textContent = criteria.name;
            var label = document.createElement("label");
            label.classList.add("checkbox-label");
            label.appendChild(cb);
            label.appendChild(slider);
            label.appendChild(text);
            __privateGet(this, _includeExchangesArea).appendChild(label);
            (_a = __privateGet(this, _exchangeInclusions)) == null ? void 0 : _a.push(cb);
          });
        }
      };
      _root5 = new WeakMap();
      _dismiss2 = new WeakMap();
      _apply2 = new WeakMap();
      _cancel2 = new WeakMap();
      _parallelRequestsCount = new WeakMap();
      _maxPairsCount = new WeakMap();
      _exchangeInclusions = new WeakMap();
      _settings = new WeakMap();
      _includeExchangesArea = new WeakMap();
      _onSettingsChanged = new WeakMap();
    }
  });

  // ts_libs/ts_worker/application/exports/SignalModel.ts
  var SignalModel;
  var init_SignalModel = __esm({
    "ts_libs/ts_worker/application/exports/SignalModel.ts"() {
      "use strict";
      SignalModel = class _SignalModel {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, exchangeUrl, description, direction, timestamp) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.exchangeUrl = exchangeUrl;
          this.description = description;
          this.direction = direction;
          this.timestamp = timestamp;
        }
        serialize() {
          return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeId: this.exchangeId,
            exchangeName: this.exchangeName,
            exchangeUrl: this.exchangeUrl,
            description: this.description,
            direction: this.direction,
            timestamp: this.timestamp
          };
        }
        static deserialize(dto) {
          return new _SignalModel(
            dto.baseAsset,
            dto.quoteAsset,
            dto.exchangeName,
            dto.exchangeId,
            dto.exchangeUrl,
            dto.description,
            dto.direction,
            dto.timestamp
          );
        }
      };
    }
  });

  // ts_libs/ts_client/views/SignalsSectionView.ts
  var _root6, _footer4, _signalsGrid, _loadMoreBtn2, _cards2, _currentPage2, _pageSize2, _signals, _syncAction2, _autoSyncAction, _autoSyncEnabled, _autoSyncTimer, _latestSignalTs, _notificationAudio, _wakeLockSentinel, SignalSectionView;
  var init_SignalsSectionView = __esm({
    "ts_libs/ts_client/views/SignalsSectionView.ts"() {
      "use strict";
      init_SignalModel();
      init_ActionIconsRegistry();
      init_ViewHelper();
      SignalSectionView = class {
        constructor() {
          __privateAdd(this, _root6);
          __privateAdd(this, _footer4);
          __privateAdd(this, _signalsGrid);
          __privateAdd(this, _loadMoreBtn2);
          __privateAdd(this, _cards2, []);
          __privateAdd(this, _currentPage2, 1);
          __privateAdd(this, _pageSize2, 30);
          __privateAdd(this, _signals);
          __privateAdd(this, _syncAction2);
          __privateAdd(this, _autoSyncAction);
          __privateAdd(this, _autoSyncEnabled);
          __privateAdd(this, _autoSyncTimer);
          __privateAdd(this, _latestSignalTs);
          __privateAdd(this, _notificationAudio);
          __privateAdd(this, _wakeLockSentinel);
          this.id = "signals";
          this.title = "Signals";
          __privateSet(this, _root6, ViewHelper.getHtmlElementOrThrow("signals"));
          __privateSet(this, _footer4, ViewHelper.getHtmlElementOrThrow("footer-signals"));
          __privateSet(this, _signalsGrid, ViewHelper.getHtmlElementOrThrow("signals-grid"));
          __privateSet(this, _loadMoreBtn2, ViewHelper.getButtonOrThrow("signals-load-more"));
          __privateGet(this, _loadMoreBtn2).onclick = () => this.loadNextPage();
          __privateSet(this, _signals, []);
          __privateSet(this, _syncAction2, ViewHelper.getButtonOrThrow("footer-signals-button-sync-manually"));
          __privateGet(this, _syncAction2).onclick = () => console.log(`Sync action clicked`);
          __privateSet(this, _autoSyncEnabled, false);
          __privateSet(this, _autoSyncAction, ViewHelper.getButtonOrThrow("footer-signals-button-sync-automatically"));
          __privateGet(this, _autoSyncAction).onclick = () => this.toggleAutoSync();
          __privateSet(this, _autoSyncTimer, void 0);
          __privateSet(this, _notificationAudio, new Audio("https://dn711000.ca.archive.org/0/items/android-4.1.2-stock-ringtones/ringtones/Seville.mp3"));
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible" && __privateGet(this, _autoSyncEnabled)) {
              void this.acquireWakeLock();
            }
          });
        }
        onTimerCallback() {
          console.log(`${this.onTimerCallback.name} ${__privateGet(this, _autoSyncEnabled)}`);
          if (__privateGet(this, _autoSyncEnabled) === false) {
            return;
          }
          __privateGet(this, _syncAction2).click();
        }
        toggleAutoSync() {
          __privateSet(this, _autoSyncEnabled, !__privateGet(this, _autoSyncEnabled));
          this.onAutosyncToggled();
        }
        onAutosyncToggled() {
          if (__privateGet(this, _autoSyncEnabled)) {
            __privateGet(this, _autoSyncAction).classList.add("btn--primary");
            __privateGet(this, _syncAction2).classList.add("d-hidden");
            this.onTimerCallback();
            __privateSet(this, _autoSyncTimer, window.setInterval(
              () => {
                this.onTimerCallback();
              },
              6e4
            ));
            this.acquireWakeLock();
          } else {
            __privateGet(this, _autoSyncAction).classList.remove("btn--primary");
            __privateGet(this, _syncAction2).classList.remove("d-hidden");
            if (__privateGet(this, _autoSyncTimer) !== void 0) {
              window.clearInterval(__privateGet(this, _autoSyncTimer));
              __privateSet(this, _autoSyncTimer, void 0);
            }
            this.releaseWakeLock();
          }
        }
        /**
        * Bind a callback to the sync button
        */
        bindSyncButton(callback) {
          __privateGet(this, _syncAction2).onclick = callback;
        }
        loadNextPage() {
          __privateWrapper(this, _currentPage2)._++;
          this.renderCards();
        }
        hasExternalActions() {
          return true;
        }
        setData(signals) {
          this.checkNewDataArrived(signals);
          __privateSet(this, _signals, signals);
          __privateSet(this, _currentPage2, 1);
          this.renderCards();
        }
        renderCards() {
          __privateGet(this, _cards2).forEach((el) => el.remove());
          __privateSet(this, _cards2, []);
          const end = __privateGet(this, _currentPage2) * __privateGet(this, _pageSize2);
          const pageData = __privateGet(this, _signals).slice(-end).reverse();
          pageData.forEach((signalModel, index) => {
            const card = document.createElement("div");
            card.className = "signal-card";
            card.classList.add(this.getDirectionClass(signalModel.direction));
            card.appendChild(this.generateCardInner(signalModel));
            __privateGet(this, _cards2).push(card);
            __privateGet(this, _signalsGrid).appendChild(card);
          });
          ViewHelper.toggleVisibility(
            __privateGet(this, _loadMoreBtn2),
            end < __privateGet(this, _signals).length
          );
        }
        generateCardInner(signalModel) {
          const inner = document.createElement("div");
          inner.classList.add("signal-card__inner");
          const header = document.createElement("div");
          header.classList.add("signal-card__header");
          const headerTextContents = document.createElement("div");
          headerTextContents.classList.add("signal-card__header__texts");
          const title = document.createElement("h3");
          title.classList.add("signal-card__title");
          title.textContent = `${signalModel.baseAsset}/${signalModel.quoteAsset}`;
          const subtitle = document.createElement("p");
          subtitle.classList.add("signal-card__subtitle");
          subtitle.textContent = signalModel.exchangeName;
          headerTextContents.appendChild(title);
          headerTextContents.appendChild(subtitle);
          const button = document.createElement("button");
          button.className = "btn btn--icon";
          button.type = "button";
          button.addEventListener("click", () => {
            window.open(signalModel.exchangeUrl, "_blank", "noopener,noreferrer");
          });
          const btnText = document.createElement("span");
          btnText.className = "signal-card__action-text";
          btnText.textContent = signalModel.direction;
          const btnSvg = getActionIconSVGElement("arrow-right");
          btnSvg.classList.add("icon");
          btnSvg.setAttribute("role", "img");
          button.appendChild(btnText);
          button.appendChild(btnSvg);
          header.appendChild(headerTextContents);
          header.appendChild(button);
          const description = document.createElement("div");
          description.classList.add("signal-card__description");
          description.textContent = signalModel.description;
          const footer = document.createElement("div");
          footer.classList.add("signal-card__footer");
          const time = document.createElement("span");
          time.classList.add("signal-card__time");
          time.textContent = this.formatTime(signalModel.timestamp);
          footer.appendChild(time);
          inner.appendChild(header);
          inner.appendChild(description);
          inner.appendChild(footer);
          return inner;
        }
        formatTime(timestamp) {
          return new Date(timestamp).toLocaleString([], {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
        }
        getDirectionClass(direction) {
          switch (direction) {
            case "BULLISH" /* BULLISH */:
              return "signal-card--bullish";
            case "BEARISH" /* BEARISH */:
              return "signal-card--bearish";
            case "NEUTRAL" /* NEUTRAL */:
              return "signal-card--neutral";
          }
        }
        show() {
          ViewHelper.toggleVisibility(__privateGet(this, _root6), true);
          ViewHelper.toggleVisibility(__privateGet(this, _footer4), true);
          __privateSet(this, _autoSyncEnabled, false);
          this.onAutosyncToggled();
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root6), false);
          ViewHelper.toggleVisibility(__privateGet(this, _footer4), false);
          __privateSet(this, _autoSyncEnabled, false);
          this.onAutosyncToggled();
        }
        checkNewDataArrived(signals) {
          if (signals.length === 0) {
            return;
          }
          const latest = signals[signals.length - 1];
          if (__privateGet(this, _latestSignalTs) !== latest.timestamp) {
            __privateSet(this, _latestSignalTs, latest.timestamp);
            if (__privateGet(this, _autoSyncEnabled)) {
              this.playNotificationSound();
            }
          }
        }
        playNotificationSound() {
          __privateGet(this, _notificationAudio).play();
        }
        isInstalled() {
          return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
        }
        acquireWakeLock() {
          return __async(this, null, function* () {
            if (!this.isInstalled()) {
              return;
            }
            if (!("wakeLock" in navigator)) {
              return;
            }
            if (__privateGet(this, _wakeLockSentinel) !== void 0) {
              return;
            }
            try {
              __privateSet(this, _wakeLockSentinel, yield navigator.wakeLock.request("screen"));
              __privateGet(this, _wakeLockSentinel).addEventListener("release", () => {
                __privateSet(this, _wakeLockSentinel, void 0);
                if (__privateGet(this, _autoSyncEnabled) && document.visibilityState === "visible") {
                  void this.acquireWakeLock();
                }
              });
            } catch (e) {
              console.warn(e);
            }
          });
        }
        releaseWakeLock() {
          return __async(this, null, function* () {
            if (!__privateGet(this, _wakeLockSentinel)) {
              return;
            }
            try {
              yield __privateGet(this, _wakeLockSentinel).release();
            } finally {
              __privateSet(this, _wakeLockSentinel, void 0);
            }
          });
        }
      };
      _root6 = new WeakMap();
      _footer4 = new WeakMap();
      _signalsGrid = new WeakMap();
      _loadMoreBtn2 = new WeakMap();
      _cards2 = new WeakMap();
      _currentPage2 = new WeakMap();
      _pageSize2 = new WeakMap();
      _signals = new WeakMap();
      _syncAction2 = new WeakMap();
      _autoSyncAction = new WeakMap();
      _autoSyncEnabled = new WeakMap();
      _autoSyncTimer = new WeakMap();
      _latestSignalTs = new WeakMap();
      _notificationAudio = new WeakMap();
      _wakeLockSentinel = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/SortModalView.ts
  var _root7, _dismiss3, _ascending, _descending, _apply3, _fields2, _transientDirection, _transientSortKey, _sortByButtons, _onSortingRulesChanged, SortModalView;
  var init_SortModalView = __esm({
    "ts_libs/ts_client/views/SortModalView.ts"() {
      "use strict";
      init_ViewHelper();
      init_SortDirection();
      SortModalView = class {
        constructor() {
          __privateAdd(this, _root7);
          __privateAdd(this, _dismiss3);
          __privateAdd(this, _ascending);
          __privateAdd(this, _descending);
          __privateAdd(this, _apply3);
          __privateAdd(this, _fields2);
          __privateAdd(this, _transientDirection, null);
          __privateAdd(this, _transientSortKey, null);
          __privateAdd(this, _sortByButtons, null);
          __privateAdd(this, _onSortingRulesChanged);
          __privateSet(this, _root7, ViewHelper.getHtmlElementOrThrow("sort-fields-modal"));
          __privateSet(this, _dismiss3, ViewHelper.getButtonOrThrow("sort-fields-modal-close"));
          __privateSet(this, _apply3, ViewHelper.getButtonOrThrow("sort-fields-modal-apply"));
          __privateSet(this, _ascending, ViewHelper.getButtonOrThrow("sort-fields-modal-ascending"));
          __privateSet(this, _descending, ViewHelper.getButtonOrThrow("sort-fields-modal-descending"));
          __privateSet(this, _fields2, ViewHelper.getHtmlElementOrThrow("sort-fields-modal-body"));
          __privateGet(this, _ascending).onclick = () => {
            __privateGet(this, _descending).classList.remove("active");
            __privateGet(this, _ascending).classList.add("active");
          };
          __privateGet(this, _descending).onclick = () => {
            __privateGet(this, _ascending).classList.remove("active");
            __privateGet(this, _descending).classList.add("active");
          };
          __privateGet(this, _dismiss3).onclick = () => this.hide();
          __privateGet(this, _apply3).onclick = () => {
            if (this.isAnySortingRuleChanged()) {
              const direction = this.getSortDirectionFromView();
              const sortKey = this.getSortKeyFromView();
              __privateGet(this, _onSortingRulesChanged).call(this, direction, sortKey);
            }
            this.hide();
          };
          __privateSet(this, _onSortingRulesChanged, (direction, sortKey) => console.log(`Sorting rules changed: ${direction}, ${sortKey}.`));
        }
        bindSortingRulesChanged(callback) {
          __privateSet(this, _onSortingRulesChanged, callback);
        }
        isAnySortingRuleChanged() {
          return !(__privateGet(this, _transientDirection) === this.getSortDirectionFromView() && __privateGet(this, _transientSortKey) === this.getSortKeyFromView());
        }
        update(model) {
          this.updateSortDirection(model);
          this.generateSortSelectionElements(model);
        }
        updateSortDirection(model) {
          __privateSet(this, _transientDirection, model.getSortDirection());
          __privateGet(this, _ascending).classList.remove("active");
          __privateGet(this, _descending).classList.remove("active");
          if (model.getSortDirection() === 0 /* Ascending */) {
            __privateGet(this, _ascending).classList.add("active");
          }
          if (model.getSortDirection() === 1 /* Descending */) {
            __privateGet(this, _descending).classList.add("active");
          }
        }
        generateSortSelectionElements(model) {
          __privateGet(this, _fields2).innerHTML = "";
          const attributes = model.getSortableAttributes();
          if (!attributes || attributes.length == 0) {
            return;
          }
          __privateSet(this, _transientSortKey, model.getSortNamedAttributeMetadata().key);
          __privateSet(this, _sortByButtons, attributes.map((attr) => {
            var button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("checkable");
            if (attr.key === __privateGet(this, _transientSortKey)) {
              button.classList.add("active");
            }
            button.setAttribute("data-key", attr.key);
            button.textContent = attr.label;
            __privateGet(this, _fields2).append(button);
            return button;
          }));
          if (__privateGet(this, _sortByButtons) === null) {
            return;
          }
          __privateGet(this, _sortByButtons).forEach((button) => {
            button.onclick = () => {
              var _a;
              (_a = __privateGet(this, _sortByButtons)) == null ? void 0 : _a.forEach((toRemoveActive) => toRemoveActive.classList.remove("active"));
              button.classList.add("active");
            };
          });
        }
        show() {
          ViewHelper.setModalState(true);
          ViewHelper.toggleVisibility(__privateGet(this, _root7), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root7), false);
          ViewHelper.setModalState(false);
        }
        getSortDirectionFromView() {
          return __privateGet(this, _ascending).classList.contains("active") ? 0 /* Ascending */ : 1 /* Descending */;
        }
        getSortKeyFromView() {
          var _a, _b, _c;
          const selectedButton = (_a = __privateGet(this, _sortByButtons)) == null ? void 0 : _a.find((aButton) => aButton.classList.contains("active"));
          if (!selectedButton) {
            throw new Error("No active selected button found");
          }
          const toReturn = (_c = (_b = selectedButton == null ? void 0 : selectedButton.attributes) == null ? void 0 : _b.getNamedItem("data-key")) == null ? void 0 : _c.value;
          if (!toReturn) {
            throw new Error("No active button found");
          }
          return toReturn;
        }
      };
      _root7 = new WeakMap();
      _dismiss3 = new WeakMap();
      _ascending = new WeakMap();
      _descending = new WeakMap();
      _apply3 = new WeakMap();
      _fields2 = new WeakMap();
      _transientDirection = new WeakMap();
      _transientSortKey = new WeakMap();
      _sortByButtons = new WeakMap();
      _onSortingRulesChanged = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/StartSectionView.ts
  var _root8, _startButton, _settingsButton, StartSectionView;
  var init_StartSectionView = __esm({
    "ts_libs/ts_client/views/StartSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      StartSectionView = class {
        constructor() {
          __privateAdd(this, _root8);
          __privateAdd(this, _startButton);
          __privateAdd(this, _settingsButton);
          this.title = "Start";
          this.id = "start";
          __privateSet(this, _root8, ViewHelper.getHtmlElementOrThrow(this.id));
          __privateSet(this, _startButton, ViewHelper.getButtonOrThrow("start-btn"));
          __privateSet(this, _settingsButton, ViewHelper.getButtonOrThrow("settings-btn"));
        }
        hasExternalActions() {
          return false;
        }
        show() {
          __privateGet(this, _root8).classList.remove("d-none");
        }
        hide() {
          __privateGet(this, _root8).classList.add("d-none");
        }
        disableActions(disabled) {
          __privateGet(this, _startButton).disabled = disabled;
          __privateGet(this, _settingsButton).disabled = disabled;
        }
        bindStartAction(callback) {
          __privateGet(this, _startButton).addEventListener("click", (event) => __async(this, null, function* () {
            __privateGet(this, _startButton).setAttribute("disabled", "true");
            try {
              yield callback();
            } finally {
              __privateGet(this, _startButton).removeAttribute("disabled");
              this.hide();
            }
          }));
        }
        bindSettingsAction(callback) {
          __privateGet(this, _settingsButton).addEventListener("click", (event) => __async(this, null, function* () {
            yield callback();
          }));
        }
      };
      _root8 = new WeakMap();
      _startButton = new WeakMap();
      _settingsButton = new WeakMap();
    }
  });

  // ts_libs/ts_client/views/MainView.ts
  var MainView;
  var init_MainView = __esm({
    "ts_libs/ts_client/views/MainView.ts"() {
      "use strict";
      init_AboutSectionView();
      init_FilterModalView();
      init_NavigationView();
      init_ProgressModalView();
      init_ScreenerSectionView();
      init_SettingsModalView();
      init_SignalsSectionView();
      init_SortModalView();
      init_StartSectionView();
      MainView = class {
        constructor(model) {
          this.model = model;
          this.startSection = new StartSectionView();
          this.screenerSection = new ScreenerSectionView();
          this.navigation = new NavigationView();
          this.sortModalView = new SortModalView();
          this.progressModalView = new ProgressModalView();
          this.aboutSection = new AboutSectionView();
          this.settingsModalView = new SettingsModalView();
          this.filterModalView = new FilterModalView();
          this.signalsSection = new SignalSectionView();
          this.screenerSection.hide();
          this.navigation.hide();
          this.sortModalView.hide();
          this.settingsModalView.hide();
          this.progressModalView.hide();
          this.filterModalView.hide();
          this.aboutSection.hide();
          this.signalsSection.hide();
          this.startSection.show();
          this.sections = [this.startSection, this.screenerSection, this.signalsSection, this.aboutSection];
        }
        findSectionById(aSectionId) {
          let found = this.sections.find((section) => section.id === aSectionId);
          if (!found) {
            throw new Error(`Section with id ${aSectionId} not found.`);
          }
          return found;
        }
        showSection(aSection) {
          aSection.show();
          this.sections.forEach((currentSection) => {
            if (aSection.id === currentSection.id) {
              return;
            }
            currentSection.hide();
          });
        }
      };
    }
  });

  // ts_libs/ts_client/models/MainModel.ts
  var MainModel;
  var init_MainModel = __esm({
    "ts_libs/ts_client/models/MainModel.ts"() {
      "use strict";
      init_SortDirection();
      MainModel = class {
        constructor() {
          this.multiTimeFrameSnapshot = [];
          this.sortableAttributes = [];
          this.filterableAttributes = [];
          this.signals = [];
          this.sortDirection = 1 /* Descending */;
        }
        setSortableAttributes(namedAttributes) {
          this.sortableAttributes = namedAttributes;
        }
        setFilterableAttributes(namedAttributes) {
          this.filterableAttributes = namedAttributes;
        }
        setActiveFilterableAttributes(namedAttributes) {
          this.activeFilterableAttributes = namedAttributes;
        }
        getSortableAttributes() {
          return this.sortableAttributes;
        }
        getFilterableAttributes() {
          return this.filterableAttributes;
        }
        getActiveFilterableAttributes() {
          return this.activeFilterableAttributes;
        }
        setMultiTimeFrameSnapshot(snapshot) {
          this.multiTimeFrameSnapshot = snapshot;
        }
        appendSignals(signalModels) {
          signalModels.forEach((s) => this.signals.push(s));
        }
        getMultiTimeFrameSnapshot() {
          return this.multiTimeFrameSnapshot;
        }
        getSortDirection() {
          return this.sortDirection;
        }
        getSortNamedAttributeMetadata() {
          if (this.sortNamedAttributeMetadata === void 0) {
            throw new Error("sortNamedAttributeMetadata not set");
          }
          return this.sortNamedAttributeMetadata;
        }
        setSortNamedAttributeMetadata(sortNamedAttributeMetadata) {
          this.sortNamedAttributeMetadata = sortNamedAttributeMetadata;
        }
        setSortDirection(direction) {
          this.sortDirection = direction;
        }
        setScreenerSettings(screenerSettings) {
          this.screenerSettings = screenerSettings;
        }
        getScreenerSettings() {
          return this.screenerSettings;
        }
        getScreenerSettingsOrThrow() {
          if (this.screenerSettings === void 0) {
            throw new Error("ScreenerSettings not defined");
          }
          return this.screenerSettings;
        }
        getSignals() {
          return this.signals;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/NamedAttribute.ts
  var NamedAttributeMetadata, NumericNamedAttribute, BooleanNamedAttribute, StringNamedAttribute, NamedAttributeFactory;
  var init_NamedAttribute = __esm({
    "ts_libs/ts_worker/application/exports/NamedAttribute.ts"() {
      "use strict";
      NamedAttributeMetadata = class _NamedAttributeMetadata {
        constructor(key, label, type, precision) {
          this.key = key;
          this.label = label;
          this.type = type;
          this.precision = precision;
        }
        serialize() {
          return {
            key: this.key,
            label: this.label,
            type: this.type,
            precision: this.precision
          };
        }
        static deserialize(dto) {
          return new _NamedAttributeMetadata(
            dto.key,
            dto.label,
            dto.type,
            dto.precision
          );
        }
      };
      NumericNamedAttribute = class _NumericNamedAttribute {
        constructor(key, label, value, precision) {
          this.metadata = new NamedAttributeMetadata(key, label, "number", precision);
          if (value !== void 0 && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
          }
          if (precision !== void 0 && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
          }
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type,
              precision: this.metadata.precision
            },
            value: this.value
          };
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "number") {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
          }
          return new _NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argMetadata.precision);
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return a - b;
        }
        toString() {
          if (this.value === void 0) return "";
          return this.metadata.precision === void 0 ? this.value.toString() : this.value.toFixed(this.metadata.precision);
        }
      };
      BooleanNamedAttribute = class _BooleanNamedAttribute {
        constructor(key, label, value) {
          this.metadata = new NamedAttributeMetadata(key, label, "boolean");
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type
            },
            value: this.value
          };
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return Number(a) - Number(b);
        }
        toString() {
          return this.value === void 0 ? "" : this.value ? "true" : "false";
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "boolean") {
            throw new Error("BooleanNamedAttribute requires a valid metadata type");
          }
          return new _BooleanNamedAttribute(argMetadata.key, argMetadata.label, argValue);
        }
      };
      StringNamedAttribute = class _StringNamedAttribute {
        constructor(key, label, value) {
          this.metadata = new NamedAttributeMetadata(key, label, "string");
          if (value !== void 0 && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
          }
          this.value = value;
        }
        serialize() {
          return {
            metadata: {
              key: this.metadata.key,
              label: this.metadata.label,
              type: this.metadata.type
            },
            value: this.value
          };
        }
        static fromMetadata(argMetadata, argValue) {
          if (argMetadata.type !== "string") {
            throw new Error("StringNamedAttribute requires a valid metadata type");
          }
          return new _StringNamedAttribute(
            argMetadata.key,
            argMetadata.label,
            argValue
          );
        }
        compare(other) {
          if (other.metadata.type !== this.metadata.type) {
            throw new Error(
              `Cannot compare ${this.metadata.type} with ${other.metadata.type}`
            );
          }
          const a = this.value;
          const b = other.value;
          if (a === void 0 && b === void 0) return 0;
          if (a === void 0) return -1;
          if (b === void 0) return 1;
          return a.localeCompare(b);
        }
        toString() {
          var _a;
          return (_a = this.value) != null ? _a : "";
        }
      };
      NamedAttributeFactory = class {
        static deserialize(dto) {
          const metadata = NamedAttributeMetadata.deserialize(dto.metadata);
          switch (metadata.type) {
            case "number":
              return NumericNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : this.asNumber(dto.value)
              );
            case "boolean":
              return BooleanNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : this.asBoolean(dto.value)
              );
            case "string":
              return StringNamedAttribute.fromMetadata(
                metadata,
                dto.value === void 0 ? void 0 : String(dto.value)
              );
            default:
              throw new Error(`Unsupported named attribute type: ${metadata.type}`);
          }
        }
        static asBoolean(value) {
          if (value === void 0) return void 0;
          if (typeof value !== "boolean") {
            throw new Error("Boolean attribute value must be boolean");
          }
          return value;
        }
        static asNumber(value) {
          if (value === void 0) return void 0;
          if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error("Numeric attribute value must be finite number");
          }
          return value;
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/settings/ExchangeInclusionCriteria.ts
  var ExchangeInclusionCriteria;
  var init_ExchangeInclusionCriteria = __esm({
    "ts_libs/ts_worker/application/exports/settings/ExchangeInclusionCriteria.ts"() {
      "use strict";
      ExchangeInclusionCriteria = class _ExchangeInclusionCriteria {
        constructor(name, id, include) {
          this.name = name;
          this.id = id;
          this.include = include;
        }
        serialize() {
          return {
            name: this.name,
            id: this.id,
            include: this.include
          };
        }
        static deserialize(dto) {
          if (typeof dto.name !== "string") {
            throw new Error("Invalid name");
          }
          if (typeof dto.id !== "number") {
            throw new Error("Invalid id");
          }
          if (typeof dto.include !== "boolean") {
            throw new Error("Invalid include flag");
          }
          return new _ExchangeInclusionCriteria(
            dto.name,
            dto.id,
            dto.include
          );
        }
        deepEquals(other) {
          if (!other) return false;
          return this.name === other.name && this.id === other.id && this.include === other.include;
        }
        deepClone() {
          return new _ExchangeInclusionCriteria(this.name, this.id, this.include);
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/ScreenerSettings.ts
  var _ScreenerSettings, ScreenerSettings;
  var init_ScreenerSettings = __esm({
    "ts_libs/ts_worker/application/exports/ScreenerSettings.ts"() {
      "use strict";
      init_NamedAttribute();
      init_ExchangeInclusionCriteria();
      _ScreenerSettings = class _ScreenerSettings {
        constructor(exchangeInclusionCriterias, sortableAttributes, filterableAttributes) {
          this._parallelRequestsCount = 5;
          this._maximumPairsCountPerExchange = 1e3;
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
          this._sortableAttributes = sortableAttributes;
          this._filterableAttributes = filterableAttributes;
        }
        serialize() {
          return {
            parallelRequestsCount: this.parallelRequestsCount,
            sortableAttributes: this.sortableAttributes.map((s) => s.serialize()),
            filterableAttributes: this.filterableAttributes.map((s) => s.serialize()),
            exchangeInclusionCriterias: this._exchangeInclusionCriterias.map((s) => s.serialize()),
            maximumPairsCountPerExchange: this.maximumPairsCountPerExchange
          };
        }
        static deserialize(dto) {
          const criterias = dto.exchangeInclusionCriterias.map(
            (c) => ExchangeInclusionCriteria.deserialize(c)
          );
          const sortableAttributes = dto.sortableAttributes.map(
            (a) => NamedAttributeMetadata.deserialize(a)
          );
          const filterableAttributes = dto.filterableAttributes.map(
            (a) => NamedAttributeMetadata.deserialize(a)
          );
          const settings = new _ScreenerSettings(
            criterias,
            sortableAttributes,
            filterableAttributes
          );
          settings.parallelRequestsCount = dto.parallelRequestsCount;
          settings.maximumPairsCountPerExchange = dto.maximumPairsCountPerExchange;
          return settings;
        }
        // =====================
        // Getters / Setters
        // =====================
        get parallelRequestsCount() {
          return this._parallelRequestsCount;
        }
        set parallelRequestsCount(value) {
          if (!Number.isInteger(value) || value < 1 || value > 20) {
            throw new Error("Invalid parallelRequestsCount");
          }
          this._parallelRequestsCount = value;
        }
        get maximumPairsCountPerExchange() {
          return this._maximumPairsCountPerExchange;
        }
        set maximumPairsCountPerExchange(value) {
          if (!Number.isInteger(value) || value < 1 || value > 2e3) {
            throw new Error("Invalid maximumPairsCountPerExchange");
          }
          this._maximumPairsCountPerExchange = value;
        }
        get exchangeInclusionCriterias() {
          return this._exchangeInclusionCriterias;
        }
        set exchangeInclusionCriterias(value) {
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(value);
        }
        get sortableAttributes() {
          return this._sortableAttributes;
        }
        get filterableAttributes() {
          return this._filterableAttributes;
        }
        // =====================
        // Validation
        // =====================
        static validateExchangeInclusionCriterias(criterias) {
          if (!criterias || !Array.isArray(criterias)) {
            throw new Error("Exchange inclusion criterias cannot be null");
          }
          if (criterias.length === 0) {
            throw new Error("At least one exchange must be configured");
          }
          const hasAtLeastOne = criterias.some((c) => c.include === true);
          if (!hasAtLeastOne) {
            throw new Error("At least one exchange must be selected");
          }
          return criterias;
        }
        // =====================
        // Deep Clone & Compare
        // =====================
        deepClone() {
          return _ScreenerSettings.deserialize(this.serialize());
        }
        deepEquals(other) {
          if (!other) return false;
          if (this.parallelRequestsCount !== other.parallelRequestsCount || this.maximumPairsCountPerExchange !== other.maximumPairsCountPerExchange) {
            return false;
          }
          if (this.exchangeInclusionCriterias.length !== other.exchangeInclusionCriterias.length) {
            return false;
          }
          for (let i = 0; i < this.exchangeInclusionCriterias.length; i++) {
            if (!this.exchangeInclusionCriterias[i].deepEquals(other.exchangeInclusionCriterias[i])) {
              return false;
            }
          }
          return true;
        }
        //=========================
        //Utility methods
        //=========================
        getIncludedExchangeNames() {
          let toReturn = [];
          for (let index = 0; index < this.exchangeInclusionCriterias.length; index++) {
            const element = this.exchangeInclusionCriterias[index];
            if (element.include === true) {
              toReturn.push(element.name);
            }
          }
          return toReturn;
        }
        persist() {
          this.exchangeInclusionCriterias.forEach((element) => {
            localStorage.setItem(`${_ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`, element.include.toString());
          });
          localStorage.setItem(_ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY, this.parallelRequestsCount.toString());
          localStorage.setItem(_ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY, this.maximumPairsCountPerExchange.toString());
        }
        reconcile() {
          this.exchangeInclusionCriterias.forEach((element) => {
            const includeStr = localStorage.getItem(`${_ScreenerSettings.INCLUDE_EXCHANGE_KEY}.${element.id}`);
            element.include = includeStr !== "false";
          });
          this.parallelRequestsCount = _ScreenerSettings.readIntFromLocalStorage(
            _ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY,
            5,
            1,
            20
          );
          this.maximumPairsCountPerExchange = _ScreenerSettings.readIntFromLocalStorage(
            _ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY,
            1e3,
            1,
            2e3
          );
        }
        static readIntFromLocalStorage(key, fallback, min, max) {
          const raw = localStorage.getItem(key);
          if (raw === null) {
            return fallback;
          }
          const parsed = Number.parseInt(raw, 10);
          if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
            return fallback;
          }
          return parsed;
        }
      };
      //==========================
      //Persistence methods
      //==========================
      _ScreenerSettings.MAX_PARALLEL_REQUESTS_COUNT_KEY = "v1.parallel.request.count";
      _ScreenerSettings.MAX_PAIRS_PER_EXCHANGE_KEY = "v1.max.pairs.per.exchange";
      _ScreenerSettings.INCLUDE_EXCHANGE_KEY = "v1.include.exchange";
      ScreenerSettings = _ScreenerSettings;
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairModel.ts
  var TradingPairModel;
  var init_TradingPairModel = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairModel.ts"() {
      "use strict";
      init_NamedAttribute();
      TradingPairModel = class _TradingPairModel {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, exchangeUrl, attributes = []) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.exchangeUrl = exchangeUrl;
          this.extended = [...attributes];
        }
        serialize() {
          return {
            baseAsset: this.baseAsset,
            quoteAsset: this.quoteAsset,
            exchangeName: this.exchangeName,
            exchangeId: this.exchangeId,
            exchangeUrl: this.exchangeUrl,
            attributes: this.extended.map((attr) => attr.serialize())
          };
        }
        static deserialize(tradingPairModelDto) {
          const attributes = tradingPairModelDto.attributes.map(
            (attr) => NamedAttributeFactory.deserialize(attr)
          );
          const model = new _TradingPairModel(
            tradingPairModelDto.baseAsset,
            tradingPairModelDto.quoteAsset,
            tradingPairModelDto.exchangeName,
            tradingPairModelDto.exchangeId,
            tradingPairModelDto.exchangeUrl,
            attributes
          );
          return model;
        }
        // ------------------------
        // Typed attribute access
        // ------------------------
        addAttr(attr) {
          this.extended.push(attr);
        }
        getAttr(key) {
          return this.extended.find((a) => a.metadata.key === key);
        }
        getAttrValue(key, fallback) {
          var _a, _b;
          return (_b = (_a = this.getAttr(key)) == null ? void 0 : _a.value) != null ? _b : fallback;
        }
        hasAttr(key) {
          return this.extended.some((a) => a.metadata.key === key);
        }
        getAttributes() {
          return this.extended;
        }
        getNumericAttributes() {
          return this.extended.filter((e) => e instanceof NumericNamedAttribute) || [];
        }
        getBooleanAttributes() {
          return this.extended.filter((e) => e instanceof BooleanNamedAttribute) || [];
        }
      };
    }
  });

  // ts_libs/ts_worker/application/exports/SynchronizationModel.ts
  var SynchronizationModel;
  var init_SynchronizationModel = __esm({
    "ts_libs/ts_worker/application/exports/SynchronizationModel.ts"() {
      "use strict";
      init_SignalModel();
      init_TradingPairModel();
      SynchronizationModel = class _SynchronizationModel {
        constructor(tradingPairs = [], signals = []) {
          this.tradingPairs = tradingPairs;
          this.signals = signals;
        }
        serialize() {
          return {
            tradingPairs: this.tradingPairs.map((tp) => tp.serialize()),
            signals: this.signals.map((signal) => signal.serialize())
          };
        }
        static deserialize(dto) {
          return new _SynchronizationModel(
            dto.tradingPairs.map((tp) => TradingPairModel.deserialize(tp)),
            dto.signals.map((signal) => SignalModel.deserialize(signal))
          );
        }
      };
    }
  });

  // ts_libs/ts_client/controllers/ThinController.ts
  var _mainView, _mainModel, _worker, _promises, _id, _eventHandlers, _ThinController, ThinController;
  var init_ThinController = __esm({
    "ts_libs/ts_client/controllers/ThinController.ts"() {
      "use strict";
      init_MainView();
      init_MainModel();
      init_SortDirection();
      init_ScreenerSettings();
      init_SynchronizationModel();
      _ThinController = class _ThinController {
        constructor(model, view, worker) {
          __privateAdd(this, _mainView);
          __privateAdd(this, _mainModel);
          __privateAdd(this, _worker);
          __privateAdd(this, _promises);
          __privateAdd(this, _id);
          __privateAdd(this, _eventHandlers);
          __privateSet(this, _mainView, view);
          __privateSet(this, _mainModel, model);
          __privateSet(this, _worker, worker);
          __privateGet(this, _worker).onmessage = (e) => this.onWorkerMessage(e.data);
          __privateGet(this, _mainView).startSection.bindStartAction(() => __async(this, null, function* () {
            return yield this.fetch();
          }));
          __privateGet(this, _mainView).startSection.bindSettingsAction(() => this.showSettingsModal());
          __privateGet(this, _mainView).startSection.disableActions(true);
          __privateGet(this, _mainView).screenerSection.bindSyncButton(() => __async(this, null, function* () {
            return yield this.synchronize();
          }));
          __privateGet(this, _mainView).screenerSection.bindSortButton(() => this.showSortModal());
          __privateGet(this, _mainView).screenerSection.bindFilterButton(() => this.showFilterModal());
          __privateGet(this, _mainView).signalsSection.bindSyncButton(() => __async(this, null, function* () {
            return yield this.synchronize();
          }));
          __privateGet(this, _mainView).navigation.bindShowSectionAction((aPageName) => this.showSection(aPageName));
          __privateGet(this, _mainView).sortModalView.bindSortingRulesChanged((direction, sortKey) => this.doSort(direction, sortKey));
          __privateGet(this, _mainView).filterModalView.bindFilteringRulesChanged((rules) => this.doFilter(rules));
          __privateGet(this, _mainView).settingsModalView.bindSettingsChanged((aSettings) => this.applySettings(aSettings));
          __privateSet(this, _promises, /* @__PURE__ */ new Map());
          __privateSet(this, _eventHandlers, /* @__PURE__ */ new Map());
          __privateSet(this, _id, 0);
        }
        static Create(workerPath) {
          return __async(this, null, function* () {
            let mainModel = new MainModel();
            let mainView = new MainView(mainModel);
            let worker = new Worker(workerPath);
            var toReturn = new _ThinController(mainModel, mainView, worker);
            yield toReturn.initialize();
            return toReturn;
          });
        }
        showUpdateInfo(title, message) {
          console.log(`${_ThinController.name}::${this.showUpdateInfo.name} -> title: ${title}, message:${message}`);
        }
        showSection(aPageName) {
          var section = __privateGet(this, _mainView).findSectionById(aPageName);
          __privateGet(this, _mainView).showSection(section);
          return section;
        }
        showFilterModal() {
          __privateGet(this, _mainView).filterModalView.update(__privateGet(this, _mainModel));
          __privateGet(this, _mainView).filterModalView.show();
        }
        showSortModal() {
          __privateGet(this, _mainView).sortModalView.update(__privateGet(this, _mainModel));
          __privateGet(this, _mainView).sortModalView.show();
        }
        showSettingsModal() {
          __privateGet(this, _mainView).settingsModalView.update(__privateGet(this, _mainModel));
          __privateGet(this, _mainView).settingsModalView.show();
        }
        doFilter(activeFilters) {
          const data = __privateGet(this, _mainModel).getMultiTimeFrameSnapshot();
          const direction = __privateGet(this, _mainModel).getSortDirection();
          const key = __privateGet(this, _mainModel).getSortNamedAttributeMetadata().key;
          const sorted = _ThinController.doFilteringAndSortingCore(data, direction, key, activeFilters);
          __privateGet(this, _mainModel).setActiveFilterableAttributes(activeFilters);
          __privateGet(this, _mainView).screenerSection.setData(sorted);
          __privateGet(this, _mainView).navigation.update(__privateGet(this, _mainModel));
        }
        doSort(sortDirection, key) {
          const data = __privateGet(this, _mainModel).getMultiTimeFrameSnapshot();
          const metadata = __privateGet(this, _mainModel).getSortableAttributes().find((s) => s.key === key);
          if (metadata === void 0) {
            return;
          }
          const sorted = _ThinController.doFilteringAndSortingCore(data, sortDirection, key, __privateGet(this, _mainModel).getActiveFilterableAttributes());
          __privateGet(this, _mainModel).setSortDirection(sortDirection);
          __privateGet(this, _mainModel).setSortNamedAttributeMetadata(metadata);
          __privateGet(this, _mainView).screenerSection.setData(sorted);
          __privateGet(this, _mainView).navigation.update(__privateGet(this, _mainModel));
        }
        static doFilteringAndSortingCore(data, direction, key, filters) {
          const filtered = !filters || filters.length === 0 ? data : data.filter((tp) => {
            const tradingPairTrueAttributes = tp.getAttributes().filter((attr) => attr.value === true).map((attr) => attr.metadata.key);
            return filters.every(
              (filter) => tradingPairTrueAttributes.includes(filter.key)
            );
          });
          const dir = direction === 0 /* Ascending */ ? 1 : -1;
          const sorted = filtered.slice().sort((a, b) => {
            let aValue = a.getAttr(key);
            let bValue = b.getAttr(key);
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return -1 * dir;
            if (bValue == null) return 1 * dir;
            return aValue.compare(bValue) * dir;
          });
          return sorted;
        }
        initialize() {
          return __async(this, null, function* () {
            const rawResponse = yield this.callWorker("init");
            const settings = ScreenerSettings.deserialize(rawResponse);
            try {
              settings.reconcile();
            } catch (err) {
              console.log(err);
            } finally {
              __privateGet(this, _mainModel).setScreenerSettings(settings);
              __privateGet(this, _mainView).startSection.disableActions(false);
            }
          });
        }
        applySettings(aSettings) {
          __privateGet(this, _mainModel).setScreenerSettings(aSettings);
          aSettings.persist();
        }
        fetch() {
          return __async(this, null, function* () {
            const settings = __privateGet(this, _mainModel).getScreenerSettingsOrThrow();
            __privateGet(this, _mainView).progressModalView.show("Fetching market data ...");
            const handler = (data) => __privateGet(this, _mainView).progressModalView.updateProgressFromWorker(data);
            this.on("fetch:progress", handler);
            const response = yield this.callWorker("fetch", settings.serialize());
            this.off("fetch:progress", handler);
            const responseModel = SynchronizationModel.deserialize(response);
            const sortDirection = 1 /* Descending */;
            const sortFieldMetadata = settings.sortableAttributes[1];
            const sorted = _ThinController.doFilteringAndSortingCore(responseModel.tradingPairs, sortDirection, sortFieldMetadata.key, __privateGet(this, _mainModel).getActiveFilterableAttributes());
            __privateGet(this, _mainModel).appendSignals(responseModel.signals);
            __privateGet(this, _mainModel).setSortableAttributes(settings.sortableAttributes);
            __privateGet(this, _mainModel).setFilterableAttributes(settings.filterableAttributes);
            __privateGet(this, _mainModel).setMultiTimeFrameSnapshot(sorted);
            __privateGet(this, _mainModel).setSortDirection(sortDirection);
            __privateGet(this, _mainModel).setSortNamedAttributeMetadata(sortFieldMetadata);
            __privateGet(this, _mainView).screenerSection.setData(sorted);
            __privateGet(this, _mainView).signalsSection.setData(__privateGet(this, _mainModel).getSignals());
            __privateGet(this, _mainView).sortModalView.update(__privateGet(this, _mainModel));
            __privateGet(this, _mainView).filterModalView.update(__privateGet(this, _mainModel));
            __privateGet(this, _mainView).progressModalView.hide();
            __privateGet(this, _mainView).screenerSection.show();
            __privateGet(this, _mainView).navigation.update(__privateGet(this, _mainModel));
            __privateGet(this, _mainView).navigation.show();
          });
        }
        synchronize() {
          return __async(this, null, function* () {
            var _a;
            __privateGet(this, _mainView).progressModalView.show("Synchronizing market data ...");
            const handler = (data) => __privateGet(this, _mainView).progressModalView.updateProgressFromWorker(data);
            this.on("synchronize:progress", handler);
            const rawResponse = yield this.callWorker("synchronize", (_a = __privateGet(this, _mainModel).getScreenerSettings()) == null ? void 0 : _a.serialize());
            this.off("synchronize:progress", handler);
            const synchronizationModel = SynchronizationModel.deserialize(rawResponse);
            if (synchronizationModel.tradingPairs.length > 0) {
              const sorted = _ThinController.doFilteringAndSortingCore(synchronizationModel.tradingPairs, __privateGet(this, _mainModel).getSortDirection(), __privateGet(this, _mainModel).getSortNamedAttributeMetadata().key, __privateGet(this, _mainModel).getActiveFilterableAttributes());
              __privateGet(this, _mainModel).setMultiTimeFrameSnapshot(synchronizationModel.tradingPairs);
              __privateGet(this, _mainModel).appendSignals(synchronizationModel.signals);
              __privateGet(this, _mainView).screenerSection.setData(sorted);
              __privateGet(this, _mainView).signalsSection.setData(__privateGet(this, _mainModel).getSignals());
            }
            __privateGet(this, _mainView).progressModalView.hide();
          });
        }
        callWorker(method, args) {
          const id = ++__privateWrapper(this, _id)._;
          const message = { id, type: "call", method, args };
          this.postWorkerMessage(message);
          return new Promise((resolve, reject) => {
            __privateGet(this, _promises).set(id, { resolve, reject });
          });
        }
        postWorkerMessage(message) {
          __privateGet(this, _worker).postMessage(message);
        }
        onWorkerMessage(msg) {
          if (msg.type === "resolve" || msg.type === "reject") {
            const pending = __privateGet(this, _promises).get(msg.id);
            if (!pending) return;
            __privateGet(this, _promises).delete(msg.id);
            msg.type === "resolve" ? pending.resolve(msg.payload) : pending.reject(new Error(msg.error));
            return;
          }
          if (msg.type === "event") {
            const handlers = __privateGet(this, _eventHandlers).get(msg.name);
            if (!handlers) return;
            handlers.forEach((h) => h(msg.payload));
          }
        }
        on(eventName, handler) {
          if (!__privateGet(this, _eventHandlers).has(eventName)) {
            __privateGet(this, _eventHandlers).set(eventName, /* @__PURE__ */ new Set());
          }
          __privateGet(this, _eventHandlers).get(eventName).add(handler);
        }
        off(eventName, handler) {
          var _a;
          (_a = __privateGet(this, _eventHandlers).get(eventName)) == null ? void 0 : _a.delete(handler);
        }
      };
      _mainView = new WeakMap();
      _mainModel = new WeakMap();
      _worker = new WeakMap();
      _promises = new WeakMap();
      _id = new WeakMap();
      _eventHandlers = new WeakMap();
      ThinController = _ThinController;
    }
  });

  // ts_libs/ts_client/controllers/ServiceWorkerController.ts
  var _ServiceWorkerController, ServiceWorkerController;
  var init_ServiceWorkerController = __esm({
    "ts_libs/ts_client/controllers/ServiceWorkerController.ts"() {
      "use strict";
      _ServiceWorkerController = class _ServiceWorkerController {
        constructor(registration) {
          this.registration = registration;
          this.hasReloaded = false;
          this.onControllerChange = () => {
            this.reloadAfterActivation();
          };
          this.onUpdateFound = () => {
            const worker = this.registration.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (worker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[SW] Update installed during startup");
              }
            });
          };
        }
        static Create(swPath = "sw.js") {
          return __async(this, null, function* () {
            if (!("serviceWorker" in navigator)) {
              return void 0;
            }
            const registration = yield navigator.serviceWorker.register(swPath);
            yield navigator.serviceWorker.ready;
            const controller = new _ServiceWorkerController(registration);
            controller.registerUpdateListeners();
            return controller;
          });
        }
        registerUpdateListeners() {
          this.registration.addEventListener("updatefound", this.onUpdateFound);
          navigator.serviceWorker.addEventListener("controllerchange", this.onControllerChange);
        }
        disableUpdateChecks() {
          this.registration.removeEventListener("updatefound", this.onUpdateFound);
          navigator.serviceWorker.removeEventListener("controllerchange", this.onControllerChange);
        }
        reloadAfterActivation() {
          if (this.hasReloaded) {
            return;
          }
          this.hasReloaded = true;
          const url = new URL(window.location.href);
          url.searchParams.set(
            _ServiceWorkerController.UPDATED_QUERY_PARAM,
            "1"
          );
          window.location.replace(url.toString());
        }
        static WasUpdated() {
          const url = new URL(window.location.href);
          if (url.searchParams.get(
            _ServiceWorkerController.UPDATED_QUERY_PARAM
          ) !== "1") {
            return false;
          }
          url.searchParams.delete(
            _ServiceWorkerController.UPDATED_QUERY_PARAM
          );
          history.replaceState(
            {},
            document.title,
            url.pathname + url.search + url.hash
          );
          return true;
        }
        forceUpdateCheck() {
          return __async(this, null, function* () {
            yield this.registration.update();
          });
        }
      };
      _ServiceWorkerController.UPDATED_QUERY_PARAM = "updated";
      ServiceWorkerController = _ServiceWorkerController;
    }
  });

  // ts_libs/ts_client/index.ts
  var require_index = __commonJS({
    "ts_libs/ts_client/index.ts"(exports) {
      init_ThinController();
      init_ServiceWorkerController();
      document.addEventListener("DOMContentLoaded", () => __async(null, null, function* () {
        const [swResult, appResult] = yield Promise.allSettled([
          ServiceWorkerController.Create("sw.js"),
          ThinController.Create("js/worker/worker.js")
        ]);
        if (swResult.status === "rejected") {
          console.error("ServiceWorker startup failed", swResult.reason);
        }
        if (appResult.status === "rejected") {
          console.error("Application startup failed", appResult.reason);
        }
        const sw = swResult.status === "fulfilled" ? swResult.value : void 0;
        const app = appResult.status === "fulfilled" ? appResult.value : void 0;
        if (!sw || !app) {
          console.error("sw or app undefined");
          return;
        }
        if (ServiceWorkerController.WasUpdated()) {
          app.showUpdateInfo("Updated", "Application was updated to a new version.");
        }
        if (sw) {
          yield sw.forceUpdateCheck();
        }
      }));
    }
  });
  require_index();
})();
//# sourceMappingURL=bundle.js.map
