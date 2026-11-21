(() => {
  const ACCEPT_STORAGE_KEY = "baowang_prd_accept_v1";

  const VERSION_GROUPS = [
    {
      version: "V1.0.0",
      title: "编号抽奖活动与博主推广结算",
      subtitle: "博主推广免费领号抽奖、渠道归因与结算对账",
      project: "包网",
      createdAt: "2026-11-18",
      updatedAt: "2026-11-21",
      dueAt: "",
      items: [
        {
          id: "01",
          version: "V1.0.0",
          name: "[H5端] 编号抽奖活动页（本田 Fan 160 2025）",
          project: "包网",
          client: "H5",
          createdAt: "2026-11-18",
          updatedAt: "2026-11-21",
          dueAt: "",
          url: "h5.html",
          hasPrototype: true
        },
        {
          id: "02",
          version: "V1.0.0",
          name: "[站点后台] 编号抽奖活动管理与博主推广结算",
          project: "包网",
          client: "站点后台",
          createdAt: "2026-11-18",
          updatedAt: "2026-11-21",
          dueAt: "",
          url: "admin.html",
          hasPrototype: true
        }
      ]
    }
  ];

  const ACCEPTANCE_RULES = [
    {
      code: "R01",
      title: "注册跳转与账号同步",
      client: "H5",
      url: "h5.html",
      desc: "未登录点击「立即锁定号码」进入平台前台注册/登录页；取消或失败不产生有效注册，完成注册后携带活动与博主标识回跳锁号。"
    },
    {
      code: "R02",
      title: "号码发放、防重与我的号码查询",
      client: "H5 / 站点后台",
      url: "h5.html",
      desc: "支持手动选号与系统随机分配；用户端展示号码、账号、账号ID（支持复制）、获得时间及待开奖/中奖状态；后台支持按期次/账号ID/号码查询与作废留痕。"
    },
    {
      code: "R03",
      title: "活动进度展示与满额锁池",
      client: "H5 / 站点后台",
      url: "admin.html#activities",
      desc: "进度 = 有效号码数 ÷ 可发放总数，未满额不进位为 100%；达到 100% 自动停发并锁定有效号码清单进入待开奖。"
    },
    {
      code: "R04",
      title: "开奖触发与结果公示",
      client: "站点后台",
      url: "admin.html#tickets",
      desc: "状态流转：草稿 → 进行中 → 待开奖 → 已开奖；未满足条件不可开奖，重复触发沿用既有结果，后台保留规则版本与操作记录。"
    },
    {
      code: "R05",
      title: "后台配置、冻结版本与角色权限",
      client: "站点后台",
      url: "admin.html#activities",
      desc: "支持活动基础、号码与开奖、博主渠道、结算模块配置；发布校验必填与时间合法性，越权角色不可执行开奖或财务确认付款。"
    },
    {
      code: "R06",
      title: "博主渠道归因与去重",
      client: "站点后台",
      url: "admin.html#channels",
      desc: "博主专属链接绑定活动与渠道，区分点击量/注册成功量/有效注册量；窗口内末次有效归因，同一账号仅计一次，老账号登录不计新增。"
    },
    {
      code: "R07",
      title: "博主推广结算与财务对账",
      client: "站点后台",
      url: "admin.html#settlement",
      desc: "结算单状态：待核对 → 已确认 → 已付款；确认后锁定明细与费率版本，支持有原因调整记录、付款凭证登记及 CSV 导出。"
    }
  ];

  // 状态
  const collapsedVersions = new Set();
  const state = {
    project: "all",
    client: "all",
    createdYear: "",
    createdMonth: "",
    createdDay: "",
    updatedYear: "",
    updatedMonth: "",
    updatedDay: "",
    dueYear: "",
    dueMonth: "",
    dueDay: "",
    keyword: ""
  };

  // DOM
  const navListBtn = document.getElementById("navListBtn");
  const navAcceptBtn = document.getElementById("navAcceptBtn");
  const viewList = document.getElementById("viewList");
  const viewAcceptance = document.getElementById("viewAcceptance");

  const countSummary = document.getElementById("countSummary");
  const reqTableBody = document.getElementById("reqTableBody");
  const filterProject = document.getElementById("filterProject");
  const clientPills = document.getElementById("clientPills");
  const searchInput = document.getElementById("searchInput");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  const dateInputs = {
    createdYear: document.getElementById("createdYear"),
    createdMonth: document.getElementById("createdMonth"),
    createdDay: document.getElementById("createdDay"),
    updatedYear: document.getElementById("updatedYear"),
    updatedMonth: document.getElementById("updatedMonth"),
    updatedDay: document.getElementById("updatedDay"),
    dueYear: document.getElementById("dueYear"),
    dueMonth: document.getElementById("dueMonth"),
    dueDay: document.getElementById("dueDay")
  };

  const acceptList = document.getElementById("acceptList");
  const acceptProgressText = document.getElementById("acceptProgressText");

  function matchDateParts(dateStr, y, m, d) {
    if (!y && !m && !d) return true;
    if (!dateStr) return false;
    const [yy, mm, dd] = dateStr.split("-");
    if (y && yy !== y) return false;
    if (m && mm !== m) return false;
    if (d && dd !== d) return false;
    return true;
  }

  function filterItem(item, group) {
    if (state.project !== "all" && item.project !== state.project) return false;
    if (state.client !== "all" && item.client !== state.client) return false;
    if (!matchDateParts(item.createdAt, state.createdYear, state.createdMonth, state.createdDay)) return false;
    if (!matchDateParts(item.updatedAt, state.updatedYear, state.updatedMonth, state.updatedDay)) return false;
    if (!matchDateParts(item.dueAt, state.dueYear, state.dueMonth, state.dueDay)) return false;

    if (state.keyword) {
      const kw = state.keyword.toLowerCase();
      const hay = `${item.version} ${item.name} ${group.title} ${group.subtitle} ${item.client} ${item.project}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  }

  function renderTable() {
    const totalCount = VERSION_GROUPS.reduce((sum, g) => sum + g.items.length, 0);
    let visibleCount = 0;
    const rowsHtml = [];

    VERSION_GROUPS.forEach((group) => {
      const matchedItems = group.items.filter((item) => filterItem(item, group));
      if (matchedItems.length === 0) return;

      visibleCount += matchedItems.length;
      const isCollapsed = collapsedVersions.has(group.version);
      const uniqueClients = Array.from(new Set(matchedItems.map((i) => i.client)));

      rowsHtml.push(`
        <tr class="group-row ${isCollapsed ? "is-collapsed" : ""}" data-version-toggle="${group.version}">
          <td>
            <span class="ver-toggle-wrap">
              <span class="ver-chevron" aria-hidden="true">▾</span>
              <span>${group.version}</span>
            </span>
          </td>
          <td>
            <span class="group-title">${group.title}</span>
            <span class="group-desc">${group.subtitle}</span>
          </td>
          <td><span class="tag tag-proj">${group.project}</span></td>
          <td>
            <div class="client-tags">
              ${uniqueClients.map((c) => `<span class="tag tag-client">${c}</span>`).join("")}
            </div>
          </td>
          <td class="date-cell">${group.createdAt}</td>
          <td class="date-cell">${group.updatedAt}</td>
          <td class="date-cell">${group.dueAt || ""}</td>
        </tr>
      `);

      matchedItems.forEach((item) => {
        rowsHtml.push(`
          <tr class="item-row" data-url="${item.url}" ${isCollapsed ? "hidden" : ""}>
            <td><span class="child-ver">${item.version}</span></td>
            <td>
              <div class="item-name-cell">
                <span class="item-index">${item.id}</span>
                <a class="item-link" href="${item.url}">${item.name}</a>
                ${item.hasPrototype ? '<span class="tag tag-proto">原型</span>' : ""}
              </div>
            </td>
            <td><span class="tag tag-proj">${item.project}</span></td>
            <td><span class="tag tag-client">${item.client}</span></td>
            <td class="date-cell">${item.createdAt}</td>
            <td class="date-cell">${item.updatedAt}</td>
            <td class="date-cell">${item.dueAt || ""}</td>
          </tr>
        `);
      });
    });

    countSummary.textContent = `展示 ${visibleCount} / 共 ${totalCount} 条`;

    if (rowsHtml.length === 0) {
      reqTableBody.innerHTML = `<tr class="empty-row"><td colspan="7">未找到匹配的需求条目，请调整筛选条件或点击「重置」。</td></tr>`;
      return;
    }

    reqTableBody.innerHTML = rowsHtml.join("");

    reqTableBody.querySelectorAll("[data-version-toggle]").forEach((row) => {
      row.addEventListener("click", () => {
        const ver = row.dataset.versionToggle;
        if (collapsedVersions.has(ver)) collapsedVersions.delete(ver);
        else collapsedVersions.add(ver);
        renderTable();
      });
    });

    reqTableBody.querySelectorAll(".item-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        window.location.href = row.dataset.url;
      });
    });
  }

  // 筛选事件
  filterProject.addEventListener("change", () => {
    state.project = filterProject.value;
    renderTable();
  });

  clientPills.querySelectorAll(".pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      clientPills.querySelectorAll(".pill-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.client = btn.dataset.client;
      renderTable();
    });
  });

  Object.entries(dateInputs).forEach(([key, el]) => {
    el.addEventListener("change", () => {
      state[key] = el.value;
      renderTable();
    });
  });

  searchInput.addEventListener("input", () => {
    state.keyword = searchInput.value.trim();
    renderTable();
  });

  resetFilterBtn.addEventListener("click", () => {
    state.project = "all";
    state.client = "all";
    state.keyword = "";
    filterProject.value = "all";
    searchInput.value = "";
    clientPills.querySelectorAll(".pill-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.client === "all");
    });
    Object.entries(dateInputs).forEach(([key, el]) => {
      state[key] = "";
      el.value = "";
    });
    renderTable();
  });

  // 顶部视图切换：需求清单 / 版本验收
  function switchView(view) {
    const isList = view === "list";
    navListBtn.classList.toggle("is-active", isList);
    navAcceptBtn.classList.toggle("is-active", !isList);
    viewList.hidden = !isList;
    viewAcceptance.hidden = isList;
  }

  navListBtn.addEventListener("click", () => switchView("list"));
  navAcceptBtn.addEventListener("click", () => switchView("acceptance"));

  // 版本验收渲染
  function loadAcceptState() {
    try {
      return JSON.parse(localStorage.getItem(ACCEPT_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveAcceptState(map) {
    try {
      localStorage.setItem(ACCEPT_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // ignore
    }
  }

  function renderAcceptance() {
    const checkedMap = loadAcceptState();
    const doneCount = ACCEPTANCE_RULES.filter((r) => checkedMap[r.code]).length;
    acceptProgressText.textContent = `已完成 ${doneCount} / ${ACCEPTANCE_RULES.length} 项`;

    acceptList.innerHTML = ACCEPTANCE_RULES.map((rule) => {
      const done = Boolean(checkedMap[rule.code]);
      return `
        <div class="accept-item ${done ? "is-done" : ""}">
          <label class="accept-item-left">
            <input type="checkbox" class="accept-checkbox" data-accept-code="${rule.code}" ${done ? "checked" : ""} />
            <div>
              <div class="accept-item-title">${rule.code} · ${rule.title}</div>
              <div class="accept-item-desc">${rule.desc}</div>
            </div>
          </label>
          <div class="accept-item-right">
            <span class="tag tag-client">${rule.client}</span>
            <a class="accept-jump-link" href="${rule.url}">去验证 ↗</a>
          </div>
        </div>
      `;
    }).join("");

    acceptList.querySelectorAll("[data-accept-code]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const next = loadAcceptState();
        next[cb.dataset.acceptCode] = cb.checked;
        saveAcceptState(next);
        renderAcceptance();
      });
    });
  }

  renderTable();
  renderAcceptance();
})();
