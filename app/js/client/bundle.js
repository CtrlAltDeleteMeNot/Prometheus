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
  var _root, AboutSectionView;
  var init_AboutSectionView = __esm({
    "ts_libs/ts_client/views/AboutSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      AboutSectionView = class {
        constructor() {
          __privateAdd(this, _root);
          this.id = "about";
          this.title = "About";
          __privateSet(this, _root, ViewHelper.getHtmlElementOrThrow("about"));
        }
        hasExternalActions() {
          return false;
        }
        show() {
          __privateGet(this, _root).classList.remove("d-none");
        }
        hide() {
          __privateGet(this, _root).classList.add("d-none");
        }
      };
      _root = new WeakMap();
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
            button.classList.add("filter-button");
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
  var _sidebar, _header, _headerSectionName, _footer, _expandAction, _collapseAction, _syncAction, _sortAction, _filterAction, _sortActionMainText, _sortActionSubText, _sortActionImage, _showPageScreenerAction, _showPageAboutAction, NavigationView;
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
          __privateAdd(this, _footer);
          __privateAdd(this, _expandAction);
          __privateAdd(this, _collapseAction);
          __privateAdd(this, _syncAction);
          __privateAdd(this, _sortAction);
          __privateAdd(this, _filterAction);
          __privateAdd(this, _sortActionMainText);
          __privateAdd(this, _sortActionSubText);
          __privateAdd(this, _sortActionImage);
          __privateAdd(this, _showPageScreenerAction);
          __privateAdd(this, _showPageAboutAction);
          __privateSet(this, _sidebar, ViewHelper.getHtmlElementOrThrow("nav-sidebar"));
          __privateSet(this, _header, ViewHelper.getHtmlElementOrThrow("nav-header"));
          __privateSet(this, _headerSectionName, ViewHelper.getHtmlElementOrThrow("current-section"));
          __privateSet(this, _footer, ViewHelper.getHtmlElementOrThrow("nav-footer"));
          __privateSet(this, _syncAction, ViewHelper.getButtonOrThrow("nav-footer-sync"));
          __privateSet(this, _sortAction, ViewHelper.getButtonOrThrow("nav-footer-sort"));
          __privateSet(this, _filterAction, ViewHelper.getButtonOrThrow("nav-footer-filter"));
          __privateSet(this, _expandAction, ViewHelper.getButtonOrThrow("menu-open"));
          __privateSet(this, _collapseAction, ViewHelper.getButtonOrThrow("menu-close"));
          __privateSet(this, _sortActionMainText, ViewHelper.getSpanOrThrow("nav-footer-sort-main-text"));
          __privateSet(this, _sortActionSubText, ViewHelper.getSpanOrThrow("nav-footer-sort-sub-text"));
          __privateSet(this, _sortActionImage, ViewHelper.getSpanOrThrow("nav-footer-sort-svg"));
          __privateSet(this, _showPageAboutAction, ViewHelper.getAnchorOrThrow("nav-menu-about"));
          __privateSet(this, _showPageScreenerAction, ViewHelper.getAnchorOrThrow("nav-menu-screener"));
          __privateGet(this, _sortAction).onclick = () => console.log(`Sort action clicked`);
          __privateGet(this, _syncAction).onclick = () => console.log(`Sync action clicked`);
          __privateGet(this, _filterAction).onclick = () => console.log(`Filter action clicked`);
          __privateGet(this, _expandAction).onclick = () => this.showSideMenu();
          __privateGet(this, _collapseAction).onclick = () => this.closeSideMenu();
          __privateGet(this, _showPageAboutAction).onclick = () => console.log(`Show about page clicked`);
          __privateGet(this, _showPageScreenerAction).onclick = () => console.log(`Show screener page clicked`);
        }
        showSideMenu() {
          __privateGet(this, _sidebar).classList.add("open");
        }
        closeSideMenu() {
          __privateGet(this, _sidebar).classList.remove("open");
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
        getShowPageActions() {
          return [__privateGet(this, _showPageAboutAction), __privateGet(this, _showPageScreenerAction)];
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
              ViewHelper.toggleVisibility(__privateGet(this, _footer), section.hasExternalActions());
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
          __privateGet(this, _footer).classList.remove("d-hidden");
        }
        hide() {
          __privateGet(this, _sidebar).classList.add("d-hidden");
          __privateGet(this, _header).classList.add("d-hidden");
          __privateGet(this, _footer).classList.add("d-hidden");
        }
      };
      _sidebar = new WeakMap();
      _header = new WeakMap();
      _headerSectionName = new WeakMap();
      _footer = new WeakMap();
      _expandAction = new WeakMap();
      _collapseAction = new WeakMap();
      _syncAction = new WeakMap();
      _sortAction = new WeakMap();
      _filterAction = new WeakMap();
      _sortActionMainText = new WeakMap();
      _sortActionSubText = new WeakMap();
      _sortActionImage = new WeakMap();
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
          requestAnimationFrame(() => {
            const scale = percent / 100;
            __privateGet(this, _percentText).textContent = `${percent.toFixed(0)} %`;
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
  function getSymbolSvgUrlById(input, fallback = "generic") {
    const id = input.toLowerCase();
    return SYMBOL_ICON_REGISTRY[id.toLowerCase()] || SYMBOL_ICON_REGISTRY[fallback];
  }
  var SYMBOL_ICON_REGISTRY;
  var init_SymbolIconsRegistry = __esm({
    "ts_libs/ts_client/views/generated/SymbolIconsRegistry.ts"() {
      "use strict";
      SYMBOL_ICON_REGISTRY = {
        "zrx": "img/symbols/zrx.svg",
        "zilla": "img/symbols/zilla.svg",
        "zil": "img/symbols/zil.svg",
        "zest": "img/symbols/zest.svg",
        "zen": "img/symbols/zen.svg",
        "zel": "img/symbols/zel.svg",
        "zec": "img/symbols/zec.svg",
        "zcl": "img/symbols/zcl.svg",
        "yoyow": "img/symbols/yoyow.svg",
        "yfi": "img/symbols/yfi.svg",
        "xzc": "img/symbols/xzc.svg",
        "xvg": "img/symbols/xvg.svg",
        "xvc": "img/symbols/xvc.svg",
        "xuc": "img/symbols/xuc.svg",
        "xtz": "img/symbols/xtz.svg",
        "xsg": "img/symbols/xsg.svg",
        "xrp": "img/symbols/xrp.svg",
        "xpr": "img/symbols/xpr.svg",
        "xpm": "img/symbols/xpm.svg",
        "xpa": "img/symbols/xpa.svg",
        "xp": "img/symbols/xp.svg",
        "xmy": "img/symbols/xmy.svg",
        "xmr": "img/symbols/xmr.svg",
        "xmo": "img/symbols/xmo.svg",
        "xmg": "img/symbols/xmg.svg",
        "xmcc": "img/symbols/xmcc.svg",
        "xlm": "img/symbols/xlm.svg",
        "xin": "img/symbols/xin.svg",
        "xem": "img/symbols/xem.svg",
        "xdn": "img/symbols/xdn.svg",
        "xcp": "img/symbols/xcp.svg",
        "xby": "img/symbols/xby.svg",
        "xbp": "img/symbols/xbp.svg",
        "xbc": "img/symbols/xbc.svg",
        "xas": "img/symbols/xas.svg",
        "x": "img/symbols/x.svg",
        "wtc": "img/symbols/wtc.svg",
        "wpr": "img/symbols/wpr.svg",
        "wings": "img/symbols/wings.svg",
        "wicc": "img/symbols/wicc.svg",
        "wgr": "img/symbols/wgr.svg",
        "wbtc": "img/symbols/wbtc.svg",
        "wax": "img/symbols/wax.svg",
        "waves": "img/symbols/waves.svg",
        "wan": "img/symbols/wan.svg",
        "wabi": "img/symbols/wabi.svg",
        "vtho": "img/symbols/vtho.svg",
        "vtc": "img/symbols/vtc.svg",
        "vrsc": "img/symbols/vrsc.svg",
        "vrc": "img/symbols/vrc.svg",
        "vivo": "img/symbols/vivo.svg",
        "vibe": "img/symbols/vibe.svg",
        "vib": "img/symbols/vib.svg",
        "via": "img/symbols/via.svg",
        "vet": "img/symbols/vet.svg",
        "veri": "img/symbols/veri.svg",
        "utk": "img/symbols/utk.svg",
        "usdt": "img/symbols/usdt.svg",
        "usdc": "img/symbols/usdc.svg",
        "usd": "img/symbols/usd.svg",
        "unity": "img/symbols/unity.svg",
        "uni": "img/symbols/uni.svg",
        "uma": "img/symbols/uma.svg",
        "ubq": "img/symbols/ubq.svg",
        "tzc": "img/symbols/tzc.svg",
        "tusd": "img/symbols/tusd.svg",
        "trx": "img/symbols/trx.svg",
        "trtl": "img/symbols/trtl.svg",
        "trig": "img/symbols/trig.svg",
        "tpay": "img/symbols/tpay.svg",
        "tomo": "img/symbols/tomo.svg",
        "tnt": "img/symbols/tnt.svg",
        "tnc": "img/symbols/tnc.svg",
        "tnb": "img/symbols/tnb.svg",
        "tks": "img/symbols/tks.svg",
        "tkn": "img/symbols/tkn.svg",
        "tix": "img/symbols/tix.svg",
        "theta": "img/symbols/theta.svg",
        "tgch": "img/symbols/tgch.svg",
        "tern": "img/symbols/tern.svg",
        "ten": "img/symbols/ten.svg",
        "tel": "img/symbols/tel.svg",
        "tbx": "img/symbols/tbx.svg",
        "tau": "img/symbols/tau.svg",
        "taas": "img/symbols/taas.svg",
        "sys": "img/symbols/sys.svg",
        "sushi": "img/symbols/sushi.svg",
        "sumo": "img/symbols/sumo.svg",
        "sub": "img/symbols/sub.svg",
        "stx": "img/symbols/stx.svg",
        "strat": "img/symbols/strat.svg",
        "stq": "img/symbols/stq.svg",
        "stox": "img/symbols/stox.svg",
        "storm": "img/symbols/storm.svg",
        "storj": "img/symbols/storj.svg",
        "steem": "img/symbols/steem.svg",
        "start": "img/symbols/start.svg",
        "stak": "img/symbols/stak.svg",
        "srn": "img/symbols/srn.svg",
        "sphtx": "img/symbols/sphtx.svg",
        "spank": "img/symbols/spank.svg",
        "spacehbit": "img/symbols/spacehbit.svg",
        "sol": "img/symbols/sol.svg",
        "soc": "img/symbols/soc.svg",
        "snx": "img/symbols/snx.svg",
        "snt": "img/symbols/snt.svg",
        "snm": "img/symbols/snm.svg",
        "sngls": "img/symbols/sngls.svg",
        "smart": "img/symbols/smart.svg",
        "sls": "img/symbols/sls.svg",
        "slr": "img/symbols/slr.svg",
        "sky": "img/symbols/sky.svg",
        "skl": "img/symbols/skl.svg",
        "sin": "img/symbols/sin.svg",
        "sib": "img/symbols/sib.svg",
        "shift": "img/symbols/shift.svg",
        "ser": "img/symbols/ser.svg",
        "sc": "img/symbols/sc.svg",
        "sberbank": "img/symbols/sberbank.svg",
        "sbd": "img/symbols/sbd.svg",
        "sand": "img/symbols/sand.svg",
        "san": "img/symbols/san.svg",
        "salt": "img/symbols/salt.svg",
        "sai": "img/symbols/sai.svg",
        "safemoon": "img/symbols/safemoon.svg",
        "safe": "img/symbols/safe.svg",
        "ryo": "img/symbols/ryo.svg",
        "rvn": "img/symbols/rvn.svg",
        "rub": "img/symbols/rub.svg",
        "rpx": "img/symbols/rpx.svg",
        "rlc": "img/symbols/rlc.svg",
        "rise": "img/symbols/rise.svg",
        "ric": "img/symbols/ric.svg",
        "rhoc": "img/symbols/rhoc.svg",
        "req": "img/symbols/req.svg",
        "repv2": "img/symbols/repv2.svg",
        "rep": "img/symbols/rep.svg",
        "ren": "img/symbols/ren.svg",
        "rdn": "img/symbols/rdn.svg",
        "rdd": "img/symbols/rdd.svg",
        "rcn": "img/symbols/rcn.svg",
        "ray": "img/symbols/ray.svg",
        "rap": "img/symbols/rap.svg",
        "rads": "img/symbols/rads.svg",
        "r": "img/symbols/r.svg",
        "qtum": "img/symbols/qtum.svg",
        "qsp": "img/symbols/qsp.svg",
        "qrl": "img/symbols/qrl.svg",
        "qnt": "img/symbols/qnt.svg",
        "qlc": "img/symbols/qlc.svg",
        "qiwi": "img/symbols/qiwi.svg",
        "qash": "img/symbols/qash.svg",
        "pura": "img/symbols/pura.svg",
        "pungo": "img/symbols/pungo.svg",
        "prl": "img/symbols/prl.svg",
        "pre": "img/symbols/pre.svg",
        "ppt": "img/symbols/ppt.svg",
        "ppp": "img/symbols/ppp.svg",
        "ppc": "img/symbols/ppc.svg",
        "powr": "img/symbols/powr.svg",
        "pot": "img/symbols/pot.svg",
        "poly": "img/symbols/poly.svg",
        "polis": "img/symbols/polis.svg",
        "poe": "img/symbols/poe.svg",
        "poa": "img/symbols/poa.svg",
        "plr": "img/symbols/plr.svg",
        "pivx": "img/symbols/pivx.svg",
        "pirl": "img/symbols/pirl.svg",
        "pink": "img/symbols/pink.svg",
        "payx": "img/symbols/payx.svg",
        "pay": "img/symbols/pay.svg",
        "paxg": "img/symbols/paxg.svg",
        "pax": "img/symbols/pax.svg",
        "pasl": "img/symbols/pasl.svg",
        "pasc": "img/symbols/pasc.svg",
        "part": "img/symbols/part.svg",
        "oxy": "img/symbols/oxy.svg",
        "oxt": "img/symbols/oxt.svg",
        "ox": "img/symbols/ox.svg",
        "ost": "img/symbols/ost.svg",
        "oot": "img/symbols/oot.svg",
        "ont": "img/symbols/ont.svg",
        "ong": "img/symbols/ong.svg",
        "one": "img/symbols/one.svg",
        "omni": "img/symbols/omni.svg",
        "omg": "img/symbols/omg.svg",
        "ok": "img/symbols/ok.svg",
        "oax": "img/symbols/oax.svg",
        "nxt": "img/symbols/nxt.svg",
        "nxs": "img/symbols/nxs.svg",
        "nuls": "img/symbols/nuls.svg",
        "ntbc": "img/symbols/ntbc.svg",
        "npxs": "img/symbols/npxs.svg",
        "nmr": "img/symbols/nmr.svg",
        "nmc": "img/symbols/nmc.svg",
        "nlg": "img/symbols/nlg.svg",
        "nlc2": "img/symbols/nlc2.svg",
        "nkn": "img/symbols/nkn.svg",
        "nio": "img/symbols/nio.svg",
        "ngc": "img/symbols/ngc.svg",
        "nexo": "img/symbols/nexo.svg",
        "neu": "img/symbols/neu.svg",
        "neos": "img/symbols/neos.svg",
        "neo": "img/symbols/neo.svg",
        "nebl": "img/symbols/nebl.svg",
        "ndz": "img/symbols/ndz.svg",
        "ncash": "img/symbols/ncash.svg",
        "nav": "img/symbols/nav.svg",
        "nas": "img/symbols/nas.svg",
        "nano": "img/symbols/nano.svg",
        "mzc": "img/symbols/mzc.svg",
        "music": "img/symbols/music.svg",
        "mtl": "img/symbols/mtl.svg",
        "mth": "img/symbols/mth.svg",
        "msr": "img/symbols/msr.svg",
        "mona": "img/symbols/mona.svg",
        "mod": "img/symbols/mod.svg",
        "moac": "img/symbols/moac.svg",
        "mnz": "img/symbols/mnz.svg",
        "mnx": "img/symbols/mnx.svg",
        "mln": "img/symbols/mln.svg",
        "mkr": "img/symbols/mkr.svg",
        "mith": "img/symbols/mith.svg",
        "miota": "img/symbols/miota.svg",
        "mft": "img/symbols/mft.svg",
        "meetone": "img/symbols/meetone.svg",
        "med": "img/symbols/med.svg",
        "mds": "img/symbols/mds.svg",
        "mda": "img/symbols/mda.svg",
        "mco": "img/symbols/mco.svg",
        "mcap": "img/symbols/mcap.svg",
        "max": "img/symbols/max.svg",
        "matic": "img/symbols/matic.svg",
        "mana": "img/symbols/mana.svg",
        "maid": "img/symbols/maid.svg",
        "lun": "img/symbols/lun.svg",
        "ltc": "img/symbols/ltc.svg",
        "lsk": "img/symbols/lsk.svg",
        "lrc": "img/symbols/lrc.svg",
        "lpt": "img/symbols/lpt.svg",
        "loom": "img/symbols/loom.svg",
        "lkk": "img/symbols/lkk.svg",
        "link": "img/symbols/link.svg",
        "leo": "img/symbols/leo.svg",
        "lend": "img/symbols/lend.svg",
        "lbc": "img/symbols/lbc.svg",
        "ksm": "img/symbols/ksm.svg",
        "krb": "img/symbols/krb.svg",
        "knc": "img/symbols/knc.svg",
        "kmd": "img/symbols/kmd.svg",
        "klown": "img/symbols/klown.svg",
        "kin": "img/symbols/kin.svg",
        "kcs": "img/symbols/kcs.svg",
        "jpy": "img/symbols/jpy.svg",
        "jnt": "img/symbols/jnt.svg",
        "itc": "img/symbols/itc.svg",
        "iq": "img/symbols/iq.svg",
        "iotx": "img/symbols/iotx.svg",
        "iost": "img/symbols/iost.svg",
        "iop": "img/symbols/iop.svg",
        "ion": "img/symbols/ion.svg",
        "ins": "img/symbols/ins.svg",
        "ink": "img/symbols/ink.svg",
        "ilk": "img/symbols/ilk.svg",
        "ignis": "img/symbols/ignis.svg",
        "icx": "img/symbols/icx.svg",
        "icp": "img/symbols/icp.svg",
        "icn": "img/symbols/icn.svg",
        "hush": "img/symbols/hush.svg",
        "husd": "img/symbols/husd.svg",
        "huc": "img/symbols/huc.svg",
        "html": "img/symbols/html.svg",
        "ht": "img/symbols/ht.svg",
        "hsr": "img/symbols/hsr.svg",
        "hpb": "img/symbols/hpb.svg",
        "hot": "img/symbols/hot.svg",
        "hodl": "img/symbols/hodl.svg",
        "hns": "img/symbols/hns.svg",
        "hight": "img/symbols/hight.svg",
        "gzr": "img/symbols/gzr.svg",
        "gxs": "img/symbols/gxs.svg",
        "gvt": "img/symbols/gvt.svg",
        "gusd": "img/symbols/gusd.svg",
        "gup": "img/symbols/gup.svg",
        "gto": "img/symbols/gto.svg",
        "gsc": "img/symbols/gsc.svg",
        "grt": "img/symbols/grt.svg",
        "grs": "img/symbols/grs.svg",
        "grin": "img/symbols/grin.svg",
        "grc": "img/symbols/grc.svg",
        "gold": "img/symbols/gold.svg",
        "gnt": "img/symbols/gnt.svg",
        "gno": "img/symbols/gno.svg",
        "gmt": "img/symbols/gmt.svg",
        "gmr": "img/symbols/gmr.svg",
        "glxt": "img/symbols/glxt.svg",
        "gin": "img/symbols/gin.svg",
        "generic": "img/symbols/generic.svg",
        "gbyte": "img/symbols/gbyte.svg",
        "gbx": "img/symbols/gbx.svg",
        "gbp": "img/symbols/gbp.svg",
        "gas": "img/symbols/gas.svg",
        "game": "img/symbols/game.svg",
        "fun": "img/symbols/fun.svg",
        "fuel": "img/symbols/fuel.svg",
        "ftc": "img/symbols/ftc.svg",
        "fsn": "img/symbols/fsn.svg",
        "flux": "img/symbols/flux.svg",
        "flo": "img/symbols/flo.svg",
        "fldc": "img/symbols/fldc.svg",
        "fjc": "img/symbols/fjc.svg",
        "fil": "img/symbols/fil.svg",
        "fida": "img/symbols/fida.svg",
        "fct": "img/symbols/fct.svg",
        "fair": "img/symbols/fair.svg",
        "exp": "img/symbols/exp.svg",
        "exmo": "img/symbols/exmo.svg",
        "evx": "img/symbols/evx.svg",
        "eur": "img/symbols/eur.svg",
        "etp": "img/symbols/etp.svg",
        "etn": "img/symbols/etn.svg",
        "ethos": "img/symbols/ethos.svg",
        "eth": "img/symbols/eth.svg",
        "etc": "img/symbols/etc.svg",
        "equa": "img/symbols/equa.svg",
        "eqli": "img/symbols/eqli.svg",
        "eos": "img/symbols/eos.svg",
        "eop": "img/symbols/eop.svg",
        "eon": "img/symbols/eon.svg",
        "entrp": "img/symbols/entrp.svg",
        "enj": "img/symbols/enj.svg",
        "eng": "img/symbols/eng.svg",
        "emc2": "img/symbols/emc2.svg",
        "emc": "img/symbols/emc.svg",
        "emb": "img/symbols/emb.svg",
        "ella": "img/symbols/ella.svg",
        "elix": "img/symbols/elix.svg",
        "elf": "img/symbols/elf.svg",
        "elec": "img/symbols/elec.svg",
        "ela": "img/symbols/ela.svg",
        "edoge": "img/symbols/edoge.svg",
        "edo": "img/symbols/edo.svg",
        "edg": "img/symbols/edg.svg",
        "eca": "img/symbols/eca.svg",
        "ebst": "img/symbols/ebst.svg",
        "dtr": "img/symbols/dtr.svg",
        "dth": "img/symbols/dth.svg",
        "dta": "img/symbols/dta.svg",
        "drop": "img/symbols/drop.svg",
        "drgn": "img/symbols/drgn.svg",
        "dot": "img/symbols/dot.svg",
        "doge": "img/symbols/doge.svg",
        "dock": "img/symbols/dock.svg",
        "dnt": "img/symbols/dnt.svg",
        "dlt": "img/symbols/dlt.svg",
        "dgd": "img/symbols/dgd.svg",
        "dgb": "img/symbols/dgb.svg",
        "dew": "img/symbols/dew.svg",
        "dent": "img/symbols/dent.svg",
        "deez": "img/symbols/deez.svg",
        "dcr": "img/symbols/dcr.svg",
        "dcn": "img/symbols/dcn.svg",
        "dbc": "img/symbols/dbc.svg",
        "data": "img/symbols/data.svg",
        "dat": "img/symbols/dat.svg",
        "dash": "img/symbols/dash.svg",
        "dai": "img/symbols/dai.svg",
        "d": "img/symbols/d.svg",
        "cvc": "img/symbols/cvc.svg",
        "ctxc": "img/symbols/ctxc.svg",
        "ctr": "img/symbols/ctr.svg",
        "cs": "img/symbols/cs.svg",
        "crw": "img/symbols/crw.svg",
        "crv": "img/symbols/crv.svg",
        "crpt": "img/symbols/crpt.svg",
        "cred": "img/symbols/cred.svg",
        "coqui": "img/symbols/coqui.svg",
        "comp": "img/symbols/comp.svg",
        "colx": "img/symbols/colx.svg",
        "cob": "img/symbols/cob.svg",
        "cny": "img/symbols/cny.svg",
        "cnx": "img/symbols/cnx.svg",
        "cnd": "img/symbols/cnd.svg",
        "cmt": "img/symbols/cmt.svg",
        "cmm": "img/symbols/cmm.svg",
        "cloak": "img/symbols/cloak.svg",
        "clam": "img/symbols/clam.svg",
        "cix": "img/symbols/cix.svg",
        "chz": "img/symbols/chz.svg",
        "chsb": "img/symbols/chsb.svg",
        "chips": "img/symbols/chips.svg",
        "chat": "img/symbols/chat.svg",
        "chain": "img/symbols/chain.svg",
        "cenz": "img/symbols/cenz.svg",
        "cdt": "img/symbols/cdt.svg",
        "cdn": "img/symbols/cdn.svg",
        "cc": "img/symbols/cc.svg",
        "call": "img/symbols/call.svg",
        "bze": "img/symbols/bze.svg",
        "burst": "img/symbols/burst.svg",
        "btx": "img/symbols/btx.svg",
        "btt": "img/symbols/btt.svg",
        "bts": "img/symbols/bts.svg",
        "btm": "img/symbols/btm.svg",
        "btg": "img/symbols/btg.svg",
        "btdx": "img/symbols/btdx.svg",
        "btcz": "img/symbols/btcz.svg",
        "btcp": "img/symbols/btcp.svg",
        "btch": "img/symbols/btch.svg",
        "btcd": "img/symbols/btcd.svg",
        "btc": "img/symbols/btc.svg",
        "bsv": "img/symbols/bsv.svg",
        "bsd": "img/symbols/bsd.svg",
        "brd": "img/symbols/brd.svg",
        "bq": "img/symbols/bq.svg",
        "bpt": "img/symbols/bpt.svg",
        "bos": "img/symbols/bos.svg",
        "booty": "img/symbols/booty.svg",
        "bnty": "img/symbols/bnty.svg",
        "bnt": "img/symbols/bnt.svg",
        "bnb": "img/symbols/bnb.svg",
        "blz": "img/symbols/blz.svg",
        "block": "img/symbols/block.svg",
        "blk": "img/symbols/blk.svg",
        "blcn": "img/symbols/blcn.svg",
        "bix": "img/symbols/bix.svg",
        "bela": "img/symbols/bela.svg",
        "beam": "img/symbols/beam.svg",
        "bdl": "img/symbols/bdl.svg",
        "bcpt": "img/symbols/bcpt.svg",
        "bco": "img/symbols/bco.svg",
        "bcn": "img/symbols/bcn.svg",
        "bcio": "img/symbols/bcio.svg",
        "bch": "img/symbols/bch.svg",
        "bcd": "img/symbols/bcd.svg",
        "bcc": "img/symbols/bcc.svg",
        "bcbc": "img/symbols/bcbc.svg",
        "bay": "img/symbols/bay.svg",
        "bat": "img/symbols/bat.svg",
        "band": "img/symbols/band.svg",
        "bal": "img/symbols/bal.svg",
        "bab": "img/symbols/bab.svg",
        "aywa": "img/symbols/aywa.svg",
        "avax": "img/symbols/avax.svg",
        "auto": "img/symbols/auto.svg",
        "aury": "img/symbols/aury.svg",
        "audr": "img/symbols/audr.svg",
        "atom": "img/symbols/atom.svg",
        "atm": "img/symbols/atm.svg",
        "atlas": "img/symbols/atlas.svg",
        "ast": "img/symbols/ast.svg",
        "ary": "img/symbols/ary.svg",
        "arnx": "img/symbols/arnx.svg",
        "arn": "img/symbols/arn.svg",
        "ark": "img/symbols/ark.svg",
        "arg": "img/symbols/arg.svg",
        "ardr": "img/symbols/ardr.svg",
        "appc": "img/symbols/appc.svg",
        "apex": "img/symbols/apex.svg",
        "ape": "img/symbols/ape.svg",
        "ant": "img/symbols/ant.svg",
        "ankr": "img/symbols/ankr.svg",
        "ampl": "img/symbols/ampl.svg",
        "amp": "img/symbols/amp.svg",
        "amb": "img/symbols/amb.svg",
        "algo": "img/symbols/algo.svg",
        "aion": "img/symbols/aion.svg",
        "agrs": "img/symbols/agrs.svg",
        "agi": "img/symbols/agi.svg",
        "aeur": "img/symbols/aeur.svg",
        "aeon": "img/symbols/aeon.svg",
        "ae": "img/symbols/ae.svg",
        "adx": "img/symbols/adx.svg",
        "add": "img/symbols/add.svg",
        "ada": "img/symbols/ada.svg",
        "actn": "img/symbols/actn.svg",
        "act": "img/symbols/act.svg",
        "abt": "img/symbols/abt.svg",
        "aave": "img/symbols/aave.svg",
        "2give": "img/symbols/2give.svg",
        "1inch": "img/symbols/1inch.svg",
        "0xbtc": "img/symbols/0xbtc.svg",
        "$pac": "img/symbols/$pac.svg"
      };
    }
  });

  // ts_libs/ts_client/views/ScreenerSectionView.ts
  var _root4, _screenerBody, _allData, _currentPage, _pageSize, _loadMoreBtn, ScreenerSectionView;
  var init_ScreenerSectionView = __esm({
    "ts_libs/ts_client/views/ScreenerSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      init_ActionIconsRegistry();
      init_SymbolIconsRegistry();
      ScreenerSectionView = class {
        constructor() {
          __privateAdd(this, _root4);
          __privateAdd(this, _screenerBody);
          __privateAdd(this, _allData, []);
          __privateAdd(this, _currentPage, 1);
          __privateAdd(this, _pageSize, 30);
          // Optional "Load More" button
          __privateAdd(this, _loadMoreBtn);
          this.title = "Screener";
          this.id = "screener";
          __privateSet(this, _root4, ViewHelper.getHtmlElementOrThrow(this.id));
          __privateSet(this, _screenerBody, ViewHelper.getHtmlElementOrThrow("screener-body"));
          __privateSet(this, _loadMoreBtn, document.createElement("button"));
          __privateGet(this, _loadMoreBtn).textContent = "Load more";
          __privateGet(this, _loadMoreBtn).className = "pill-button";
          __privateGet(this, _loadMoreBtn).style = "flex: 1 1 100%;text-align: center;";
          __privateGet(this, _loadMoreBtn).onclick = () => this.loadNextPage();
          __privateGet(this, _screenerBody).appendChild(__privateGet(this, _loadMoreBtn));
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
          __privateGet(this, _screenerBody).querySelectorAll(".screener-card").forEach((el) => el.remove());
          const start = 0;
          const end = __privateGet(this, _currentPage) * __privateGet(this, _pageSize);
          const pageData = __privateGet(this, _allData).slice(start, end);
          pageData.forEach((tp, index) => {
            const card = document.createElement("div");
            card.className = "screener-card";
            card.appendChild(this.generateCardInner(tp));
            __privateGet(this, _screenerBody).insertBefore(card, __privateGet(this, _loadMoreBtn));
          });
          if (end >= __privateGet(this, _allData).length) {
            __privateGet(this, _loadMoreBtn).style.display = "none";
          } else {
            __privateGet(this, _loadMoreBtn).style.display = "block";
          }
        }
        generateCardInner(tp) {
          const wrapper = document.createElement("div");
          const description = document.createElement("div");
          description.className = "asset-pair-description";
          const imagesHolder = document.createElement("div");
          imagesHolder.className = "asset-and-exchange-images-holder";
          const assetIconUrl = getSymbolSvgUrlById(tp.baseAsset, "generic");
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
          button.className = "icon-only-pill";
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
            var _a;
            (_a = document.scrollingElement) == null ? void 0 : _a.scrollTo(0, 0);
          });
        }
        show() {
          ViewHelper.toggleVisibility(__privateGet(this, _root4), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root4), false);
        }
      };
      _root4 = new WeakMap();
      _screenerBody = new WeakMap();
      _allData = new WeakMap();
      _currentPage = new WeakMap();
      _pageSize = new WeakMap();
      _loadMoreBtn = new WeakMap();
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
        static fromJson(json) {
          if (typeof json.name !== "string") {
            throw new Error("Invalid name");
          }
          if (typeof json.id !== "number") {
            throw new Error("Invalid id");
          }
          if (typeof json.include !== "boolean") {
            throw new Error("Invalid include flag");
          }
          return new _ExchangeInclusionCriteria(json.name, json.id, json.include);
        }
        toJson() {
          return {
            name: this.name,
            id: this.id,
            include: this.include
          };
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
  var ScreenerSettings;
  var init_ScreenerSettings = __esm({
    "ts_libs/ts_worker/application/exports/ScreenerSettings.ts"() {
      "use strict";
      init_ExchangeInclusionCriteria();
      ScreenerSettings = class _ScreenerSettings {
        constructor(exchangeInclusionCriterias) {
          this._parallelRequestsCount = 5;
          this._maximumPairsCountPerExchange = 1e3;
          this._exchangeInclusionCriterias = _ScreenerSettings.validateExchangeInclusionCriterias(exchangeInclusionCriterias);
        }
        // =====================
        // Getters / Setters
        // =====================
        get parallelRequestsCount() {
          return this._parallelRequestsCount;
        }
        set parallelRequestsCount(value) {
          if (typeof value !== "number" || value < 1 || value > 20) {
            throw new Error("Invalid parallelRequestsCount");
          }
          this._parallelRequestsCount = value;
        }
        get maximumPairsCountPerExchange() {
          return this._maximumPairsCountPerExchange;
        }
        set maximumPairsCountPerExchange(value) {
          if (typeof value !== "number" || value < 1 || value > 1e4) {
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
        // =====================
        // Factory
        // =====================
        static fromJson(json) {
          if (!Array.isArray(json.exchangeInclusionCriterias)) {
            throw new Error("exchangeInclusionCriterias must be an array");
          }
          const criterias = json.exchangeInclusionCriterias.map(
            (c) => ExchangeInclusionCriteria.fromJson(c)
          );
          const settings = new _ScreenerSettings(criterias);
          settings.parallelRequestsCount = json.parallelRequestsCount;
          settings.maximumPairsCountPerExchange = json.maximumPairsCountPerExchange;
          return settings;
        }
        // =====================
        // Serialization
        // =====================
        toJson() {
          return {
            parallelRequestsCount: this.parallelRequestsCount,
            maximumPairsCountPerExchange: this.maximumPairsCountPerExchange,
            exchangeInclusionCriterias: this.exchangeInclusionCriterias.map((c) => ({
              name: c.name,
              id: c.id,
              include: c.include
            }))
          };
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
          const clonedCriterias = this.exchangeInclusionCriterias.map((c) => c.deepClone());
          const newSettings = new _ScreenerSettings(clonedCriterias);
          newSettings.parallelRequestsCount = this.parallelRequestsCount;
          newSettings.maximumPairsCountPerExchange = this.maximumPairsCountPerExchange;
          return newSettings;
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
      };
    }
  });

  // ts_libs/ts_client/views/SettingsModalView.ts
  var _root5, _dismiss2, _apply2, _cancel2, _parallelRequestsCount, _maxPairsCount, _exchangeInclusions, _settings, _includeExchangesArea, _onSettingsChanged, SettingsModalView;
  var init_SettingsModalView = __esm({
    "ts_libs/ts_client/views/SettingsModalView.ts"() {
      "use strict";
      init_ScreenerSettings();
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
            const settingsFromView = this.tryGetSettingsFromView();
            if (__privateGet(this, _settings) && !settingsFromView.deepEquals(__privateGet(this, _settings))) {
              if (__privateGet(this, _onSettingsChanged)) {
                __privateGet(this, _onSettingsChanged).call(this, settingsFromView);
              }
            }
            this.hide();
          };
        }
        tryGetSettingsFromView() {
          const criterias = this.tryGetExchangeInclusionCriterias();
          const settings = new ScreenerSettings(criterias);
          settings.maximumPairsCountPerExchange = this.tryGetMaxPairsCount();
          settings.parallelRequestsCount = this.tryGetParallelRequestCount();
          return settings;
        }
        tryGetMaxPairsCount() {
          const maxPairsCount = Number.parseInt(__privateGet(this, _maxPairsCount).value);
          return maxPairsCount;
        }
        tryGetParallelRequestCount() {
          const parallelRequestsCount = Number.parseInt(__privateGet(this, _parallelRequestsCount).value);
          return parallelRequestsCount;
        }
        tryGetExchangeInclusionCriterias() {
          if (!__privateGet(this, _exchangeInclusions)) {
            throw new Error(`exchangeInclusions is not defined`);
          }
          if (!__privateGet(this, _settings)) {
            throw new Error(`settings is not defined`);
          }
          var clonedCriterias = __privateGet(this, _settings).exchangeInclusionCriterias.map((e) => e.deepClone());
          clonedCriterias.forEach((c) => {
            var _a;
            var found = (_a = __privateGet(this, _exchangeInclusions)) == null ? void 0 : _a.find((e) => c.name === e.getAttribute("data-exchange-name"));
            if (found) {
              c.include = found.checked;
            }
          });
          return clonedCriterias;
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
          var _a;
          __privateSet(this, _settings, (_a = model.getScreenerSettings()) == null ? void 0 : _a.deepClone());
          if (void 0 === __privateGet(this, _settings)) {
            throw new Error("MainModel does not have ScreenerSettings");
          }
          __privateGet(this, _parallelRequestsCount).value = __privateGet(this, _settings).parallelRequestsCount.toString();
          __privateGet(this, _maxPairsCount).value = __privateGet(this, _settings).maximumPairsCountPerExchange.toString();
          __privateGet(this, _includeExchangesArea).innerHTML = "";
          __privateSet(this, _exchangeInclusions, []);
          __privateGet(this, _settings).exchangeInclusionCriterias.forEach((criteria) => {
            var _a2;
            var cb = document.createElement("input");
            cb.setAttribute("type", "checkbox");
            cb.setAttribute("data-exchange-name", criteria.name);
            cb.checked = criteria.include;
            var label = document.createElement("label");
            label.classList.add("checkbox-label");
            label.appendChild(cb);
            label.appendChild(document.createTextNode(criteria.name));
            __privateGet(this, _includeExchangesArea).appendChild(label);
            (_a2 = __privateGet(this, _exchangeInclusions)) == null ? void 0 : _a2.push(cb);
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

  // ts_libs/ts_client/views/SortModalView.ts
  var _root6, _dismiss3, _ascending, _descending, _apply3, _fields2, _transientDirection, _transientSortKey, _sortByButtons, _onSortingRulesChanged, SortModalView;
  var init_SortModalView = __esm({
    "ts_libs/ts_client/views/SortModalView.ts"() {
      "use strict";
      init_ViewHelper();
      init_SortDirection();
      SortModalView = class {
        constructor() {
          __privateAdd(this, _root6);
          __privateAdd(this, _dismiss3);
          __privateAdd(this, _ascending);
          __privateAdd(this, _descending);
          __privateAdd(this, _apply3);
          __privateAdd(this, _fields2);
          __privateAdd(this, _transientDirection, null);
          __privateAdd(this, _transientSortKey, null);
          __privateAdd(this, _sortByButtons, null);
          __privateAdd(this, _onSortingRulesChanged);
          __privateSet(this, _root6, ViewHelper.getHtmlElementOrThrow("sort-fields-modal"));
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
            button.classList.add("filter-button");
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
          ViewHelper.toggleVisibility(__privateGet(this, _root6), true);
        }
        hide() {
          ViewHelper.toggleVisibility(__privateGet(this, _root6), false);
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
      _root6 = new WeakMap();
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
  var _root7, _startButton, _settingsButton, _startButtonText, StartSectionView;
  var init_StartSectionView = __esm({
    "ts_libs/ts_client/views/StartSectionView.ts"() {
      "use strict";
      init_ViewHelper();
      StartSectionView = class {
        constructor() {
          __privateAdd(this, _root7);
          __privateAdd(this, _startButton);
          __privateAdd(this, _settingsButton);
          __privateAdd(this, _startButtonText);
          this.title = "Start";
          this.id = "start";
          __privateSet(this, _root7, ViewHelper.getHtmlElementOrThrow(this.id));
          __privateSet(this, _startButton, ViewHelper.getButtonOrThrow("start-btn"));
          __privateSet(this, _startButtonText, ViewHelper.getSpanOrThrow("start-btn-text"));
          __privateSet(this, _settingsButton, ViewHelper.getButtonOrThrow("settings-btn"));
        }
        hasExternalActions() {
          return false;
        }
        show() {
          __privateGet(this, _root7).classList.remove("d-none");
        }
        hide() {
          __privateGet(this, _root7).classList.add("d-none");
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
              __privateGet(this, _startButtonText).classList.remove("d-none");
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
      _root7 = new WeakMap();
      _startButton = new WeakMap();
      _settingsButton = new WeakMap();
      _startButtonText = new WeakMap();
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
          this.screenerSection.hide();
          this.navigation.hide();
          this.sortModalView.hide();
          this.settingsModalView.hide();
          this.progressModalView.hide();
          this.filterModalView.hide();
          this.aboutSection.hide();
          this.startSection.show();
          this.sections = [this.startSection, this.screenerSection, this.aboutSection];
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

  // ts_libs/ts_worker/application/exports/NamedAttribute.ts
  var NamedAttributeMetadata, NumericNamedAttribute, BooleanNamedAttribute, StringNamedAttribute;
  var init_NamedAttribute = __esm({
    "ts_libs/ts_worker/application/exports/NamedAttribute.ts"() {
      "use strict";
      NamedAttributeMetadata = class {
        constructor(key, label, type) {
          this.key = key;
          this.label = label;
          this.type = type;
        }
      };
      NumericNamedAttribute = class _NumericNamedAttribute {
        constructor(key, label, value, precision) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.precision = precision;
          this.metadata = new NamedAttributeMetadata(key, label, "number");
          if (value !== void 0 && !Number.isFinite(value)) {
            throw new Error("NumericNamedAttribute requires a finite number");
          }
          if (precision !== void 0 && (!Number.isInteger(precision) || precision < 0)) {
            throw new Error("precision must be a non-negative integer");
          }
        }
        static fromMetadata(argMetadata, argValue, argPrecision) {
          if (argMetadata.type !== "number") {
            throw new Error("NumericNamedAttribute requires a valid metadata type");
          }
          return new _NumericNamedAttribute(argMetadata.key, argMetadata.label, argValue, argPrecision);
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
          return this.precision === void 0 ? this.value.toString() : this.value.toFixed(this.precision);
        }
      };
      BooleanNamedAttribute = class _BooleanNamedAttribute {
        constructor(key, label, value) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.metadata = new NamedAttributeMetadata(key, label, "boolean");
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
      StringNamedAttribute = class {
        constructor(key, label, value) {
          this.key = key;
          this.label = label;
          this.value = value;
          this.metadata = new NamedAttributeMetadata(key, label, "string");
          if (value !== void 0 && value.length === 0) {
            throw new Error("StringNamedAttribute cannot be empty");
          }
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
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairModel.ts
  var TradingPairModel;
  var init_TradingPairModel = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairModel.ts"() {
      "use strict";
      init_NamedAttribute();
      TradingPairModel = class {
        constructor(baseAsset, quoteAsset, exchangeName, exchangeId, price, exchangeUrl) {
          this.baseAsset = baseAsset;
          this.quoteAsset = quoteAsset;
          this.exchangeName = exchangeName;
          this.exchangeId = exchangeId;
          this.price = price;
          this.exchangeUrl = exchangeUrl;
          this.extended = [];
          Object.freeze(this);
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
        static dailyPercentChangeMetadata() {
          return new NamedAttributeMetadata("daily_percent_change", "Daily change %", "number");
        }
        static currentPriceMetadata() {
          return new NamedAttributeMetadata("price", "Price", "number");
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
      init_TradingPairModel();
      MainModel = class {
        constructor() {
          this.multiTimeFrameSnapshot = [];
          this.sortableAttributes = [];
          this.filterableAttributes = [];
          this.sortDirection = 1 /* Descending */;
          this.sortNamedAttributeMetadata = TradingPairModel.dailyPercentChangeMetadata();
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
        getMultiTimeFrameSnapshot() {
          return this.multiTimeFrameSnapshot;
        }
        getSortDirection() {
          return this.sortDirection;
        }
        getSortNamedAttributeMetadata() {
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
      };
    }
  });

  // ts_libs/ts_worker/application/exports/TradingPairsCodec.ts
  var TradingPairsCodec;
  var init_TradingPairsCodec = __esm({
    "ts_libs/ts_worker/application/exports/TradingPairsCodec.ts"() {
      "use strict";
      init_NamedAttribute();
      init_TradingPairModel();
      TradingPairsCodec = class {
        /** Serialize array of TradingPairModel to JSON string */
        static toJsonString(tradingPairs) {
          const dto = tradingPairs.map((tp) => ({
            baseAsset: tp.baseAsset,
            quoteAsset: tp.quoteAsset,
            exchangeName: tp.exchangeName,
            exchangeId: tp.exchangeId,
            exchangeUrl: tp.exchangeUrl,
            price: tp.price,
            extended: tp.getAttributes().map((attr) => {
              var _a;
              return {
                key: attr.metadata.key,
                label: attr.metadata.label,
                type: attr.metadata.type,
                value: attr.value,
                precision: (_a = attr.precision) != null ? _a : void 0
              };
            })
          }));
          return JSON.stringify(dto);
        }
        static extractUniqueSortableAttributes(tradingPairs) {
          const toReturn = [];
          const count = Math.min(10, tradingPairs.length);
          for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getNumericAttributes();
            for (let j = 0; j < attrs.length; j++) {
              const meta = attrs[j].metadata;
              const metaKey = meta.key;
              const isNew = !toReturn.some((s) => s.key === metaKey);
              if (isNew) {
                toReturn.push(meta);
              }
            }
          }
          return toReturn;
        }
        static extractUniqueFilterableAttributes(tradingPairs) {
          const toReturn = [];
          const count = Math.min(10, tradingPairs.length);
          for (let i = 0; i < count; i++) {
            const attrs = tradingPairs[i].getBooleanAttributes();
            for (let j = 0; j < attrs.length; j++) {
              const meta = attrs[j].metadata;
              const metaKey = meta.key;
              const isNew = !toReturn.some((s) => s.key === metaKey);
              if (isNew) {
                toReturn.push(meta);
              }
            }
          }
          return toReturn;
        }
        /** Deserialize from JSON string to array of TradingPairModel */
        static fromJsonString(buffer) {
          const dtoArray = JSON.parse(buffer);
          return dtoArray.map((dto) => {
            var _a;
            const model = new TradingPairModel(
              dto.baseAsset,
              dto.quoteAsset,
              dto.exchangeName,
              dto.exchangeId,
              dto.price,
              dto.exchangeUrl
            );
            for (const attrDto of dto.extended) {
              let attr;
              switch (attrDto.type) {
                case "number":
                  attr = new NumericNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    attrDto.value,
                    attrDto.precision
                  );
                  break;
                case "string":
                  attr = new StringNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    attrDto.value
                  );
                  break;
                case "boolean":
                  attr = new BooleanNamedAttribute(
                    attrDto.key,
                    attrDto.label,
                    (_a = attrDto.value) != null ? _a : false
                  );
                  break;
                default:
                  throw new Error(`Type conversion failed for ${attrDto.type} -> ${attrDto.key}`);
              }
              model.addAttr(attr);
            }
            return model;
          });
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
      init_TradingPairsCodec();
      init_SortDirection();
      init_TradingPairModel();
      init_ScreenerSettings();
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
          __privateGet(this, _mainView).navigation.bindSyncButton(() => __async(this, null, function* () {
            return yield this.synchronize();
          }));
          __privateGet(this, _mainView).navigation.bindSortButton(() => this.showSortModal());
          __privateGet(this, _mainView).navigation.bindFilterButton(() => this.showFilterModal());
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
            const response = ScreenerSettings.fromJson(rawResponse);
            const localStorageString = localStorage.getItem("ScreenerSettings") || "{}";
            try {
              var settings = ScreenerSettings.fromJson(JSON.parse(localStorageString));
              __privateGet(this, _mainModel).setScreenerSettings(settings);
            } catch (err) {
              console.log(err);
              __privateGet(this, _mainModel).setScreenerSettings(response);
            }
            __privateGet(this, _mainView).startSection.disableActions(false);
          });
        }
        applySettings(aSettings) {
          __privateGet(this, _mainModel).setScreenerSettings(aSettings);
          localStorage.setItem("ScreenerSettings", JSON.stringify(aSettings.toJson()));
        }
        fetch() {
          return __async(this, null, function* () {
            var _a;
            __privateGet(this, _mainView).progressModalView.show("Fetching market data ...");
            const handler = (data) => __privateGet(this, _mainView).progressModalView.updateProgressFromWorker(data);
            this.on("fetch:progress", handler);
            const rawResponse = yield this.callWorker("fetch", (_a = __privateGet(this, _mainModel).getScreenerSettings()) == null ? void 0 : _a.toJson());
            this.off("fetch:progress", handler);
            const mappedResponse = TradingPairsCodec.fromJsonString(rawResponse);
            const sortableAttributes = TradingPairsCodec.extractUniqueSortableAttributes(mappedResponse);
            const filterableAttributes = TradingPairsCodec.extractUniqueFilterableAttributes(mappedResponse);
            const sortDirection = 1 /* Descending */;
            const sortFieldMetadata = TradingPairModel.dailyPercentChangeMetadata();
            const sorted = _ThinController.doFilteringAndSortingCore(mappedResponse, sortDirection, sortFieldMetadata.key, __privateGet(this, _mainModel).getActiveFilterableAttributes());
            __privateGet(this, _mainModel).setSortableAttributes(sortableAttributes);
            __privateGet(this, _mainModel).setFilterableAttributes(filterableAttributes);
            __privateGet(this, _mainModel).setMultiTimeFrameSnapshot(sorted);
            __privateGet(this, _mainModel).setSortDirection(sortDirection);
            __privateGet(this, _mainModel).setSortNamedAttributeMetadata(sortFieldMetadata);
            __privateGet(this, _mainView).screenerSection.setData(sorted);
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
            const rawResponse = yield this.callWorker("synchronize", (_a = __privateGet(this, _mainModel).getScreenerSettings()) == null ? void 0 : _a.toJson());
            this.off("synchronize:progress", handler);
            const mappedResponse = TradingPairsCodec.fromJsonString(rawResponse);
            const sorted = _ThinController.doFilteringAndSortingCore(mappedResponse, __privateGet(this, _mainModel).getSortDirection(), __privateGet(this, _mainModel).getSortNamedAttributeMetadata().key, __privateGet(this, _mainModel).getActiveFilterableAttributes());
            __privateGet(this, _mainModel).setMultiTimeFrameSnapshot(mappedResponse);
            __privateGet(this, _mainView).screenerSection.setData(sorted);
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

  // ts_libs/ts_client/controllers/ThinServiceWorkerController.ts
  var ThinServiceWorkerController;
  var init_ThinServiceWorkerController = __esm({
    "ts_libs/ts_client/controllers/ThinServiceWorkerController.ts"() {
      "use strict";
      ThinServiceWorkerController = class _ThinServiceWorkerController {
        constructor() {
          this.registration = null;
          this.hasReloaded = false;
        }
        static Create(swPath = "sw.js") {
          return __async(this, null, function* () {
            const controller = new _ThinServiceWorkerController();
            yield controller.init(swPath);
            controller.onUpdateCallback = () => {
              const ok = confirm("New version available. Reload now?");
              if (ok) {
                controller.forceUpdateCheck();
              }
            };
            controller.onActivatedCallback = () => {
              console.log("App updated");
            };
            return controller;
          });
        }
        init(swPath) {
          return __async(this, null, function* () {
            if (!("serviceWorker" in navigator)) return;
            this.registration = yield navigator.serviceWorker.register(swPath);
            yield navigator.serviceWorker.ready;
            this.registration.update();
            this.registerUpdateListeners();
          });
        }
        registerUpdateListeners() {
          if (!this.registration) return;
          this.registration.addEventListener("updatefound", () => {
            var _a;
            const newWorker = (_a = this.registration) == null ? void 0 : _a.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                this.onUpdateAvailable();
              }
            });
          });
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            this.onActivated();
          });
        }
        onUpdateAvailable() {
          var _a;
          console.log("[SW] Update available");
          (_a = this.onUpdateCallback) == null ? void 0 : _a.call(this);
        }
        onActivated() {
          var _a;
          console.log("[SW] Activated new version");
          if (this.hasReloaded) return;
          this.hasReloaded = true;
          (_a = this.onActivatedCallback) == null ? void 0 : _a.call(this);
          window.location.reload();
        }
        forceUpdateCheck() {
          return __async(this, null, function* () {
            var _a;
            yield (_a = this.registration) == null ? void 0 : _a.update();
          });
        }
      };
    }
  });

  // ts_libs/ts_client/index.ts
  var require_index = __commonJS({
    "ts_libs/ts_client/index.ts"(exports) {
      init_ThinController();
      init_ThinServiceWorkerController();
      document.addEventListener("DOMContentLoaded", () => __async(null, null, function* () {
        yield ThinServiceWorkerController.Create("sw.js").catch(console.error);
        yield ThinController.Create("js/worker/worker.js").catch(console.error);
      }));
    }
  });
  require_index();
})();
//# sourceMappingURL=bundle.js.map
