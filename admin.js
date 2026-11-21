(() => {
  const H5_RECORDS_KEY = "fan160_prd_records_v2";
  const BASE_ISSUED = 53000;

  const ROLE_LABELS = {
    ops: "Cooper（运营管理员）",
    draw: "Alice（开奖授权员）",
    finance: "Bob（财务审核员）"
  };

  let currentRole = "ops";

  // 操作审计日志（PRD R05）
  let auditLogs = [
    {
      time: "2026-11-21 15:20:00",
      actor: "Cooper（运营管理员）",
      module: "活动管理",
      action: "发布并冻结规则版本",
      detail: "发布 ID:120088「本田 Fan 160 2025（第1期）」，号码池 000001-100000（6位），规则版本冻结为 v1.0。"
    },
    {
      time: "2026-11-19 10:12:45",
      actor: "Bob（财务审核员）",
      module: "推广结算",
      action: "财务确认并调账",
      detail: "结算单 SET-202611-02 已确认锁定，调账 -R$ 220.00（原因：风控复核剔除 20 笔同设备异常注册）。"
    }
  ];

  // 活动列表数据
  let activities = [
    {
      id: 120088,
      name: "本田 Fan 160 2025（第1期）",
      category: "站外抽奖",
      currency: "BRL",
      type: "抽奖",
      formType: "站外抽奖",
      condition: "需登录平台账号 · 免费领号（自选+随机）",
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
      ruleVersion: "v1.0",
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
      settleCurrency: "BRL",
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

  // 结算单数据（补齐期号 + PRD R06 漏斗 + R07 调账与付款时间）
  let settlements = [
    {
      id: "SET-202611-01",
      round: "第 202601 期",
      kolCode: "B0001",
      kolName: "Tavares 44 官方主号",
      period: "2026-11-01 ~ 2026-11-30",
      clicks: 14820,
      registered: 1578,
      rateVer: "RATE-v1.0",
      currency: "BRL",
      unitRate: 12.5,
      validReg: 1420,
      excluded: 158,
      adjust: 0,
      adjustReason: "",
      status: "待核对",
      paidAt: "",
      voucher: ""
    },
    {
      id: "SET-202611-02",
      round: "第 202601 期",
      kolCode: "B0002",
      kolName: "巴西机车测评社",
      period: "2026-11-01 ~ 2026-11-30",
      clicks: 8340,
      registered: 754,
      rateVer: "RATE-v1.0",
      currency: "BRL",
      unitRate: 11.0,
      validReg: 680,
      excluded: 74,
      adjust: -220,
      adjustReason: "风控复核剔除 20 笔同设备异常注册",
      status: "已确认",
      paidAt: "",
      voucher: ""
    },
    {
      id: "SET-202610-09",
      round: "第 202510 期",
      kolCode: "B0001",
      kolName: "Tavares 44 官方主号",
      period: "2026-10-01 ~ 2026-10-31",
      clicks: 11200,
      registered: 1011,
      rateVer: "RATE-v0.9",
      currency: "BRL",
      unitRate: 10.0,
      validReg: 950,
      excluded: 61,
      adjust: 0,
      adjustReason: "",
      status: "已付款",
      paidAt: "2026-11-05 16:40",
      voucher: "PIX-20261105-8841"
    }
  ];

  // 抽奖结果公示样本（与 H5 端已开出中奖号码保持一致）
  let drawResults = [
    {
      round: "第 202601 期",
      prize: "幸运即开奖 ¥500",
      drawnAt: "2026-11-20 19:25:00",
      winNumber: "668427",
      winnerAccount: "13900012233",
      winnerId: "UID_774512"
    },
    {
      round: "第 202601 期",
      prize: "幸运即开奖 ¥500",
      drawnAt: "2026-11-20 21:14:32",
      winNumber: "205875",
      winnerAccount: "13866778899",
      winnerId: "UID_759201"
    },
    {
      round: "第 202510 期",
      prize: "一等奖 本田 Fan 160",
      drawnAt: "2026-10-31 20:00:00",
      winNumber: "088219",
      winnerAccount: "13755661122",
      winnerId: "UID_620418"
    }
  ];

  const SEED_TICKETS = [
    {
      recordId: "REC-20261121-001",
      round: "第 202601 期",
      accountId: "UID_880123",
      phone: "13800138000",
      nickname: "李明宇",
      registeredAt: "2026-11-21 13:40:05",
      number: "052818",
      mode: "手动选择号码",
      status: "有效",
      drawStatus: "待开奖",
      kolId: "KOL_Tavares44",
      voidReason: "",
      createdAt: "2026-11-21 13:45:12"
    },
    {
      recordId: "REC-20261120-019",
      round: "第 202601 期",
      accountId: "UID_774512",
      phone: "13900012233",
      nickname: "陈杰森",
      registeredAt: "2026-11-20 19:18:42",
      number: "668427",
      mode: "系统随机分配",
      status: "有效",
      drawStatus: "已中奖",
      kolId: "KOL_Tavares44",
      voidReason: "",
      createdAt: "2026-11-20 19:22:08"
    },
    {
      recordId: "REC-20261120-015",
      round: "第 202601 期",
      accountId: "UID_759201",
      phone: "13866778899",
      nickname: "林凯峰",
      registeredAt: "2026-11-20 21:10:15",
      number: "205875",
      mode: "手动选择号码",
      status: "有效",
      drawStatus: "已中奖",
      kolId: "B0001",
      voidReason: "",
      createdAt: "2026-11-20 21:12:40"
    },
    {
      recordId: "REC-20261120-012",
      round: "第 202601 期",
      accountId: "UID_771004",
      phone: "13699887766",
      nickname: "待核验用户",
      registeredAt: "2026-11-20 14:15:30",
      number: "052831",
      mode: "手动选择号码",
      status: "待确认",
      drawStatus: "待开奖",
      kolId: "B0002",
      voidReason: "",
      createdAt: "2026-11-20 14:18:05"
    },
    {
      recordId: "REC-20261031-088",
      round: "第 202510 期",
      accountId: "UID_620418",
      phone: "13755661122",
      nickname: "往期幸运用户",
      registeredAt: "2026-10-28 16:04:11",
      number: "088219",
      mode: "系统随机分配",
      status: "有效",
      drawStatus: "已中奖",
      kolId: "B0001",
      voidReason: "",
      createdAt: "2026-10-28 16:06:20"
    }
  ];

  // 状态
  let currentSubtab = "active";
  let selectedTypeChip = "抽奖";
  let formPrizes = [];
  let formKols = [];
  let selectedBannerSrc = "assets/fan-160-hero.jpg";
  let toastTimer = null;

  // DOM
  const erpRoleSelect = document.getElementById("erpRoleSelect");
  const activityTableBody = document.getElementById("activityTableBody");
  const activityTableWrap = document.getElementById("activityTableWrap");
  const activityFilterToolbar = document.getElementById("activityFilterToolbar");
  const activityPagination = document.getElementById("activityPagination");
  const statsSubpanel = document.getElementById("statsSubpanel");
  const categoriesSubpanel = document.getElementById("categoriesSubpanel");
  const logsSubpanel = document.getElementById("logsSubpanel");
  const auditLogTableBody = document.getElementById("auditLogTableBody");
  const totalCountText = document.getElementById("totalCountText");
  const selectedCountText = document.getElementById("selectedCountText");

  const filterCategory = document.getElementById("filterCategory");
  const filterType = document.getElementById("filterType");
  const filterKeyword = document.getElementById("filterKeyword");
  const filterStatus = document.getElementById("filterStatus");

  const freezeNoticeBar = document.getElementById("freezeNoticeBar");
  const prizeRowsContainer = document.getElementById("prizeRowsContainer");
  const kolChannelsFormList = document.getElementById("kolChannelsFormList");
  const cfgRuleTextarea = document.getElementById("cfgRuleTextarea");
  const ruleCharCounter = document.getElementById("ruleCharCounter");
  const cfgSettleCurrency = document.getElementById("cfgSettleCurrency");
  const cfgRateUnitLabel = document.getElementById("cfgRateUnitLabel");
  const bannerPreviewImg = document.getElementById("bannerPreviewImg");
  const previewLangBadge = document.getElementById("previewLangBadge");
  const erpToast = document.getElementById("erpToast");

  function showToast(msg) {
    erpToast.textContent = msg;
    erpToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      erpToast.hidden = true;
    }, 2800);
  }

  function nowStr() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
      d.getMinutes()
    )}:${p(d.getSeconds())}`;
  }

  function addAuditLog(module, action, detail) {
    auditLogs.unshift({
      time: nowStr(),
      actor: ROLE_LABELS[currentRole],
      module,
      action,
      detail
    });
    renderAuditLogs();
  }

  function renderAuditLogs() {
    auditLogTableBody.innerHTML = auditLogs
      .map(
        (l) => `
          <tr>
            <td style="white-space:nowrap;">${l.time}</td>
            <td><strong>${l.actor}</strong></td>
            <td>${l.module}</td>
            <td>${l.action}</td>
            <td style="text-align:left;">${l.detail}</td>
          </tr>
        `
      )
      .join("");
  }

  erpRoleSelect.addEventListener("change", () => {
    currentRole = erpRoleSelect.value;
    showToast(`已切换当前操作角色：${ROLE_LABELS[currentRole]}`);
  });

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
    h5.forEach((r) => map.set(r.recordId, { ...r, drawStatus: r.drawStatus || "待开奖", voidReason: r.voidReason || "" }));
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
        const bannerCell = a.banner ? `<img src="${a.banner}" alt="悬浮图" class="thumb-mini" />` : "-";

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
                ${a.type === "抽奖" ? `<button type="button" class="link-blue" data-settle="${a.id}">活动明细</button>` : ""}
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

    activityTableBody.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => openEditActivity(Number(btn.dataset.edit)));
    });
    activityTableBody.querySelectorAll("[data-detail]").forEach((btn) => {
      btn.addEventListener("click", () => openLotteryDetail(Number(btn.dataset.detail)));
    });
    activityTableBody.querySelectorAll("[data-settle]").forEach((btn) => {
      btn.addEventListener("click", () => openActivityDetailsModal("participation", Number(btn.dataset.settle)));
    });
    activityTableBody.querySelectorAll("[data-toggle-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可开启或关闭活动（PRD R05）");
          return;
        }
        const target = activities.find((x) => x.id === Number(btn.dataset.toggleClose));
        if (!target) return;
        target.status = target.status === "已关闭" ? "进行中" : "已关闭";
        target.operateTime = nowStr();
        addAuditLog("活动管理", target.status === "已关闭" ? "关闭活动" : "重新开启活动", `活动 ID:${target.id}「${target.name}」状态更新为 ${target.status}。`);
        renderActivityTable();
        showToast(`活动「${target.name}」已${target.status === "已关闭" ? "关闭" : "重新开启"}`);
      });
    });
    activityTableBody.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可复制创建活动（PRD R05）");
          return;
        }
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
        addAuditLog("活动管理", "复制活动草稿", `从 ID:${src.id} 复制生成草稿 ID:${clone.id}「${clone.name}」。`);
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
    const totalClicks = settlements.reduce((s, x) => s + x.clicks, 0);
    const totalReg = settlements.reduce((s, x) => s + x.validReg, 0);
    const totalPay = settlements.reduce((s, x) => s + x.validReg * x.unitRate + x.adjust, 0);

    document.getElementById("statsKpiRow").innerHTML = `
      <div class="stat-card"><span>本期有效号码进度</span><strong>${Math.floor((issued / main.totalPool) * 100)}% (${issued.toLocaleString()}/100,000)</strong></div>
      <div class="stat-card"><span>博主渠道累计点击</span><strong>${totalClicks.toLocaleString()} 次</strong></div>
      <div class="stat-card"><span>累计有效新增注册</span><strong>${totalReg.toLocaleString()} 人</strong></div>
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
      logsSubpanel.hidden = currentSubtab !== "logs";
      if (isTable) renderActivityTable();
      if (currentSubtab === "stats") renderStatsSubpanel();
      if (currentSubtab === "logs") renderAuditLogs();
    });
  });

  document.getElementById("quickSettlementTab").addEventListener("click", () => {
    document.querySelector('[data-subtab="stats"]').click();
  });

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
  // 2. 双栏「新增活动 / 修改活动」弹窗（含 R05 规则冻结）
  // ===========================
  function setFrozenFieldsState(isFrozen) {
    freezeNoticeBar.hidden = !isFrozen;
    document.querySelectorAll("#createActivityForm [data-freeze-field]").forEach((el) => {
      el.disabled = isFrozen;
    });
  }

  cfgSettleCurrency.addEventListener("change", () => {
    cfgRateUnitLabel.textContent = `${cfgSettleCurrency.value} / 有效注册`;
  });

  function renderPrizeRows() {
    prizeRowsContainer.innerHTML = formPrizes
      .map(
        (p, idx) => `
          <div class="prize-row-item">
            <input type="text" class="erp-input" value="${p.name}" data-prize-field="name" data-idx="${idx}" placeholder="奖项名称" />
            <input type="text" class="erp-input" value="${p.content}" data-prize-field="content" data-idx="${idx}" placeholder="奖品描述 / 金额" />
            <input type="number" class="erp-input" value="${p.qty}" min="1" data-prize-field="qty" data-idx="${idx}" />
            <div class="prize-row-ops">
              ${idx === formPrizes.length - 1 ? `<button type="button" class="btn-mini-sq btn-mini-sq--blue" id="addPrizeRowBtn" title="添加奖项">+</button>` : ""}
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
    formKols.push({ code: `B${nextNum}`, name: "", status: "启用", start: "2026-11-18", end: "2026-12-18" });
    renderKolFormRows();
  });

  document.querySelectorAll("#activityTypeGrid .type-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll("#activityTypeGrid .type-chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      selectedTypeChip = chip.dataset.type;
    });
  });

  const cfgSyncDisplayTime = document.getElementById("cfgSyncDisplayTime");
  function syncDisplayDates() {
    if (!cfgSyncDisplayTime.checked) return;
    document.getElementById("cfgShowStart").value = document.getElementById("cfgStartDate").value;
    document.getElementById("cfgShowEnd").value = document.getElementById("cfgEndDate").value;
  }
  cfgSyncDisplayTime.addEventListener("change", syncDisplayDates);
  document.getElementById("cfgStartDate").addEventListener("change", syncDisplayDates);
  document.getElementById("cfgEndDate").addEventListener("change", syncDisplayDates);

  document.querySelectorAll("#bannerGallery .banner-thumb").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bannerGallery .banner-thumb").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      const val = btn.dataset.banner;
      selectedBannerSrc = val.startsWith("assets/") ? val : "assets/fan-160-hero.jpg";
      bannerPreviewImg.src = selectedBannerSrc;
      if (!val.startsWith("assets/")) showToast(`已切换预览模板：${btn.dataset.title}`);
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
    selectedBannerSrc = "assets/fan-160-hero.jpg";
    bannerPreviewImg.src = selectedBannerSrc;
    showToast("已恢复默认主视觉宣传图");
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

  function updateRuleCounter() {
    ruleCharCounter.textContent = `${cfgRuleTextarea.value.length} / 10000`;
  }
  cfgRuleTextarea.addEventListener("input", updateRuleCounter);

  function openCreateActivity() {
    if (currentRole !== "ops") {
      showToast("越权拦截：仅「运营管理员」可新增活动配置（PRD R05）");
      return;
    }
    document.getElementById("createModalTitle").textContent = "新增活动";
    document.getElementById("editingActivityId").value = "";
    document.getElementById("cfgActName").value = "";
    document.getElementById("cfgRound").value = "第1期";
    document.getElementById("cfgSponsor").value = "塔瓦雷斯活动方";
    cfgSettleCurrency.value = "BRL";
    cfgRateUnitLabel.textContent = "BRL / 有效注册";
    document.getElementById("cfgUnitRate").value = "12.50";
    setFrozenFieldsState(false);
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

  function openEditActivity(id) {
    const act = activities.find((a) => a.id === id);
    if (!act) return;
    document.getElementById("createModalTitle").textContent = `修改活动（ID: ${act.id}）`;
    document.getElementById("editingActivityId").value = String(act.id);
    document.getElementById("cfgActName").value = act.name;
    document.getElementById("cfgRound").value = act.round || "第1期";
    document.getElementById("cfgSponsor").value = act.sponsor || "塔瓦雷斯活动方";
    cfgSettleCurrency.value = act.settleCurrency || "BRL";
    cfgRateUnitLabel.textContent = `${cfgSettleCurrency.value} / 有效注册`;
    document.getElementById("cfgUnitRate").value = act.unitRate ? act.unitRate.toFixed(2) : "12.50";

    // PRD R05：已发布活动冻结关键规则字段
    const isPublished = ["进行中", "待开奖", "已开奖"].includes(act.status);
    setFrozenFieldsState(isPublished);

    formPrizes = act.prizes
      ? act.prizes.map((p) => ({ ...p }))
      : [
          { name: "一等奖", content: "2025款 本田 Fan 160 摩托车", qty: 1 },
          { name: "2等奖", content: "现金幸运奖 ¥500", qty: 8 }
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
    if (currentRole !== "ops") {
      showToast("越权拦截：仅「运营管理员」可发布或保存活动配置（PRD R05）");
      return;
    }

    const name = document.getElementById("cfgActName").value.trim();
    const round = document.getElementById("cfgRound").value.trim();
    const sponsor = document.getElementById("cfgSponsor").value.trim();
    const start = document.getElementById("cfgStartDate").value;
    const end = document.getElementById("cfgEndDate").value;
    const isPerm = document.getElementById("cfgActPermanent").checked;
    const perClaim = parseInt(document.getElementById("cfgPerClaimLimit").value, 10) || 1;
    const userLimit = parseInt(document.getElementById("cfgUserLimit").value, 10) || 1;
    const issueModes = Array.from(document.querySelectorAll('input[name="cfgIssueMode"]:checked')).map((el) => el.value);

    if (!name || !round || !sponsor) {
      showToast("校验失败：活动名称、期次、主办方为必填项（PRD R05）");
      return;
    }
    if (issueModes.length === 0) {
      showToast("校验失败：请至少选择一种号码发放方式（PRD R02）");
      return;
    }
    if (perClaim > userLimit) {
      showToast("校验失败：单次上限不得大于单人每期上限（PRD R02）");
      return;
    }
    if (!isPerm && start && end && end < start) {
      showToast("校验失败：活动结束时间不得早于开始时间（PRD R05）");
      return;
    }

    const formType = (document.querySelector('input[name="actFormType"]:checked') || {}).value || "站外抽奖";
    const eligibility = (document.querySelector('input[name="cfgEligibility"]:checked') || {}).value || "需登录平台账号";
    const drawMode = (document.querySelector('input[name="cfgDrawMode"]:checked') || {}).value || "人工触发开奖";
    const modeShort = issueModes.length === 2 ? "自选+随机" : issueModes[0];
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
        target.condition = `${eligibility} · 免费领号（${modeShort}）`;
        target.dispatchMode = drawMode;
        target.startTime = isPerm ? "不限" : start;
        target.endTime = isPerm ? "" : end;
        target.status = target.status === "草稿" ? targetStatus : target.status;
        target.banner = selectedBannerSrc;
        target.prizes = formPrizes.map((p) => ({ ...p }));
        target.kols = formKols.map((k) => ({ ...k }));
        target.settleCurrency = cfgSettleCurrency.value;
        target.unitRate = parseFloat(document.getElementById("cfgUnitRate").value) || 0;
        target.operateTime = nowStr();
      }
      addAuditLog("活动管理", "更新活动配置", `更新 ID:${editId}「${name}」（渠道数 ${formKols.length}，结算币种 ${cfgSettleCurrency.value}）。`);
      showToast(`活动「${name}」配置已更新并记录审计日志`);
    } else {
      const newAct = {
        id: Math.floor(120100 + Math.random() * 899),
        name,
        category: formType,
        currency: cfgSettleCurrency.value,
        type: selectedTypeChip,
        formType,
        condition: `${eligibility} · 免费领号（${modeShort}）`,
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
        totalPool: Math.max(100, parseInt(document.getElementById("cfgNumEnd").value, 10) || 100000),
        ruleVersion: targetStatus === "进行中" ? "v1.0" : "v0.1",
        prizes: formPrizes.map((p) => ({ ...p })),
        kols: formKols.map((k) => ({ ...k })),
        settleCurrency: cfgSettleCurrency.value,
        unitRate: parseFloat(document.getElementById("cfgUnitRate").value) || 0,
        isCoreLottery: true
      };
      activities.unshift(newAct);
      addAuditLog("活动管理", targetStatus === "进行中" ? "发布新活动" : "保存活动草稿", `创建 ID:${newAct.id}「${name}」（${round}），状态：${targetStatus}。`);
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
  // 3. 活动详情：号码池与开奖管理（含作废原因留痕 & 角色权限校验）
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
      <div class="detail-sum-box"><span>当前活动状态 / 规则版本</span><strong>${act.status}（${act.ruleVersion || "v1.0"}）</strong></div>
      <div class="detail-sum-box"><span>有效号码进度（待确认/作废不计入）</span><strong>${pct}% (${issued.toLocaleString()} / ${total.toLocaleString()})</strong></div>
      <div class="detail-sum-box"><span>开奖方式 / 结果依据</span><strong>${act.dispatchMode || "人工触发开奖"}</strong></div>
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
      .map((r) => {
        const stCls = r.status === "有效" ? "status-txt--running" : r.status === "待确认" ? "status-txt--pending" : "status-txt--closed";
        return `
          <tr>
            <td>${r.recordId}</td>
            <td><strong>${r.number}</strong></td>
            <td>${r.phone}</td>
            <td>${r.accountId}</td>
            <td>${r.mode}</td>
            <td>${r.kolId || "B0001"}</td>
            <td>${r.createdAt}</td>
            <td>
              <span class="status-txt ${stCls}">${r.status}</span>
              ${r.voidReason ? `<div style="font-size:10.5px;color:#ff4d4f;">原因：${r.voidReason}</div>` : ""}
            </td>
            <td>${r.drawStatus || "待开奖"}</td>
            <td>
              ${
                r.status === "有效" || r.status === "待确认"
                  ? `<button type="button" class="link-danger" data-void-rec="${r.recordId}" data-void-num="${r.number}">作废</button>`
                  : "-"
              }
            </td>
          </tr>
        `;
      })
      .join("");

    document.getElementById("detailTicketsBody").querySelectorAll("[data-void-rec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可操作号码作废（PRD R05）");
          return;
        }
        const reason = window.prompt(`请输入作废号码 ${btn.dataset.voidNum} 的原因（必填，将留痕记录）：`, "风控识别异常批量注册");
        if (!reason || !reason.trim()) {
          showToast("未填写作废原因，已取消作废操作");
          return;
        }
        const updated = loadMergedTickets().map((r) =>
          r.recordId === btn.dataset.voidRec ? { ...r, status: "作废", drawStatus: "未中奖", voidReason: reason.trim() } : r
        );
        saveMergedTickets(updated);
        addAuditLog("号码管理", "作废号码", `作废记录 ${btn.dataset.voidRec}（号码 ${btn.dataset.voidNum}），原因：${reason.trim()}`);
        renderDetailTickets(act);
        showToast(`号码 ${btn.dataset.voidNum} 已作废并留存原因`);
      });
    });
  }

  document.getElementById("openLotteryDetailTopBtn").addEventListener("click", () => openLotteryDetail(activities[0].id));
  document.getElementById("detailTicketSearch").addEventListener("input", () => renderDetailTickets(activities[0]));
  document.getElementById("detailTicketStatus").addEventListener("change", () => renderDetailTickets(activities[0]));

  document.getElementById("detailLockPoolBtn").addEventListener("click", () => {
    if (currentRole === "finance") {
      showToast("越权拦截：财务角色无权操作号码池锁定");
      return;
    }
    const main = activities[0];
    main.simulatedFull = true;
    main.status = "待开奖";
    addAuditLog("号码与开奖", "满额锁定号码池", `活动 ID:${main.id} 达到 100% 满额，停止发号并锁定有效号码清单进入「待开奖」。`);
    renderActivityTable();
    renderDetailTickets(main);
    showToast("已模拟达到 100% 满额，停止发号并进入「待开奖」");
  });

  document.getElementById("detailTriggerDrawBtn").addEventListener("click", () => {
    if (currentRole !== "draw") {
      showToast("越权拦截：请先在右上角切换为「Alice（开奖授权员）」再执行开奖（PRD R04/R05）");
      return;
    }
    const main = activities[0];
    if (main.status !== "待开奖" && main.status !== "已开奖") {
      showToast("未达到满额开奖条件，请先点击「模拟满额锁池 (100%)」（PRD R04）");
      return;
    }
    if (main.status === "已开奖") {
      showToast(`幂等保护：本期已开奖，沿用既有公示号码 ${main.winningNumber}`);
      return;
    }
    const list = loadMergedTickets();
    const valid = list.filter((r) => r.status === "有效");
    const winTicket = valid[0] || { number: "052818", phone: "13800138000", accountId: "UID_880123" };
    const winNum = winTicket.number;
    const drawTime = nowStr();
    main.status = "已开奖";
    main.winningNumber = winNum;
    drawResults.unshift({
      round: "第 202601 期",
      prize: "一等奖 本田 Fan 160 2025",
      drawnAt: drawTime,
      winNumber: winNum,
      winnerAccount: winTicket.phone,
      winnerId: winTicket.accountId
    });
    saveMergedTickets(list.map((r) => (r.status === "有效" ? { ...r, drawStatus: r.number === winNum ? "已中奖" : "未中奖" } : r)));
    addAuditLog("号码与开奖", "执行开奖并公示", `按规则版本 ${main.ruleVersion || "v1.0"} 人工触发开奖，中奖号码 ${winNum} 已入库并公示。`);
    renderActivityTable();
    renderDetailTickets(main);
    showToast(`开奖成功并已前台公示！中奖号码：${winNum}`);
  });

  // ===========================
  // 4. 活动明细 3 页签弹窗（参与详情 / 抽奖结果 / 结算明细）
  // ===========================
  function switchActivityDetailTab(tabName) {
    document.querySelectorAll("[data-detail-tab]").forEach((btn) => {
      const active = btn.dataset.detailTab === tabName;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });
    ["participation", "results", "settlement"].forEach((key) => {
      const pane = document.getElementById(`pane-${key}`);
      if (pane) pane.hidden = key !== tabName;
    });
    if (tabName === "participation") renderParticipationRows();
    else if (tabName === "results") renderDrawResultsRows();
    else if (tabName === "settlement") renderSettlementRows();
  }

  document.querySelectorAll("[data-detail-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchActivityDetailTab(btn.dataset.detailTab));
  });

  function openActivityDetailsModal(initialTab = "participation", actId = activities[0].id) {
    const act = activities.find((a) => a.id === actId) || activities[0];
    document.getElementById("actDetailsModalTitle").textContent = `活动明细 · ${act.name}（ID: ${act.id}）`;
    switchActivityDetailTab(initialTab);
    openModal("settlementModal");
  }

  // 页签 1：参与详情（注册时间、账号、ID、领取时间、期号、抽奖号码；支持搜索查询）
  function renderParticipationRows() {
    const roundVal = document.getElementById("partRoundFilter").value;
    const kw = (document.getElementById("partSearchInput").value || "").trim().toLowerCase();

    const rows = loadMergedTickets().map((r) => ({
      round: r.round || "第 202601 期",
      account: r.phone || "--",
      accountId: r.accountId || "--",
      registeredAt: r.registeredAt || r.createdAt || "--",
      claimedAt: r.createdAt || "--",
      number: r.number || "--",
      mode: r.mode || "手动选择号码",
      kolId: r.kolId || "B0001"
    }));

    const filtered = rows.filter((r) => {
      if (roundVal !== "all" && r.round !== roundVal) return false;
      if (kw && !`${r.round} ${r.account} ${r.accountId} ${r.number}`.toLowerCase().includes(kw)) return false;
      return true;
    });

    document.getElementById("partCountTip").textContent = `共 ${filtered.length} 条参与记录`;

    if (filtered.length === 0) {
      document.getElementById("participationTableBody").innerHTML = `<tr><td colspan="8" style="padding:28px;color:#999;">暂无匹配的参与详情记录</td></tr>`;
      return;
    }

    document.getElementById("participationTableBody").innerHTML = filtered
      .map(
        (r) => `
          <tr>
            <td>${r.round}</td>
            <td><strong>${r.account}</strong></td>
            <td>${r.accountId}</td>
            <td style="white-space:nowrap;">${r.registeredAt}</td>
            <td style="white-space:nowrap;">${r.claimedAt}</td>
            <td><span class="win-num-pill">${r.number}</span></td>
            <td>${r.mode}</td>
            <td>${r.kolId}</td>
          </tr>
        `
      )
      .join("");
  }

  document.getElementById("partSearchBtn").addEventListener("click", renderParticipationRows);
  document.getElementById("partRoundFilter").addEventListener("change", renderParticipationRows);
  document.getElementById("partSearchInput").addEventListener("input", renderParticipationRows);
  document.getElementById("partResetBtn").addEventListener("click", () => {
    document.getElementById("partRoundFilter").value = "all";
    document.getElementById("partSearchInput").value = "";
    renderParticipationRows();
  });

  // 页签 2：抽奖结果（期号、开奖时间、中奖号码、中奖者账号、中奖者ID；支持搜索查询）
  function renderDrawResultsRows() {
    const roundVal = document.getElementById("resRoundFilter").value;
    const kw = (document.getElementById("resSearchInput").value || "").trim().toLowerCase();

    const filtered = drawResults.filter((r) => {
      if (roundVal !== "all" && r.round !== roundVal) return false;
      if (kw && !`${r.round} ${r.winNumber} ${r.winnerAccount} ${r.winnerId} ${r.prize}`.toLowerCase().includes(kw)) {
        return false;
      }
      return true;
    });

    document.getElementById("resCountTip").textContent = `共 ${filtered.length} 条中奖记录`;

    if (filtered.length === 0) {
      document.getElementById("drawResultsTableBody").innerHTML = `<tr><td colspan="6" style="padding:28px;color:#999;">暂无匹配的抽奖结果记录</td></tr>`;
      return;
    }

    document.getElementById("drawResultsTableBody").innerHTML = filtered
      .map(
        (r) => `
          <tr>
            <td>${r.round}</td>
            <td>${r.prize}</td>
            <td style="white-space:nowrap;">${r.drawnAt}</td>
            <td><span class="win-num-pill">${r.winNumber}</span></td>
            <td><strong>${r.winnerAccount}</strong></td>
            <td>${r.winnerId}</td>
          </tr>
        `
      )
      .join("");
  }

  document.getElementById("resSearchBtn").addEventListener("click", renderDrawResultsRows);
  document.getElementById("resRoundFilter").addEventListener("change", renderDrawResultsRows);
  document.getElementById("resSearchInput").addEventListener("input", renderDrawResultsRows);
  document.getElementById("resResetBtn").addEventListener("click", () => {
    document.getElementById("resRoundFilter").value = "all";
    document.getElementById("resSearchInput").value = "";
    renderDrawResultsRows();
  });

  // 页签 3：结算明细（支持根据期号统计与查询）
  function getFilteredSettlements() {
    const roundVal = document.getElementById("settleRoundFilter").value;
    const statusVal = document.getElementById("settleStatusFilter").value;
    const kw = (document.getElementById("settleSearchInput").value || "").trim().toLowerCase();

    return settlements.filter((s) => {
      if (roundVal !== "all" && s.round !== roundVal) return false;
      if (statusVal !== "all" && s.status !== statusVal) return false;
      if (kw && !`${s.id} ${s.round} ${s.kolCode} ${s.kolName}`.toLowerCase().includes(kw)) return false;
      return true;
    });
  }

  function renderSettlementRows() {
    const roundVal = document.getElementById("settleRoundFilter").value;
    const list = getFilteredSettlements();

    // 按当前筛选期号动态统计汇总
    const sumClicks = list.reduce((acc, s) => acc + s.clicks, 0);
    const sumReg = list.reduce((acc, s) => acc + s.registered, 0);
    const sumValid = list.reduce((acc, s) => acc + s.validReg, 0);
    const sumExcluded = list.reduce((acc, s) => acc + s.excluded, 0);
    const sumPayable = list.reduce((acc, s) => acc + s.validReg * s.unitRate + s.adjust, 0);

    document.getElementById("settleSummaryBar").innerHTML = `
      <div class="detail-sum-box"><span>统计期号</span><strong>${roundVal === "all" ? "全部期号" : roundVal}（${list.length} 单）</strong></div>
      <div class="detail-sum-box"><span>汇总点击 / 注册量</span><strong>${sumClicks.toLocaleString()} / ${sumReg.toLocaleString()}</strong></div>
      <div class="detail-sum-box"><span>汇总有效注册（排除异常）</span><strong>${sumValid.toLocaleString()}（排除 ${sumExcluded}）</strong></div>
      <div class="detail-sum-box"><span>汇总应付总额</span><strong style="color:#1890ff;">BRL ${sumPayable.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
    `;

    if (list.length === 0) {
      document.getElementById("settlementModalBody").innerHTML = `<tr><td colspan="11" style="padding:28px;color:#999;">当前期号下暂无匹配的结算单</td></tr>`;
      return;
    }

    document.getElementById("settlementModalBody").innerHTML = list
      .map((s) => {
        const total = s.validReg * s.unitRate + s.adjust;
        const cls = s.status === "已付款" ? "status-txt--running" : s.status === "已确认" ? "status-txt--drawn" : "status-txt--pending";
        return `
          <tr>
            <td>${s.round}</td>
            <td>${s.id}</td>
            <td><strong>${s.kolCode}</strong><br/><span style="color:#888;">${s.kolName}</span></td>
            <td>${s.period}</td>
            <td>点击 ${s.clicks.toLocaleString()}<br/>注册 ${s.registered.toLocaleString()}</td>
            <td>${s.rateVer}<br/>${s.currency} ${s.unitRate.toFixed(2)}</td>
            <td><strong>${s.validReg}</strong> 有效<br/><span style="color:#999;">排除 ${s.excluded}</span></td>
            <td style="color:${s.adjust < 0 ? "#ff4d4f" : "#333"};">
              ${s.adjust >= 0 ? `+${s.adjust.toFixed(2)}` : `-${Math.abs(s.adjust).toFixed(2)}`}
              ${s.adjustReason ? `<div style="font-size:10.5px;color:#666;">${s.adjustReason}</div>` : ""}
            </td>
            <td><strong>${s.currency} ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></td>
            <td>
              <span class="status-txt ${cls}">${s.status}</span>
              ${s.voucher ? `<div style="font-size:10px;color:#666;">${s.voucher}<br/>${s.paidAt}</div>` : ""}
            </td>
            <td>
              ${s.status === "待核对" ? `<button type="button" class="link-blue" data-set-confirm="${s.id}">财务确认</button>` : ""}
              ${
                s.status === "已确认"
                  ? `<button type="button" class="link-blue" data-set-adjust="${s.id}">调账</button><button type="button" class="link-blue" data-set-pay="${s.id}">登记付款</button>`
                  : ""
              }
              ${s.status === "已付款" ? `<span style="color:#999;">已完结</span>` : ""}
            </td>
          </tr>
        `;
      })
      .join("");

    document.getElementById("settlementModalBody").querySelectorAll("[data-set-confirm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：请先在右上角切换为「Bob（财务审核员）」执行确认（PRD R05/R07）");
          return;
        }
        const s = settlements.find((x) => x.id === btn.dataset.setConfirm);
        if (!s) return;
        s.status = "已确认";
        addAuditLog("推广结算", "财务确认结算单", `结算单 ${s.id}（${s.round}）已确认锁定（有效注册 ${s.validReg}，费率版本 ${s.rateVer}）。`);
        renderSettlementRows();
        showToast(`结算单 ${s.id} 已确认锁定明细与费率版本`);
      });
    });

    document.getElementById("settlementModalBody").querySelectorAll("[data-set-adjust]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：仅「财务审核员」可登记调账记录（PRD R07）");
          return;
        }
        const s = settlements.find((x) => x.id === btn.dataset.setAdjust);
        if (!s) return;
        const amtRaw = window.prompt(`请输入结算单 ${s.id} 调整金额（${s.currency}，扣减填负数如 -50）：`, "-50");
        if (amtRaw === null) return;
        const amt = parseFloat(amtRaw);
        if (Number.isNaN(amt)) {
          showToast("调整金额格式不正确");
          return;
        }
        const reason = window.prompt("请输入调账原因（必填，将写入财务留痕）：", "事后风控复核剔除异常账号");
        if (!reason || !reason.trim()) {
          showToast("未填写调账原因，已取消操作");
          return;
        }
        s.adjust += amt;
        s.adjustReason = s.adjustReason ? `${s.adjustReason}；${reason.trim()}` : reason.trim();
        addAuditLog("推广结算", "登记调账记录", `结算单 ${s.id} 调账 ${amt >= 0 ? "+" : ""}${amt.toFixed(2)} ${s.currency}，原因：${reason.trim()}`);
        renderSettlementRows();
        showToast("已完成调账并留痕记录");
      });
    });

    document.getElementById("settlementModalBody").querySelectorAll("[data-set-pay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：仅「财务审核员」可登记付款凭证（PRD R05/R07）");
          return;
        }
        const s = settlements.find((x) => x.id === btn.dataset.setPay);
        if (!s) return;
        const voucher = window.prompt(`请输入结算单 ${s.id} 的付款凭证号/流水号：`, `PIX-${Date.now().toString().slice(-8)}`);
        if (!voucher || !voucher.trim()) return;
        s.status = "已付款";
        s.voucher = voucher.trim();
        s.paidAt = nowStr();
        addAuditLog("推广结算", "登记付款凭证", `结算单 ${s.id} 已标记付款，凭证号：${s.voucher}。`);
        renderSettlementRows();
        showToast(`结算单 ${s.id} 已登记付款凭证 ${s.voucher}`);
      });
    });
  }

  document.getElementById("settleSearchBtn").addEventListener("click", renderSettlementRows);
  document.getElementById("settleRoundFilter").addEventListener("change", renderSettlementRows);
  document.getElementById("settleStatusFilter").addEventListener("change", renderSettlementRows);
  document.getElementById("settleSearchInput").addEventListener("input", renderSettlementRows);
  document.getElementById("settleResetBtn").addEventListener("click", () => {
    document.getElementById("settleRoundFilter").value = "all";
    document.getElementById("settleStatusFilter").value = "all";
    document.getElementById("settleSearchInput").value = "";
    renderSettlementRows();
  });

  document.getElementById("openSettlementFromStatsBtn").addEventListener("click", () => openActivityDetailsModal("settlement"));

  // ===========================
  // 5. 配置项问号 Hover 智能气泡提示（防裁切）
  // ===========================
  const hoverTipEl = document.createElement("div");
  hoverTipEl.className = "erp-hover-tooltip";
  hoverTipEl.hidden = true;
  document.body.appendChild(hoverTipEl);

  function showHelpTooltip(target) {
    const text = target.getAttribute("data-tip-text");
    if (!text) return;
    hoverTipEl.textContent = text;
    hoverTipEl.hidden = false;
    const rect = target.getBoundingClientRect();
    const tipRect = hoverTipEl.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(10, Math.min(window.innerWidth - tipRect.width - 10, left));
    let top = rect.top - tipRect.height - 8;
    if (top < 58) {
      top = rect.bottom + 8;
    }
    hoverTipEl.style.left = `${left}px`;
    hoverTipEl.style.top = `${top}px`;
  }

  function hideHelpTooltip() {
    hoverTipEl.hidden = true;
  }

  document.querySelectorAll(".help-q[data-tip-text]").forEach((el) => {
    el.addEventListener("mouseenter", () => showHelpTooltip(el));
    el.addEventListener("mouseleave", hideHelpTooltip);
    el.addEventListener("focus", () => showHelpTooltip(el));
    el.addEventListener("blur", hideHelpTooltip);
  });

  document.getElementById("createActivityForm").addEventListener("scroll", hideHelpTooltip, { passive: true });
  document.getElementById("exportSettlementCsvBtn").addEventListener("click", () => {
    const header = ["期号", "结算单号", "博主标识", "博主名称", "周期", "点击量", "注册成功量", "费率版本", "币种", "单价", "有效注册", "排除异常", "调账金额", "调账原因", "应付总额", "状态", "付款时间", "付款凭证"];
    const rows = getFilteredSettlements().map((s) => [
      s.round,
      s.id,
      s.kolCode,
      s.kolName,
      s.period,
      s.clicks,
      s.registered,
      s.rateVer,
      s.currency,
      s.unitRate.toFixed(2),
      s.validReg,
      s.excluded,
      s.adjust.toFixed(2),
      s.adjustReason,
      (s.validReg * s.unitRate + s.adjust).toFixed(2),
      s.status,
      s.paidAt,
      s.voucher
    ]);
    const csv = "\uFEFF" + [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "巴西站-站外抽奖博主结算对账单.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("已导出完整 CSV 结算对账单");
  });

  document.getElementById("openGlobalSettingsBtn").addEventListener("click", () => {
    showToast("活动全局设置：默认归因窗口 7 天，满额自动锁池，角色权限按 R05 隔离");
  });
  document.getElementById("openTutorialBtn").addEventListener("click", () => {
    showToast("操作提示：右上角可切换「运营/开奖授权/财务」角色，测试完整 PRD 权限与留痕闭环");
  });
  document.querySelectorAll("[data-tip]").forEach((btn) => {
    btn.addEventListener("click", () => showToast(btn.dataset.tip));
  });

  function openModal(id) {
    document.getElementById(id).hidden = false;
  }
  function closeModal(id) {
    document.getElementById(id).hidden = true;
  }
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });

  renderActivityTable();
  renderAuditLogs();
})();
