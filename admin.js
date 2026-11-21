(() => {
  const H5_RECORDS_KEY = "fan160_prd_records_v2";
  const BASE_ISSUED = 53000;

  // 活动列表数据（首条为我们本期核心「站外抽奖」活动，其余还原真实站点活动中心样本）
  let activities = [
    {
      id: 120088,
      name: "本田 Fan 160 2025（第1期）",
      category: "站外抽奖",
      currency: "BRL",
      type: "抽奖",
      formType: "站外抽奖",
      condition: "需登录平台账号 · 免费领号",
      level: "不限制",
      vip: "不限制",
      tag: "不限制",
      audit: "1.00",
      terminal: "H5_WEB(活动落地页), Android_APP, ...",
      banner: "assets/fan-160-hero.jpg",
      dispatchMode: "人工触发开奖",
      startTime: "2026-11-18",
      endTime: "2026-12-18",
      showStart: "2026-11-18",
      showEnd: "2026-12-18",
      status: "进行中",
      operator: "Cooper",
      operateTime: "2026-11-21 15:20:00",
      round: "第1期",
      sponsor: "塔瓦雷斯活动方",
      numStart: "000001",
      numEnd: "100000",
      digits: 6,
      totalPool: 100000,
      simulatedFull: false,
      winningNumber: "",
      prizes: [
        { name: "一等奖", content: "2025款 本田 Fan 160 摩托车", qty: 1 },
        { name: "2等奖", content: "现金幸运奖 ¥500", qty: 8 },
        { name: "3等奖", content: "平台专属体验彩金", qty: 20 }
      ],
      kols: [
        { code: "B0001", name: "Tavares 44 官方主号", status: "启用", start: "2026-11-18", end: "2026-12-18" },
        { code: "B0002", name: "巴西机车测评社", status: "启用", start: "2026-11-18", end: "2026-12-18" }
      ],
      unitRate: 12.5,
      isCoreLottery: true
    },
    {
      id: 1029,
      name: "ash打码",
      category: "综合",
      currency: "BRL,USD",
      type: "打码",
      formType: "站内活动",
      condition: "每日打码",
      level: "默认层级,首充玩家",
      vip: "VIP0,VIP1",
      tag: "不限制",
      audit: "1.00",
      terminal: "iOS_APP(iOS描述签), Android_APP(极速APP), ...",
      banner: "",
      dispatchMode: "玩家自领-过期作废",
      startTime: "2026-10-29",
      endTime: "2026-11-30",
      showStart: "2026-10-29",
      showEnd: "2026-11-30",
      status: "进行中",
      operator: "Elaine01",
      operateTime: "2026-11-12 07:39:26"
    },
    {
      id: 120014,
      name: "新人彩金-ash",
      category: "综合",
      currency: "BRL",
      type: "新人彩金",
      formType: "站内活动",
      condition: "无条件参与",
      level: "不限制",
      vip: "不限制",
      tag: "不限制",
      audit: "1.00",
      terminal: "iOS_APP(iOS描述签), Android_APP(极速APP), ...",
      banner: "",
      dispatchMode: "-",
      startTime: "2026-11-18",
      endTime: "2026-11-28",
      showStart: "2026-11-18",
      showEnd: "2026-11-28",
      status: "进行中",
      operator: "ash6",
      operateTime: "2026-11-18 22:16:07"
    },
    {
      id: 90820,
      name: "今日累计投注",
      category: "测试活动",
      currency: "所有币种",
      type: "红包",
      formType: "站内活动",
      condition: "无条件",
      level: "不限制",
      vip: "不限制",
      tag: "不限制",
      audit: "1.00",
      terminal: "iOS_APP(iOS描述签), Android_APP(极速APP), ...",
      banner: "",
      dispatchMode: "不适用",
      startTime: "不限",
      endTime: "",
      showStart: "不限",
      showEnd: "",
      status: "进行中",
      operator: "lio6",
      operateTime: "2026-11-12 23:45:45"
    },
    {
      id: 90618,
      name: "单笔分多期派发",
      category: "综合",
      currency: "所有币种",
      type: "充值",
      formType: "站内活动",
      condition: "单笔充值",
      level: "不限制",
      vip: "不限制",
      tag: "不限制",
      audit: "1.00",
      terminal: "iOS_APP(iOS描述签), Android_APP(极速APP), ...",
      banner: "",
      dispatchMode: "系统立即自动派发",
      startTime: "不限",
      endTime: "",
      showStart: "不限",
      showEnd: "",
      status: "进行中",
      operator: "mark05",
      operateTime: "2026-11-09 05:24:21"
    },
    {
      id: 60619,
      name: "QA救援金_TC12_每周",
      category: "测试活动",
      currency: "所有币种",
      type: "救援金",
      formType: "站内活动",
      condition: "每周救援金",
      level: "不限制",
      vip: "不限制",
      tag: "不限制",
      audit: "1.00",
      terminal: "iOS_APP(iOS描述签), Android_APP(极速APP), ...",
      banner: "",
      dispatchMode: "玩家自领-过期作废",
      startTime: "2026-11-12",
      endTime: "2027-11-30",
      showStart: "2026-11-12",
      showEnd: "2027-11-30",
      status: "已关闭",
      operator: "mark05",
      operateTime: "2026-11-12 00:34:36"
    }
  ];

  // 结算单数据（PRD R07）
  let settlements = [
    {
      id: "SET-202611-01",
      kolCode: "B0001",
      kolName: "Tavares 44 官方主号",
      period: "2026-11-01 ~ 2026-11-30",
      rateVer: "RATE-v1.0",
      unitRate: 12.5,
      validReg: 1420,
      excluded: 158,
      adjust: 0,
      status: "待核对",
      voucher: ""
    },
    {
      id: "SET-202611-02",
      kolCode: "B0002",
      kolName: "巴西机车测评社",
      period: "2026-11-01 ~ 2026-11-30",
      rateVer: "RATE-v1.0",
      unitRate: 11.0,
      validReg: 680,
      excluded: 74,
      adjust: -220,
      status: "已确认",
      voucher: ""
    },
    {
      id: "SET-202610-09",
      kolCode: "B0001",
      kolName: "Tavares 44 官方主号",
      period: "2026-10-01 ~ 2026-10-31",
      rateVer: "RATE-v0.9",
      unitRate: 10.0,
      validReg: 950,
      excluded: 61,
      adjust: 0,
      status: "已付款",
      voucher: "PIX-20261105-8841"
    }
  ];

  const SEED_TICKETS = [
    {
      recordId: "REC-20261121-001",
      accountId: "UID_880123",
      phone: "13800138000",
      nickname: "李明宇",
      number: "052818",
      mode: "手动选择号码",
      status: "有效",
      drawStatus: "待开奖",
      kolId: "KOL_Tavares44",
      createdAt: "2026-11-21 13:45:12"
    },
    {
      recordId: "REC-20261120-019",
      accountId: "UID_774512",
      phone: "13900012233",
      nickname: "陈杰森",
      number: "668427",
      mode: "系统随机分配",
      status: "有效",
      drawStatus: "待开奖",
      kolId: "KOL_Tavares44",
      createdAt: "2026-11-20 19:22:08"
    }
  ];

  // 状态
  let currentSubtab = "active"; // active | closed | stats | categories
  let selectedTypeChip = "抽奖";
  let formPrizes = [];
  let formKols = [];
  let selectedBannerSrc = "assets/fan-160-hero.jpg";
  let toastTimer = null;

  // DOM
  const activityTableBody = document.getElementById("activityTableBody");
  const activityTableWrap = document.getElementById("activityTableWrap");
  const activityFilterToolbar = document.getElementById("activityFilterToolbar");
  const activityPagination = document.getElementById("activityPagination");
  const statsSubpanel = document.getElementById("statsSubpanel");
  const categoriesSubpanel = document.getElementById("categoriesSubpanel");
  const totalCountText = document.getElementById("totalCountText");
  const selectedCountText = document.getElementById("selectedCountText");

  const filterCategory = document.getElementById("filterCategory");
  const filterType = document.getElementById("filterType");
  const filterKeyword = document.getElementById("filterKeyword");
  const filterStatus = document.getElementById("filterStatus");

  const prizeRowsContainer = document.getElementById("prizeRowsContainer");
  const kolChannelsFormList = document.getElementById("kolChannelsFormList");
  const cfgRuleTextarea = document.getElementById("cfgRuleTextarea");
  const ruleCharCounter = document.getElementById("ruleCharCounter");
  const bannerPreviewImg = document.getElementById("bannerPreviewImg");
  const previewLangBadge = document.getElementById("previewLangBadge");
  const erpToast = document.getElementById("erpToast");

  function showToast(msg) {
    erpToast.textContent = msg;
    erpToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      erpToast.hidden = true;
    }, 2500);
  }

  function nowStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
      d.getMinutes()
    )}:${p(d.getSeconds())}`;
  }

  function loadMergedTickets() {
    let h5 = [];
    try {
      const raw = localStorage.getItem(H5_RECORDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) h5 = parsed;
      }
    } catch {
      h5 = [];
    }
    const map = new Map();
    h5.forEach((r) => map.set(r.recordId, { ...r, drawStatus: r.drawStatus || "待开奖" }));
    SEED_TICKETS.forEach((r) => {
      if (!map.has(r.recordId)) map.set(r.recordId, { ...r });
    });
    return Array.from(map.values());
  }

  function saveMergedTickets(list) {
    try {
      localStorage.setItem(H5_RECORDS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  // ===========================
  // 1. 活动列表表格渲染
  // ===========================
  function getStatusClass(st) {
    if (st === "进行中") return "status-txt--running";
    if (st === "待开奖") return "status-txt--pending";
    if (st === "已开奖") return "status-txt--drawn";
    if (st === "草稿") return "status-txt--draft";
    return "status-txt--closed";
  }

  function renderActivityTable() {
    const cat = filterCategory.value;
    const type = filterType.value;
    const kw = filterKeyword.value.trim().toLowerCase();
    const st = filterStatus.value;

    const list = activities.filter((a) => {
      if (currentSubtab === "active" && a.status === "已关闭") return false;
      if (currentSubtab === "closed" && a.status !== "已关闭") return false;
      if (cat && a.category !== cat) return false;
      if (type && a.type !== type) return false;
      if (st && a.status !== st) return false;
      if (kw && !`${a.id} ${a.name}`.toLowerCase().includes(kw)) return false;
      return true;
    });

    totalCountText.textContent = `共 ${list.length} 条`;

    if (list.length === 0) {
      activityTableBody.innerHTML = `<tr><td colspan="21" style="padding:32px;color:#999;">暂无匹配活动数据</td></tr>`;
      return;
    }

    activityTableBody.innerHTML = list
      .map((a) => {
        const timeRange = a.endTime ? `${a.startTime}<br/>${a.endTime}` : a.startTime;
        const showRange = a.showEnd ? `${a.showStart}<br/>${a.showEnd}` : a.showStart;
        const bannerCell = a.banner
          ? `<img src="${a.banner}" alt="悬浮图" class="thumb-mini" />`
          : "-";

        return `
          <tr class="${a.isCoreLottery ? "is-featured-row" : ""}">
            <td><input type="checkbox" class="row-check" data-id="${a.id}" /></td>
            <td><button type="button" class="link-blue" data-pin="${a.id}">↑ 置顶</button></td>
            <td>${a.id}</td>
            <td><button type="button" class="link-blue" data-edit="${a.id}" style="font-weight:${a.isCoreLottery ? 700 : 500};">${a.name}</button></td>
            <td>${a.category}</td>
            <td>${a.currency}</td>
            <td>${a.type}</td>
            <td>${a.condition}</td>
            <td>${a.level}</td>
            <td>${a.vip}</td>
            <td>${a.tag}</td>
            <td>${a.audit}</td>
            <td style="font-size:11px;">${a.terminal}</td>
            <td>${bannerCell}</td>
            <td>${a.dispatchMode}</td>
            <td>${timeRange}</td>
            <td>${showRange}</td>
            <td><span class="status-txt ${getStatusClass(a.status)}">${a.status}</span></td>
            <td>
              <div class="ops-cell">
                <button type="button" class="link-blue" data-edit="${a.id}">修改</button>
                <button type="button" class="link-blue" data-detail="${a.id}">详情</button>
                ${
                  a.type === "抽奖"
                    ? `<button type="button" class="link-blue" data-settle="${a.id}">结算明细</button>`
                    : ""
                }
                <button type="button" class="link-blue" data-toggle-close="${a.id}">${a.status === "已关闭" ? "重新开启" : "关闭活动"}</button>
                <button type="button" class="link-blue" data-copy="${a.id}">复制</button>
              </div>
            </td>
            <td>${a.operator}</td>
            <td style="white-space:nowrap;">${a.operateTime}</td>
          </tr>
        `;
      })
      .join("");

    // 绑定行操作
    activityTableBody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => openEditActivity(Number(btn.dataset.edit)));
    });
    activityTableBody.querySelectorAll("[data-detail]").forEach((btn) => {
      btn.addEventListener("click", () => openLotteryDetail(Number(btn.dataset.detail)));
    });
    activityTableBody.querySelectorAll("[data-settle]").forEach((btn) => {
      btn.addEventListener("click", () => openSettlementModal());
    });
    activityTableBody.querySelectorAll("[data-toggle-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = activities.find((x) => x.id === Number(btn.dataset.toggleClose));
        if (!target) return;
        target.status = target.status === "已关闭" ? "进行中" : "已关闭";
        target.operateTime = nowStr();
        renderActivityTable();
        showToast(`活动「${target.name}」已${target.status === "已关闭" ? "关闭" : "重新开启"}`);
      });
    });
    activityTableBody.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = activities.find((x) => x.id === Number(btn.dataset.copy));
        if (!src) return;
        const clone = {
          ...src,
          id: Math.floor(120100 + Math.random() * 899),
          name: `${src.name}-副本`,
          status: "草稿",
          operateTime: nowStr(),
          isCoreLottery: false
        };
        activities.unshift(clone);
        renderActivityTable();
        showToast(`已复制生成草稿活动 ID: ${clone.id}`);
      });
    });
    activityTableBody.querySelectorAll("[data-pin]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = activities.findIndex((x) => x.id === Number(btn.dataset.pin));
        if (idx > 0) {
          const [item] = activities.splice(idx, 1);
          activities.unshift(item);
          renderActivityTable();
          showToast(`已置顶活动「${item.name}」`);
        }
      });
    });
    activityTableBody.querySelectorAll(".row-check").forEach((cb) => {
      cb.addEventListener("change", updateSelectedCount);
    });
  }

  function updateSelectedCount() {
    const count = activityTableBody.querySelectorAll(".row-check:checked").length;
    selectedCountText.textContent = `已选择 ${count} 条数据`;
  }

  function renderStatsSubpanel() {
    const main = activities.find((a) => a.isCoreLottery) || activities[0];
    const tickets = loadMergedTickets();
    const extra = Math.max(0, tickets.filter((t) => t.status === "有效").length - 2);
    const issued = main.simulatedFull ? main.totalPool : Math.min(main.totalPool, BASE_ISSUED + extra);
    const totalReg = settlements.reduce((s, x) => s + x.validReg, 0);
    const totalPay = settlements.reduce((s, x) => s + x.validReg * x.unitRate + x.adjust, 0);

    document.getElementById("statsKpiRow").innerHTML = `
      <div class="stat-card"><span>本期有效号码进度</span><strong>${Math.floor((issued / main.totalPool) * 100)}% (${issued.toLocaleString()}/100,000)</strong></div>
      <div class="stat-card"><span>累计有效注册数</span><strong>${totalReg.toLocaleString()} 人</strong></div>
      <div class="stat-card"><span>博主渠道数</span><strong>${(main.kols || []).length} 个</strong></div>
      <div class="stat-card"><span>累计推广结算金额</span><strong>R$ ${totalPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
    `;
  }

  // 子标签切换
  document.querySelectorAll(".subtab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentSubtab = btn.dataset.subtab;
      document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
      const isTable = currentSubtab === "active" || currentSubtab === "closed";
      activityFilterToolbar.hidden = !isTable;
      activityTableWrap.hidden = !isTable;
      activityPagination.hidden = !isTable;
      statsSubpanel.hidden = currentSubtab !== "stats";
      categoriesSubpanel.hidden = currentSubtab !== "categories";
      if (isTable) renderActivityTable();
      if (currentSubtab === "stats") renderStatsSubpanel();
    });
  });

  document.getElementById("quickSettlementTab").addEventListener("click", () => {
    document.querySelector('[data-subtab="stats"]').click();
  });

  // 筛选按钮
  document.getElementById("searchBtn").addEventListener("click", renderActivityTable);
  document.getElementById("resetBtn").addEventListener("click", () => {
    filterCategory.value = "";
    filterType.value = "";
    filterKeyword.value = "";
    filterStatus.value = "";
    renderActivityTable();
  });
  document.getElementById("refreshAllBtn").addEventListener("click", () => {
    renderActivityTable();
    showToast("已刷新活动列表与 H5 领号数据");
  });

  // 全选联动
  ["selectAllCheckbox", "selectAllBottom"].forEach((id) => {
    document.getElementById(id).addEventListener("change", (e) => {
      const checked = e.target.checked;
      document.getElementById("selectAllCheckbox").checked = checked;
      document.getElementById("selectAllBottom").checked = checked;
      activityTableBody.querySelectorAll(".row-check").forEach((cb) => (cb.checked = checked));
      updateSelectedCount();
    });
  });

  // ===========================
  // 2. 双栏「新增活动 / 修改活动」弹窗逻辑
  // ===========================
  function renderPrizeRows() {
    prizeRowsContainer.innerHTML = formPrizes
      .map(
        (p, idx) => `
          <div class="prize-row-item">
            <input type="text" class="erp-input" value="${p.name}" data-prize-field="name" data-idx="${idx}" placeholder="奖项名称" />
            <input type="text" class="erp-input" value="${p.content}" data-prize-field="content" data-idx="${idx}" placeholder="奖品描述 / 金额" />
            <input type="number" class="erp-input" value="${p.qty}" min="1" data-prize-field="qty" data-idx="${idx}" />
            <div class="prize-row-ops">
              ${
                idx === formPrizes.length - 1
                  ? `<button type="button" class="btn-mini-sq btn-mini-sq--blue" id="addPrizeRowBtn" title="添加奖项">+</button>`
                  : ""
              }
              <button type="button" class="btn-mini-sq" data-del-prize="${idx}" title="删除">×</button>
            </div>
          </div>
        `
      )
      .join("");

    prizeRowsContainer.querySelectorAll("[data-prize-field]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const i = Number(inp.dataset.idx);
        formPrizes[i][inp.dataset.prizeField] = inp.dataset.prizeField === "qty" ? Number(inp.value) || 1 : inp.value;
      });
    });

    const addBtn = document.getElementById("addPrizeRowBtn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        formPrizes.push({ name: `${formPrizes.length + 1}等奖`, content: "", qty: 1 });
        renderPrizeRows();
      });
    }

    prizeRowsContainer.querySelectorAll("[data-del-prize]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (formPrizes.length <= 1) {
          showToast("至少保留 1 个奖项配置");
          return;
        }
        formPrizes.splice(Number(btn.dataset.delPrize), 1);
        renderPrizeRows();
      });
    });
  }

  function renderKolFormRows() {
    const actIdLabel = document.getElementById("editingActivityId").value || "{活动ID}";
    kolChannelsFormList.innerHTML = formKols
      .map(
        (k, idx) => `
          <div class="kol-form-card">
            <div class="kol-card-top">
              <input type="text" class="erp-input" value="${k.code}" data-kol-field="code" data-idx="${idx}" placeholder="博主标识" />
              <input type="text" class="erp-input" value="${k.name}" data-kol-field="name" data-idx="${idx}" placeholder="展示名称" />
              <div class="inline-radios" style="gap:8px;">
                <label><input type="radio" name="kolSt_${idx}" value="启用" ${k.status === "启用" ? "checked" : ""} data-kol-status="${idx}" /> 启用</label>
                <label><input type="radio" name="kolSt_${idx}" value="停用" ${k.status === "停用" ? "checked" : ""} data-kol-status="${idx}" /> 停用</label>
              </div>
              <button type="button" class="link-danger" data-del-kol="${idx}">删除</button>
            </div>
            <div class="kol-sub-line">
              <span>专属链接</span>
              <input type="text" class="erp-input" readonly value="https://dztz2026.github.io/fan-160-cn-prototype/h5.html?act=${actIdLabel}&kol=${k.code}" />
            </div>
            <div class="kol-sub-line">
              <span>生效时间</span>
              <div class="range-row">
                <input type="date" class="erp-input" value="${k.start}" data-kol-field="start" data-idx="${idx}" />
                <span class="range-arrow">→</span>
                <input type="date" class="erp-input" value="${k.end}" data-kol-field="end" data-idx="${idx}" />
              </div>
            </div>
          </div>
        `
      )
      .join("");

    kolChannelsFormList.querySelectorAll("[data-kol-field]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const i = Number(inp.dataset.idx);
        formKols[i][inp.dataset.kolField] = inp.value;
        if (inp.dataset.kolField === "code") {
          const linkInput = inp.closest(".kol-form-card").querySelector("input[readonly]");
          if (linkInput) {
            linkInput.value = `https://dztz2026.github.io/fan-160-cn-prototype/h5.html?act=${actIdLabel}&kol=${inp.value}`;
          }
        }
      });
    });

    kolChannelsFormList.querySelectorAll("[data-kol-status]").forEach((rad) => {
      rad.addEventListener("change", () => {
        formKols[Number(rad.dataset.kolStatus)].status = rad.value;
      });
    });

    kolChannelsFormList.querySelectorAll("[data-del-kol]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (formKols.length <= 1) {
          showToast("至少保留 1 条博主渠道配置");
          return;
        }
        formKols.splice(Number(btn.dataset.delKol), 1);
        renderKolFormRows();
      });
    });
  }

  document.getElementById("addKolRowBtn").addEventListener("click", () => {
    const nextNum = String(formKols.length + 1).padStart(4, "0");
    formKols.push({
      code: `B${nextNum}`,
      name: "",
      status: "启用",
      start: "2026-11-18",
      end: "2026-12-18"
    });
    renderKolFormRows();
  });

  // 活动类型芯片选择
  document.querySelectorAll("#activityTypeGrid .type-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#activityTypeGrid .type-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      selectedTypeChip = chip.dataset.type;
    });
  });

  // 展示时间与活动时间保持一致
  const cfgSyncDisplayTime = document.getElementById("cfgSyncDisplayTime");
  function syncDisplayDates() {
    if (!cfgSyncDisplayTime.checked) return;
    document.getElementById("cfgShowStart").value = document.getElementById("cfgStartDate").value;
    document.getElementById("cfgShowEnd").value = document.getElementById("cfgEndDate").value;
  }
  cfgSyncDisplayTime.addEventListener("change", syncDisplayDates);
  document.getElementById("cfgStartDate").addEventListener("change", syncDisplayDates);
  document.getElementById("cfgEndDate").addEventListener("change", syncDisplayDates);

  // 宣传图缩略图切换 & 上传
  document.querySelectorAll("#bannerGallery .banner-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bannerGallery .banner-thumb").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      const val = btn.dataset.banner;
      if (val.startsWith("assets/")) {
        selectedBannerSrc = val;
        bannerPreviewImg.src = val;
        bannerPreviewImg.hidden = false;
      } else {
        selectedBannerSrc = "assets/fan-160-hero.jpg";
        bannerPreviewImg.src = "assets/fan-160-hero.jpg";
        showToast(`已切换预览模板：${btn.dataset.title}`);
      }
    });
  });

  document.getElementById("uploadDropzone").addEventListener("click", (e) => {
    if (e.target.id === "clearBannerBtn") return;
    document.getElementById("bannerFileInput").click();
  });

  document.getElementById("bannerFileInput").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      selectedBannerSrc = reader.result;
      bannerPreviewImg.src = reader.result;
      showToast(`已上传宣传图：${file.name}`);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("clearBannerBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    showToast("已恢复默认主视觉宣传图");
    selectedBannerSrc = "assets/fan-160-hero.jpg";
    bannerPreviewImg.src = selectedBannerSrc;
  });

  document.getElementById("toggleGalleryBtn").addEventListener("click", (e) => {
    const gal = document.getElementById("bannerGallery");
    gal.hidden = !gal.hidden;
    e.target.textContent = gal.hidden ? "展开" : "收起";
  });

  document.querySelectorAll("#previewLangTabs .preview-lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#previewLangTabs .preview-lang-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      previewLangBadge.textContent = `${btn.dataset.plang}预览`;
    });
  });

  // 规则字数统计
  function updateRuleCounter() {
    ruleCharCounter.textContent = `${cfgRuleTextarea.value.length} / 10000`;
  }
  cfgRuleTextarea.addEventListener("input", updateRuleCounter);

  // 打开新增活动
  function openCreateActivity() {
    document.getElementById("createModalTitle").textContent = "新增活动";
    document.getElementById("editingActivityId").value = "";
    document.getElementById("cfgActName").value = "";
    document.getElementById("cfgRound").value = "第1期";
    document.getElementById("cfgSponsor").value = "塔瓦雷斯活动方";
    document.getElementById("cfgUnitRate").value = "12.50";
    formPrizes = [
      { name: "一等奖", content: "", qty: 1 },
      { name: "2等奖", content: "", qty: 1 },
      { name: "3等奖", content: "", qty: 1 }
    ];
    formKols = [{ code: "B0001", name: "", status: "启用", start: "2026-11-18", end: "2026-12-18" }];
    renderPrizeRows();
    renderKolFormRows();
    updateRuleCounter();
    openModal("createActivityModal");
  }

  // 打开修改活动
  function openEditActivity(id) {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    document.getElementById("createModalTitle").textContent = `修改活动（ID: ${act.id}）`;
    document.getElementById("editingActivityId").value = String(act.id);
    document.getElementById("cfgActName").value = act.name;
    document.getElementById("cfgRound").value = act.round || "第1期";
    document.getElementById("cfgSponsor").value = act.sponsor || "塔瓦雷斯活动方";
    document.getElementById("cfgUnitRate").value = act.unitRate ? act.unitRate.toFixed(2) : "12.50";
    formPrizes = act.prizes
      ? act.prizes.map((p) => ({ ...p }))
      : [
          { name: "一等奖", content: "2025款 本田 Fan 160 摩托车", qty: 1 },
          { name: "2等奖", content: "现金幸运奖 ¥500", qty: 8 },
          { name: "3等奖", content: "平台彩金", qty: 10 }
        ];
    formKols = act.kols
      ? act.kols.map((k) => ({ ...k }))
      : [{ code: "B0001", name: "Tavares 44 官方主号", status: "启用", start: "2026-11-18", end: "2026-12-18" }];
    renderPrizeRows();
    renderKolFormRows();
    updateRuleCounter();
    openModal("createActivityModal");
  }

  function saveActivity(targetStatus) {
    const name = document.getElementById("cfgActName").value.trim();
    const round = document.getElementById("cfgRound").value.trim();
    const sponsor = document.getElementById("cfgSponsor").value.trim();
    const start = document.getElementById("cfgStartDate").value;
    const end = document.getElementById("cfgEndDate").value;
    const isPerm = document.getElementById("cfgActPermanent").checked;

    if (!name) {
      showToast("请输入活动名称");
      document.getElementById("cfgActName").focus();
      return;
    }
    if (!isPerm && start && end && end < start) {
      showToast("活动结束时间不得早于开始时间");
      return;
    }

    const formType = (document.querySelector('input[name="actFormType"]:checked') || {}).value || "站外抽奖";
    const eligibility = (document.querySelector('input[name="cfgEligibility"]:checked') || {}).value || "需登录平台账号";
    const drawMode = (document.querySelector('input[name="cfgDrawMode"]:checked') || {}).value || "人工触发开奖";
    const editId = document.getElementById("editingActivityId").value;

    if (editId) {
      const target = activities.find((a) => a.id === Number(editId));
      if (target) {
        target.name = name;
        target.round = round;
        target.sponsor = sponsor;
        target.type = selectedTypeChip;
        target.formType = formType;
        target.category = formType;
        target.condition = `${eligibility} · 免费领号`;
        target.dispatchMode = drawMode;
        target.startTime = isPerm ? "不限" : start;
        target.endTime = isPerm ? "" : end;
        target.status = targetStatus;
        target.banner = selectedBannerSrc;
        target.prizes = formPrizes.map((p) => ({ ...p }));
        target.kols = formKols.map((k) => ({ ...k }));
        target.operateTime = nowStr();
      }
      showToast(`活动「${name}」已${targetStatus === "进行中" ? "立即发布" : "保存为草稿"}`);
    } else {
      const newAct = {
        id: Math.floor(120100 + Math.random() * 899),
        name,
        category: formType,
        currency: "BRL",
        type: selectedTypeChip,
        formType,
        condition: `${eligibility} · 免费领号`,
        level: "不限制",
        vip: "不限制",
        tag: "不限制",
        audit: "1.00",
        terminal: "H5_WEB(活动落地页), Android_APP, ...",
        banner: selectedBannerSrc,
        dispatchMode: drawMode,
        startTime: isPerm ? "不限" : start,
        endTime: isPerm ? "" : end,
        showStart: isPerm ? "不限" : document.getElementById("cfgShowStart").value,
        showEnd: isPerm ? "" : document.getElementById("cfgShowEnd").value,
        status: targetStatus,
        operator: "Cooper",
        operateTime: nowStr(),
        round,
        sponsor,
        totalPool: 100000,
        prizes: formPrizes.map((p) => ({ ...p })),
        kols: formKols.map((k) => ({ ...k })),
        unitRate: parseFloat(document.getElementById("cfgUnitRate").value) || 0,
        isCoreLottery: true
      };
      activities.unshift(newAct);
      showToast(`已新增活动「${name}」（状态：${targetStatus}）`);
    }

    closeModal("createActivityModal");
    renderActivityTable();
  }

  document.getElementById("openCreateActivityBtn").addEventListener("click", openCreateActivity);
  document.getElementById("publishActivityBtn").addEventListener("click", () => saveActivity("进行中"));
  document.getElementById("createActivityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    saveActivity("草稿");
  });

  // ===========================
  // 3. 活动详情：号码池与开奖管理弹窗（联动 H5）
  // ===========================
  function openLotteryDetail(actId) {
    const act = activities.find((a) => a.id === actId) || activities[0];
    document.getElementById("detailModalTitle").textContent = `活动详情 · ${act.name}（ID: ${act.id}）`;
    renderDetailTickets(act);
    openModal("lotteryDetailModal");
  }

  function renderDetailTickets(act = activities[0]) {
    const all = loadMergedTickets();
    const extra = Math.max(0, all.filter((t) => t.status === "有效").length - 2);
    const total = act.totalPool || 100000;
    const issued = act.simulatedFull ? total : Math.min(total, BASE_ISSUED + extra);
    let pct = Math.floor((issued / total) * 100);
    if (issued < total && pct >= 100) pct = 99;

    document.getElementById("detailSummaryBar").innerHTML = `
      <div class="detail-sum-box"><span>当前活动状态</span><strong>${act.status}</strong></div>
      <div class="detail-sum-box"><span>有效号码进度</span><strong>${pct}% (${issued.toLocaleString()} / ${total.toLocaleString()})</strong></div>
      <div class="detail-sum-box"><span>开奖方式</span><strong>${act.dispatchMode || "人工触发开奖"}</strong></div>
      <div class="detail-sum-box"><span>大奖公示号码</span><strong style="color:#52c41a;">${act.winningNumber || "待开奖"}</strong></div>
    `;

    const kw = (document.getElementById("detailTicketSearch").value || "").trim().toLowerCase();
    const st = document.getElementById("detailTicketStatus").value;
    const filtered = all.filter((r) => {
      if (st !== "all" && r.status !== st) return false;
      if (kw && !`${r.number} ${r.phone} ${r.accountId}`.toLowerCase().includes(kw)) return false;
      return true;
    });

    document.getElementById("detailTicketsBody").innerHTML = filtered
      .map(
        (r) => `
          <tr>
            <td>${r.recordId}</td>
            <td><strong>${r.number}</strong></td>
            <td>${r.phone}</td>
            <td>${r.accountId}</td>
            <td>${r.mode}</td>
            <td>${r.kolId || "B0001"}</td>
            <td>${r.createdAt}</td>
            <td><span class="status-txt ${r.status === "有效" ? "status-txt--running" : "status-txt--closed"}">${r.status}</span></td>
            <td>${r.drawStatus || "待开奖"}</td>
            <td>
              ${
                r.status === "有效"
                  ? `<button type="button" class="link-danger" data-void-rec="${r.recordId}">作废</button>`
                  : "-"
              }
            </td>
          </tr>
        `
      )
      .join("");

    document.getElementById("detailTicketsBody").querySelectorAll("[data-void-rec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const updated = loadMergedTickets().map((r) =>
          r.recordId === btn.dataset.voidRec ? { ...r, status: "作废", drawStatus: "未中奖" } : r
        );
        saveMergedTickets(updated);
        renderDetailTickets(act);
        showToast("已作废该号码并扣减有效进度");
      });
    });
  }

  document.getElementById("openLotteryDetailTopBtn").addEventListener("click", () => openLotteryDetail(activities[0].id));
  document.getElementById("detailTicketSearch").addEventListener("input", () => renderDetailTickets(activities[0]));
  document.getElementById("detailTicketStatus").addEventListener("change", () => renderDetailTickets(activities[0]));

  document.getElementById("detailLockPoolBtn").addEventListener("click", () => {
    const main = activities[0];
    main.simulatedFull = true;
    main.status = "待开奖";
    renderActivityTable();
    renderDetailTickets(main);
    showToast("已模拟达到 100% 满额，停止发号并进入「待开奖」");
  });

  document.getElementById("detailTriggerDrawBtn").addEventListener("click", () => {
    const main = activities[0];
    if (main.status !== "待开奖" && main.status !== "已开奖") {
      showToast("未达到满额开奖条件，请先点击「模拟满额锁池 (100%)」");
      return;
    }
    if (main.status === "已开奖") {
      showToast(`本期已开奖，沿用公示号码 ${main.winningNumber}`);
      return;
    }
    const list = loadMergedTickets();
    const valid = list.filter((r) => r.status === "有效");
    const winNum = valid[0] ? valid[0].number : "052818";
    main.status = "已开奖";
    main.winningNumber = winNum;
    saveMergedTickets(list.map((r) => (r.status === "有效" ? { ...r, drawStatus: r.number === winNum ? "已中奖" : "未中奖" } : r)));
    renderActivityTable();
    renderDetailTickets(main);
    showToast(`开奖成功并已前台公示！中奖号码：${winNum}`);
  });

  // ===========================
  // 4. 博主推广结算明细弹窗（PRD R07）
  // ===========================
  function openSettlementModal() {
    renderSettlementRows();
    openModal("settlementModal");
  }

  function renderSettlementRows() {
    document.getElementById("settlementModalBody").innerHTML = settlements
      .map((s) => {
        const total = s.validReg * s.unitRate + s.adjust;
        const cls = s.status === "已付款" ? "status-txt--running" : s.status === "已确认" ? "status-txt--drawn" : "status-txt--pending";
        return `
          <tr>
            <td>${s.id}</td>
            <td><strong>${s.kolCode}</strong><br/><span style="color:#888;">${s.kolName}</span></td>
            <td>${s.period}</td>
            <td>${s.rateVer}<br/>R$ ${s.unitRate.toFixed(2)}</td>
            <td><strong>${s.validReg}</strong></td>
            <td>${s.excluded}</td>
            <td style="color:${s.adjust < 0 ? "#ff4d4f" : "#333"};">${s.adjust >= 0 ? `+R$ ${s.adjust.toFixed(2)}` : `-R$ ${Math.abs(s.adjust).toFixed(2)}`}</td>
            <td><strong>R$ ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></td>
            <td><span class="status-txt ${cls}">${s.status}</span>${s.voucher ? `<br/><span style="font-size:10px;color:#888;">${s.voucher}</span>` : ""}</td>
            <td>
              ${s.status === "待核对" ? `<button type="button" class="link-blue" data-set-confirm="${s.id}">财务确认</button>` : ""}
              ${s.status === "已确认" ? `<button type="button" class="link-blue" data-set-pay="${s.id}">登记付款</button>` : ""}
              ${s.status === "已付款" ? `<span style="color:#999;">已完结</span>` : ""}
            </td>
          </tr>
        `;
      })
      .join("");

    document.getElementById("settlementModalBody").querySelectorAll("[data-set-confirm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = settlements.find((x) => x.id === btn.dataset.setConfirm);
        if (!s) return;
        s.status = "已确认";
        renderSettlementRows();
        showToast(`结算单 ${s.id} 已确认锁定明细与费率版本`);
      });
    });

    document.getElementById("settlementModalBody").querySelectorAll("[data-set-pay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const s = settlements.find((x) => x.id === btn.dataset.setPay);
        if (!s) return;
        s.status = "已付款";
        s.voucher = `PIX-${Date.now().toString().slice(-8)}`;
        renderSettlementRows();
        showToast(`结算单 ${s.id} 已登记付款凭证 ${s.voucher}`);
      });
    });
  }

  document.getElementById("openSettlementFromModalBtn").addEventListener("click", openSettlementModal);
  document.getElementById("openSettlementFromStatsBtn").addEventListener("click", openSettlementModal);
  document.getElementById("exportSettlementCsvBtn").addEventListener("click", () => {
    const header = ["结算单号", "博主标识", "博主名称", "周期", "费率版本", "单价(BRL)", "有效注册", "调账", "应付总额(BRL)", "状态", "付款凭证"];
    const rows = settlements.map((s) => [
      s.id,
      s.kolCode,
      s.kolName,
      s.period,
      s.rateVer,
      s.unitRate.toFixed(2),
      s.validReg,
      s.adjust.toFixed(2),
      (s.validReg * s.unitRate + s.adjust).toFixed(2),
      s.status,
      s.voucher
    ]);
    const csv = "\uFEFF" + [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "巴西站-站外抽奖博主结算明细.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("已导出 CSV 结算对账单");
  });

  // 其他轻量交互按钮
  document.getElementById("openGlobalSettingsBtn").addEventListener("click", () => {
    showToast("活动全局设置：默认归因窗口 7 天，满额自动锁池");
  });
  document.getElementById("openTutorialBtn").addEventListener("click", () => {
    showToast("操作提示：点击「+ 新增活动」可查看完整的站外编号抽奖双栏配置表单");
  });
  document.querySelectorAll("[data-tip]").forEach((btn) => {
    btn.addEventListener("click", () => showToast(btn.dataset.tip));
  });

  // 弹窗开关
  function openModal(id) {
    document.getElementById(id).hidden = false;
  }
  function closeModal(id) {
    document.getElementById(id).hidden = true;
  }
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  // 初始化
  renderActivityTable();
})();
