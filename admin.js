(() => {
  const H5_RECORDS_KEY = "fan160_prd_records_v2";
  const BASE_ISSUED = 53000;

  const ROLE_NAMES = {
    ops: "运营管理员",
    draw: "开奖授权员",
    finance: "财务审核员"
  };

  const TAB_TITLES = {
    activities: "活动管理与配置",
    tickets: "号码记录与开奖",
    channels: "博主渠道与归因",
    settlement: "推广结算对账",
    logs: "操作审计日志"
  };

  // 初始数据
  let activities = [
    {
      id: "FAN160_2026",
      round: "第 202601 期",
      name: "本田 Fan 160 2025 编号抽奖",
      sponsor: "塔瓦雷斯活动方",
      range: "000001 - 100000（6位）",
      total: 100000,
      simulatedFull: false,
      startTime: "2026-11-18 00:00",
      endTime: "2026-12-18 23:59",
      ruleVersion: "v1.0（已冻结）",
      status: "进行中", // 草稿 | 进行中 | 待开奖 | 已开奖 | 已取消
      lockedAt: "",
      drawnAt: "",
      winningNumber: ""
    },
    {
      id: "FAN160_2026_02",
      round: "第 202602 期",
      name: "iPhone 17 Pro Max 迎新编号抽奖",
      sponsor: "塔瓦雷斯活动方",
      range: "000001 - 050000（6位）",
      total: 50000,
      simulatedFull: false,
      startTime: "2026-12-20 00:00",
      endTime: "2027-01-20 23:59",
      ruleVersion: "v0.1（草稿）",
      status: "草稿",
      lockedAt: "",
      drawnAt: "",
      winningNumber: ""
    }
  ];

  let kolChannels = [
    {
      kolId: "KOL_Tavares44",
      name: "Tavares 44 官方主号",
      clicks: 14820,
      registered: 2416,
      validReg: 2180,
      status: "生效中"
    },
    {
      kolId: "KOL_MotoBrasil",
      name: "巴西机车测评社",
      clicks: 8340,
      registered: 1125,
      validReg: 980,
      status: "生效中"
    },
    {
      kolId: "KOL_Demo01",
      name: "测试合作博主 01",
      clicks: 1290,
      registered: 162,
      validReg: 138,
      status: "已停用"
    }
  ];

  let settlements = [
    {
      id: "SET-202611-01",
      kolId: "KOL_Tavares44",
      activity: "第 202601 期 · 本田 Fan 160",
      period: "2026-11-01 ~ 2026-11-15",
      rateVersion: "RATE-v1.0",
      unitPrice: 2.5,
      currency: "USD",
      validCount: 1420,
      excludedCount: 158,
      adjustAmount: 0,
      adjustments: [],
      status: "待核对", // 待核对 | 已确认 | 已付款
      paidAt: "",
      voucherNo: ""
    },
    {
      id: "SET-202611-02",
      kolId: "KOL_MotoBrasil",
      activity: "第 202601 期 · 本田 Fan 160",
      period: "2026-11-01 ~ 2026-11-15",
      rateVersion: "RATE-v1.0",
      unitPrice: 2.2,
      currency: "USD",
      validCount: 680,
      excludedCount: 74,
      adjustAmount: -44.0,
      adjustments: [{ time: "2026-11-19 10:12", amount: -44.0, reason: "复核剔除 20 笔同设备异常注册" }],
      status: "已确认",
      paidAt: "",
      voucherNo: ""
    },
    {
      id: "SET-202610-09",
      kolId: "KOL_Tavares44",
      activity: "第 202510 期 · 往期预热活动",
      period: "2026-10-16 ~ 2026-10-31",
      rateVersion: "RATE-v0.9",
      unitPrice: 2.0,
      currency: "USD",
      validCount: 950,
      excludedCount: 61,
      adjustAmount: 0,
      adjustments: [],
      status: "已付款",
      paidAt: "2026-11-05 16:40",
      voucherNo: "PAY-USDT-202611058841"
    }
  ];

  let auditLogs = [
    {
      time: "2026-11-21 15:20:00",
      role: "运营管理员",
      module: "活动管理",
      action: "发布并冻结规则版本",
      detail: "发布第 202601 期「本田 Fan 160 2025」，号码池 000001-100000，冻结版本 v1.0。"
    },
    {
      time: "2026-11-19 10:12:45",
      role: "财务审核员",
      module: "推广结算",
      action: "确认结算单并记录调账",
      detail: "结算单 SET-202611-02 已确认锁定，调账 -$44.00（原因：复核剔除 20 笔同设备异常注册）。"
    }
  ];

  // 本地号码池（合并 H5 端写入记录 + 后台预置样本）
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
      isNewRegistration: false,
      voidReason: "",
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
      drawStatus: "已中奖",
      kolId: "KOL_Tavares44",
      isNewRegistration: true,
      voidReason: "",
      createdAt: "2026-11-20 19:22:08"
    },
    {
      recordId: "REC-20261120-008",
      accountId: "UID_661092",
      phone: "13788890011",
      nickname: "风控样本号",
      number: "052822",
      mode: "手动选择号码",
      status: "作废",
      drawStatus: "未中奖",
      kolId: "KOL_MotoBrasil",
      isNewRegistration: false,
      voidReason: "同设备高频批量注册，风控判定无效",
      createdAt: "2026-11-20 11:05:31"
    }
  ];

  let currentRole = "ops";
  let selectedSettlementId = settlements[0].id;
  let pendingVoidRecordId = null;
  let pendingFinContext = null;
  let toastTimer = null;

  // DOM
  const roleSelect = document.getElementById("roleSelect");
  const topbarTitle = document.getElementById("topbarTitle");
  const adminToast = document.getElementById("adminToast");

  const activityKpis = document.getElementById("activityKpis");
  const activityTableBody = document.getElementById("activityTableBody");
  const drawStatusDesc = document.getElementById("drawStatusDesc");
  const drawMetaGrid = document.getElementById("drawMetaGrid");
  const ticketsTableBody = document.getElementById("ticketsTableBody");
  const ticketSearchInput = document.getElementById("ticketSearchInput");
  const ticketStatusFilter = document.getElementById("ticketStatusFilter");

  const kolTableBody = document.getElementById("kolTableBody");
  const attributionTableBody = document.getElementById("attributionTableBody");
  const settlementTableBody = document.getElementById("settlementTableBody");
  const settlementDetailTitle = document.getElementById("settlementDetailTitle");
  const settlementDetailSub = document.getElementById("settlementDetailSub");
  const settlementDetailBody = document.getElementById("settlementDetailBody");
  const auditLogsBody = document.getElementById("auditLogsBody");

  function showToast(msg) {
    adminToast.textContent = msg;
    adminToast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      adminToast.hidden = true;
    }, 2600);
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
      role: ROLE_NAMES[currentRole],
      module,
      action,
      detail
    });
    renderAuditLogs();
  }

  function loadMergedTickets() {
    let h5List = [];
    try {
      const raw = localStorage.getItem(H5_RECORDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) h5List = parsed;
      }
    } catch {
      h5List = [];
    }

    const byId = new Map();
    h5List.forEach((r) => byId.set(r.recordId, { ...r, drawStatus: r.drawStatus || "待开奖", voidReason: r.voidReason || "" }));
    SEED_TICKETS.forEach((r) => {
      if (!byId.has(r.recordId)) byId.set(r.recordId, { ...r });
    });
    return Array.from(byId.values());
  }

  function saveMergedTickets(list) {
    try {
      localStorage.setItem(H5_RECORDS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  function getMainActivityIssuedCount() {
    const mainAct = activities[0];
    if (mainAct.simulatedFull) return mainAct.total;
    const all = loadMergedTickets();
    const validInStorage = all.filter((r) => r.status === "有效").length;
    const extra = Math.max(0, validInStorage - 2);
    return Math.min(mainAct.total, BASE_ISSUED + extra);
  }

  // ===========================
  // Tab 导航
  // ===========================
  function switchTab(tab) {
    document.querySelectorAll(".side-nav-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.tab === tab);
    });
    document.querySelectorAll(".admin-section").forEach((sec) => {
      sec.hidden = sec.id !== `tab-${tab}`;
    });
    topbarTitle.textContent = TAB_TITLES[tab] || "站点后台";
    if (window.location.hash !== `#${tab}`) {
      history.replaceState(null, "", `#${tab}`);
    }
  }

  document.querySelectorAll(".side-nav-item").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  roleSelect.addEventListener("change", () => {
    currentRole = roleSelect.value;
    showToast(`已切换当前后台角色为：${ROLE_NAMES[currentRole]}`);
  });

  // ===========================
  // 1. 活动管理渲染
  // ===========================
  function renderStatusBadge(status) {
    const map = {
      进行中: "badge--green",
      待开奖: "badge--amber",
      已开奖: "badge--blue",
      草稿: "badge--gray",
      已取消: "badge--red"
    };
    return `<span class="badge ${map[status] || "badge--gray"}">${status}</span>`;
  }

  function renderActivities() {
    const mainAct = activities[0];
    const issued = getMainActivityIssuedCount();
    let pct = Math.floor((issued / mainAct.total) * 100);
    if (issued < mainAct.total && pct >= 100) pct = 99;

    const totalValidReg = kolChannels.reduce((s, k) => s + k.validReg, 0);
    const pendingSettleAmt = settlements
      .filter((s) => s.status !== "已付款")
      .reduce((sum, s) => sum + s.validCount * s.unitPrice + s.adjustAmount, 0);

    activityKpis.innerHTML = `
      <div class="kpi-card">
        <div class="kpi-label">本期有效号码进度（第 202601 期）</div>
        <div class="kpi-value">${pct}%</div>
        <div class="kpi-sub">有效 ${issued.toLocaleString()} / ${mainAct.total.toLocaleString()}（未满额不进位）</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">当前活动状态</div>
        <div class="kpi-value">${mainAct.status}</div>
        <div class="kpi-sub">规则版本 ${mainAct.ruleVersion}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">博主累计有效注册</div>
        <div class="kpi-value">${totalValidReg.toLocaleString()}</div>
        <div class="kpi-sub">活跃推广渠道 ${kolChannels.filter((k) => k.status === "生效中").length} 个</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">待结算应付金额</div>
        <div class="kpi-value">$${pendingSettleAmt.toFixed(2)}</div>
        <div class="kpi-sub">含待核对与已确认未付款结算单</div>
      </div>
    `;

    activityTableBody.innerHTML = activities
      .map((act, idx) => {
        const curIssued = idx === 0 ? issued : 0;
        let curPct = Math.floor((curIssued / act.total) * 100);
        if (curIssued < act.total && curPct >= 100) curPct = 99;
        return `
          <tr>
            <td>
              <strong>${act.name}</strong><br/>
              <span style="color:#64748b;font-size:11.5px;">${act.round} · ${act.id}</span>
            </td>
            <td>${act.sponsor}</td>
            <td><span class="code-chip">${act.range}</span></td>
            <td>
              <div class="mini-progress"><i style="width:${curPct}%"></i></div>
              <span style="font-size:11.5px;color:#475569;">${curPct}% (${curIssued.toLocaleString()} / ${act.total.toLocaleString()})</span>
            </td>
            <td style="font-size:11.5px;">${act.startTime}<br/>至 ${act.endTime}</td>
            <td>${act.ruleVersion}</td>
            <td>${renderStatusBadge(act.status)}</td>
            <td>
              <button type="button" class="btn-link-sm" data-act-jump="${act.id}">查看号码</button>
              ${
                act.status === "草稿"
                  ? `<button type="button" class="btn-link-sm" data-act-publish="${act.id}">发布</button>`
                  : ""
              }
            </td>
          </tr>
        `;
      })
      .join("");

    activityTableBody.querySelectorAll("[data-act-jump]").forEach((btn) => {
      btn.addEventListener("click", () => switchTab("tickets"));
    });

    activityTableBody.querySelectorAll("[data-act-publish]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可执行活动发布操作（PRD R05）");
          return;
        }
        const target = activities.find((a) => a.id === btn.dataset.actPublish);
        if (!target) return;
        target.status = "进行中";
        target.ruleVersion = "v1.0（已冻结）";
        addAuditLog("活动管理", "发布活动期次", `发布 ${target.round}「${target.name}」，配置已冻结为 v1.0。`);
        renderActivities();
        showToast(`${target.round} 已发布上线`);
      });
    });
  }

  function simulateFullAndLock() {
    if (currentRole !== "ops" && currentRole !== "draw") {
      showToast("越权拦截：财务角色无权操作号码池锁定（PRD R05）");
      return;
    }
    const mainAct = activities[0];
    if (mainAct.status === "已开奖") {
      showToast("本期活动已完成开奖公示");
      return;
    }
    mainAct.simulatedFull = true;
    mainAct.status = "待开奖";
    mainAct.lockedAt = nowStr();
    addAuditLog("号码与开奖", "满额锁定号码池", `第 202601 期有效号码达 100%（100,000/100,000），停止发号并锁定清单进入「待开奖」。`);
    renderActivities();
    renderDrawPanel();
    showToast("第 202601 期已达到 100% 并锁定号码池，进入「待开奖」状态");
  }

  document.getElementById("simulateFullBtn").addEventListener("click", simulateFullAndLock);
  document.getElementById("lockPoolFromDrawBtn").addEventListener("click", simulateFullAndLock);

  // 新建活动配置
  document.getElementById("openCreateActivityBtn").addEventListener("click", () => {
    if (currentRole !== "ops") {
      showToast("越权拦截：仅「运营管理员」可新建活动配置（PRD R05）");
      return;
    }
    openModal("activityModal");
  });

  document.getElementById("activityForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("actName").value.trim();
    const round = document.getElementById("actRound").value.trim();
    const sponsor = document.getElementById("actSponsor").value.trim();
    const total = parseInt(document.getElementById("actTotal").value, 10);
    const start = document.getElementById("actStart").value;
    const end = document.getElementById("actEnd").value;

    if (!name || !round || !sponsor || !start || !end) {
      showToast("请填写全部必填字段");
      return;
    }
    if (new Date(end) <= new Date(start)) {
      showToast("校验失败：截止时间不得早于或等于开始时间（PRD R05）");
      return;
    }

    const newId = `ACT_${Date.now().toString().slice(-6)}`;
    activities.unshift({
      id: newId,
      round,
      name,
      sponsor,
      range: `000001 - ${String(total).padStart(6, "0")}（6位）`,
      total,
      simulatedFull: false,
      startTime: start.replace("T", " "),
      endTime: end.replace("T", " "),
      ruleVersion: "v1.0（已冻结）",
      status: "进行中",
      lockedAt: "",
      drawnAt: "",
      winningNumber: ""
    });

    addAuditLog("活动管理", "新建并发布活动", `创建 ${round}「${name}」（总量 ${total}），规则版本冻结为 v1.0。`);
    closeModal("activityModal");
    renderActivities();
    showToast(`已发布活动：${round}`);
  });

  // ===========================
  // 2. 号码明细与开奖公示渲染
  // ===========================
  function renderDrawPanel() {
    const mainAct = activities[0];
    const issued = getMainActivityIssuedCount();
    drawStatusDesc.textContent =
      mainAct.status === "已开奖"
        ? `本期已于 ${mainAct.drawnAt} 完成开奖并公示，中奖号码：${mainAct.winningNumber}（重复触发将沿用既有结果）。`
        : mainAct.status === "待开奖"
        ? `号码池已于 ${mainAct.lockedAt} 锁定，已满足开奖条件，请切换「开奖授权员」角色执行开奖。`
        : `当前进度 ${Math.floor((issued / mainAct.total) * 100)}%，未达 100% 满额条件时系统禁止提前开奖（PRD R04）。`;

    drawMetaGrid.innerHTML = `
      <div class="draw-meta-box"><span>当前期次状态</span><strong>${mainAct.status}</strong></div>
      <div class="draw-meta-box"><span>冻结规则版本</span><strong>${mainAct.ruleVersion}</strong></div>
      <div class="draw-meta-box"><span>锁池快照时间</span><strong>${mainAct.lockedAt || "尚未满额锁池"}</strong></div>
      <div class="draw-meta-box"><span>大奖公示号码</span><strong style="color:#16a34a;">${mainAct.winningNumber || "待开奖"}</strong></div>
    `;
  }

  document.getElementById("triggerDrawBtn").addEventListener("click", () => {
    const mainAct = activities[0];
    if (currentRole !== "draw") {
      showToast("越权拦截：仅「开奖授权员」可执行开奖操作（PRD R04/R05）");
      return;
    }
    if (mainAct.status === "已开奖") {
      showToast(`幂等保护：本期已开奖，沿用既有中奖号码 ${mainAct.winningNumber}`);
      return;
    }
    if (mainAct.status !== "待开奖") {
      showToast("未达到开奖条件：请先满额锁定号码池进入「待开奖」状态（PRD R04）");
      return;
    }

    const list = loadMergedTickets();
    const validTickets = list.filter((r) => r.status === "有效");
    const winner = validTickets[0] ? validTickets[0].number : "052818";

    mainAct.status = "已开奖";
    mainAct.drawnAt = nowStr();
    mainAct.winningNumber = winner;

    // 同步更新中奖记录的 drawStatus
    const updated = list.map((r) => {
      if (r.status !== "有效") return r;
      return { ...r, drawStatus: r.number === winner ? "已中奖" : "未中奖" };
    });
    saveMergedTickets(updated);

    addAuditLog("号码与开奖", "执行开奖并公示", `按规则版本 ${mainAct.ruleVersion} 开奖，大奖号码 ${winner} 已入库并推送前台公示。`);
    renderActivities();
    renderDrawPanel();
    renderTickets();
    showToast(`开奖成功并已公示！大奖号码：${winner}`);
  });

  function renderTickets() {
    const kw = (ticketSearchInput.value || "").trim().toLowerCase();
    const statusFilter = ticketStatusFilter.value;
    const list = loadMergedTickets().filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (kw) {
        const hay = `${r.recordId} ${r.number} ${r.accountId} ${r.phone} ${r.nickname || ""}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });

    if (list.length === 0) {
      ticketsTableBody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:#94a3b8;padding:24px;">暂无符合条件的号码记录</td></tr>`;
      return;
    }

    ticketsTableBody.innerHTML = list
      .map((r) => {
        const stCls = r.status === "有效" ? "badge--green" : r.status === "作废" ? "badge--red" : "badge--amber";
        const drCls =
          r.drawStatus === "已中奖" ? "badge--green" : r.drawStatus === "未中奖" ? "badge--gray" : "badge--amber";
        return `
          <tr>
            <td><span class="code-chip">${r.recordId}</span></td>
            <td><strong>${r.number}</strong></td>
            <td>${r.phone}<br/><span style="font-size:11px;color:#64748b;">${r.accountId}</span></td>
            <td>${r.mode}</td>
            <td>${r.kolId || "无有效来源"}</td>
            <td>${r.createdAt}</td>
            <td>
              <span class="badge ${stCls}">${r.status}</span>
              ${r.voidReason ? `<div style="font-size:11px;color:#b91c1c;margin-top:3px;">原因：${r.voidReason}</div>` : ""}
            </td>
            <td><span class="badge ${drCls}">${r.drawStatus || "待开奖"}</span></td>
            <td>
              ${
                r.status === "有效"
                  ? `<button type="button" class="btn-link-sm btn-link-sm--danger" data-void-id="${r.recordId}" data-void-num="${r.number}">作废</button>`
                  : `<span style="color:#94a3b8;">—</span>`
              }
            </td>
          </tr>
        `;
      })
      .join("");

    ticketsTableBody.querySelectorAll("[data-void-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可操作号码作废");
          return;
        }
        pendingVoidRecordId = btn.dataset.voidId;
        document.getElementById("voidTargetInfo").textContent = `即将作废号码：${btn.dataset.voidNum}（作废后将从活动进度扣除并记录原因）`;
        document.getElementById("voidReasonInput").value = "";
        openModal("voidModal");
      });
    });
  }

  document.getElementById("voidForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const reason = document.getElementById("voidReasonInput").value.trim();
    if (!reason || !pendingVoidRecordId) return;

    const list = loadMergedTickets().map((r) =>
      r.recordId === pendingVoidRecordId ? { ...r, status: "作废", drawStatus: "未中奖", voidReason: reason } : r
    );
    saveMergedTickets(list);
    addAuditLog("号码与开奖", "作废号码", `记录 ${pendingVoidRecordId} 已标记作废，原因：${reason}`);
    closeModal("voidModal");
    renderActivities();
    renderTickets();
    showToast("号码已作废并留存原因，进度已同步扣减");
  });

  ticketSearchInput.addEventListener("input", renderTickets);
  ticketStatusFilter.addEventListener("change", renderTickets);
  document.getElementById("refreshTicketsBtn").addEventListener("click", () => {
    renderActivities();
    renderTickets();
    renderAttribution();
    showToast("已同步最新 H5 端领号与注册记录");
  });

  // ===========================
  // 3. 博主渠道与归因渲染 (R06)
  // ===========================
  function renderChannels() {
    const baseUrl = window.location.href.replace(/admin\.html.*$/, "h5.html");
    kolTableBody.innerHTML = kolChannels
      .map((k) => {
        const link = `${baseUrl}?kol=${encodeURIComponent(k.kolId)}`;
        const isActive = k.status === "生效中";
        return `
          <tr>
            <td><span class="code-chip">${k.kolId}</span></td>
            <td><strong>${k.name}</strong></td>
            <td>
              <a href="h5.html?kol=${encodeURIComponent(k.kolId)}" target="_blank" style="color:#1677ff;font-size:12px;">h5.html?kol=${k.kolId} ↗</a>
            </td>
            <td>${k.clicks.toLocaleString()}</td>
            <td>${k.registered.toLocaleString()}</td>
            <td><strong>${k.validReg.toLocaleString()}</strong></td>
            <td><span class="badge ${isActive ? "badge--green" : "badge--gray"}">${k.status}</span></td>
            <td>
              <button type="button" class="btn-link-sm" data-copy-link="${link}">复制链接</button>
              <button type="button" class="btn-link-sm" data-toggle-kol="${k.kolId}">${isActive ? "停用" : "启用"}</button>
            </td>
          </tr>
        `;
      })
      .join("");

    kolTableBody.querySelectorAll("[data-copy-link]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copyLink);
          showToast("已复制博主专属推广链接");
        } catch {
          showToast(`推广链接：${btn.dataset.copyLink}`);
        }
      });
    });

    kolTableBody.querySelectorAll("[data-toggle-kol]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "ops") {
          showToast("越权拦截：仅「运营管理员」可启停博主渠道");
          return;
        }
        const target = kolChannels.find((k) => k.kolId === btn.dataset.toggleKol);
        if (!target) return;
        target.status = target.status === "生效中" ? "已停用" : "生效中";
        addAuditLog("博主渠道", "变更渠道状态", `博主 ${target.kolId} 状态变更为「${target.status}」。`);
        renderChannels();
        renderActivities();
        showToast(`${target.kolId} 已${target.status}`);
      });
    });
  }

  function renderAttribution() {
    const records = loadMergedTickets();
    attributionTableBody.innerHTML = records
      .map((r) => {
        const isValidNew = Boolean(r.isNewRegistration && r.status === "有效");
        const badge = isValidNew
          ? `<span class="badge badge--green">有效新增归因</span>`
          : r.status === "作废"
          ? `<span class="badge badge--red">风控排除</span>`
          : `<span class="badge badge--gray">老账号不计新增</span>`;
        const reason = isValidNew
          ? "—"
          : r.status === "作废"
          ? r.voidReason || "风控异常账号"
          : "老账号登录，按 R06 口径不计入新增注册";
        return `
          <tr>
            <td><span class="code-chip">${r.accountId}</span></td>
            <td>${r.phone}</td>
            <td>FAN160_2026</td>
            <td><strong>${r.kolId || "无有效来源"}</strong></td>
            <td>${r.createdAt}</td>
            <td>${badge}</td>
            <td style="color:#64748b;">${reason}</td>
          </tr>
        `;
      })
      .join("");
  }

  document.getElementById("openAddKolBtn").addEventListener("click", () => {
    if (currentRole !== "ops") {
      showToast("越权拦截：仅「运营管理员」可新增博主渠道");
      return;
    }
    openModal("kolModal");
  });

  document.getElementById("kolForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const kolId = document.getElementById("newKolId").value.trim();
    const name = document.getElementById("newKolName").value.trim();
    if (!kolId || !name) return;
    if (kolChannels.some((k) => k.kolId === kolId)) {
      showToast("该博主标识已存在");
      return;
    }
    kolChannels.unshift({ kolId, name, clicks: 0, registered: 0, validReg: 0, status: "生效中" });
    addAuditLog("博主渠道", "新增博主渠道", `创建博主 ${kolId}（${name}）并生成专属活动链接。`);
    closeModal("kolModal");
    document.getElementById("newKolId").value = "";
    document.getElementById("newKolName").value = "";
    renderChannels();
    renderActivities();
    showToast(`已创建博主渠道 ${kolId}`);
  });

  // ===========================
  // 4. 推广结算对账渲染 (R07)
  // ===========================
  function renderSettlements() {
    settlementTableBody.innerHTML = settlements
      .map((s) => {
        const payable = s.validCount * s.unitPrice + s.adjustAmount;
        const stCls = s.status === "已付款" ? "badge--green" : s.status === "已确认" ? "badge--blue" : "badge--amber";
        return `
          <tr>
            <td><span class="code-chip">${s.id}</span></td>
            <td><strong>${s.kolId}</strong><br/><span style="font-size:11px;color:#64748b;">${s.activity}</span></td>
            <td>${s.period}</td>
            <td>${s.rateVersion}<br/><span style="font-size:11px;color:#64748b;">$${s.unitPrice.toFixed(2)} / 有效注册</span></td>
            <td><strong>${s.validCount}</strong> <span style="font-size:11px;color:#94a3b8;">(排除 ${s.excludedCount})</span></td>
            <td style="color:${s.adjustAmount < 0 ? "#dc2626" : "#475569"};">${s.adjustAmount >= 0 ? `+$${s.adjustAmount.toFixed(2)}` : `-$${Math.abs(s.adjustAmount).toFixed(2)}`}</td>
            <td><strong>$${payable.toFixed(2)} ${s.currency}</strong></td>
            <td><span class="badge ${stCls}">${s.status}</span></td>
            <td>
              <button type="button" class="btn-link-sm" data-set-view="${s.id}">查看明细</button>
              ${s.status === "待核对" ? `<button type="button" class="btn-link-sm" data-set-confirm="${s.id}">财务确认</button>` : ""}
              ${s.status === "已确认" ? `<button type="button" class="btn-link-sm" data-set-adjust="${s.id}">调账</button><button type="button" class="btn-link-sm" data-set-pay="${s.id}">登记付款</button>` : ""}
            </td>
          </tr>
        `;
      })
      .join("");

    settlementTableBody.querySelectorAll("[data-set-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedSettlementId = btn.dataset.setView;
        renderSettlementDetail();
      });
    });

    settlementTableBody.querySelectorAll("[data-set-confirm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：仅「财务审核员」可确认并锁定结算单（PRD R05/R07）");
          return;
        }
        const s = settlements.find((item) => item.id === btn.dataset.setConfirm);
        if (!s) return;
        s.status = "已确认";
        addAuditLog("推广结算", "财务确认结算单", `结算单 ${s.id} 已确认锁定（有效注册 ${s.validCount} 条，费率 ${s.rateVersion}）。`);
        selectedSettlementId = s.id;
        renderSettlements();
        renderSettlementDetail();
        renderActivities();
        showToast(`结算单 ${s.id} 已确认锁定`);
      });
    });

    settlementTableBody.querySelectorAll("[data-set-adjust]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：仅「财务审核员」可登记结算调整记录");
          return;
        }
        pendingFinContext = { type: "adjust", id: btn.dataset.setAdjust };
        document.getElementById("finModalTitle").textContent = `新增调账记录（${btn.dataset.setAdjust}）`;
        document.getElementById("finModalFields").innerHTML = `
          <label class="f-item">
            <span>调整金额（USD，扣减请填负数，如 -25）*</span>
            <input type="number" step="0.01" id="finAdjustAmt" required placeholder="-25.00" />
          </label>
          <label class="f-item">
            <span>调整原因 *</span>
            <input type="text" id="finAdjustReason" required placeholder="例如：事后风控核查剔除异常转化" />
          </label>
        `;
        openModal("financeActionModal");
      });
    });

    settlementTableBody.querySelectorAll("[data-set-pay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (currentRole !== "finance") {
          showToast("越权拦截：仅「财务审核员」可登记付款凭证");
          return;
        }
        pendingFinContext = { type: "pay", id: btn.dataset.setPay };
        document.getElementById("finModalTitle").textContent = `登记付款凭证（${btn.dataset.setPay}）`;
        document.getElementById("finModalFields").innerHTML = `
          <label class="f-item">
            <span>付款凭证号 / 流水号 *</span>
            <input type="text" id="finVoucherNo" required placeholder="例如：PAY-USDT-202611210099" />
          </label>
        `;
        openModal("financeActionModal");
      });
    });
  }

  function renderSettlementDetail() {
    const s = settlements.find((item) => item.id === selectedSettlementId) || settlements[0];
    if (!s) return;
    const baseAmt = s.validCount * s.unitPrice;
    const totalAmt = baseAmt + s.adjustAmount;

    settlementDetailTitle.textContent = `结算单明细：${s.id}（${s.kolId}）`;
    settlementDetailSub.textContent = `${s.activity} · 周期 ${s.period} · 适用费率版本 ${s.rateVersion}`;

    const adjHtml =
      s.adjustments.length > 0
        ? s.adjustments
            .map((a) => `<li>${a.time}：调整 <strong>${a.amount >= 0 ? `+$${a.amount.toFixed(2)}` : `-$${Math.abs(a.amount).toFixed(2)}`}</strong>（原因：${a.reason}）</li>`)
            .join("")
        : `<li>暂无调账记录</li>`;

    settlementDetailBody.innerHTML = `
      <div class="detail-grid">
        <div class="detail-kv"><span>基础计费金额</span><strong>$${baseAmt.toFixed(2)} (${s.validCount} × $${s.unitPrice.toFixed(2)})</strong></div>
        <div class="detail-kv"><span>经审核调整金额</span><strong>${s.adjustAmount >= 0 ? `+$${s.adjustAmount.toFixed(2)}` : `-$${Math.abs(s.adjustAmount).toFixed(2)}`}</strong></div>
        <div class="detail-kv"><span>最终应付总额</span><strong style="color:#16a34a;">$${totalAmt.toFixed(2)} ${s.currency}</strong></div>
      </div>
      <div><strong>付款登记信息：</strong>${s.status === "已付款" ? `已于 ${s.paidAt} 付款，凭证号 <code>${s.voucherNo}</code>` : "尚未付款"}</div>
      <div style="margin-top:6px;"><strong>调账留痕：</strong><ul style="margin:4px 0 0;padding-left:18px;">${adjHtml}</ul></div>
    `;
  }

  document.getElementById("financeActionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!pendingFinContext) return;
    const s = settlements.find((item) => item.id === pendingFinContext.id);
    if (!s) return;

    if (pendingFinContext.type === "adjust") {
      const amt = parseFloat(document.getElementById("finAdjustAmt").value);
      const reason = document.getElementById("finAdjustReason").value.trim();
      if (Number.isNaN(amt) || !reason) return;
      s.adjustAmount += amt;
      s.adjustments.push({ time: nowStr(), amount: amt, reason });
      addAuditLog("推广结算", "登记调账记录", `结算单 ${s.id} 调账 $${amt.toFixed(2)}，原因：${reason}`);
      showToast("调账记录已保存并更新应付总额");
    } else if (pendingFinContext.type === "pay") {
      const voucher = document.getElementById("finVoucherNo").value.trim();
      if (!voucher) return;
      s.status = "已付款";
      s.paidAt = nowStr();
      s.voucherNo = voucher;
      addAuditLog("推广结算", "登记付款凭证", `结算单 ${s.id} 标记为已付款，凭证号：${voucher}`);
      showToast(`结算单 ${s.id} 已标记为已付款`);
    }

    selectedSettlementId = s.id;
    closeModal("financeActionModal");
    renderSettlements();
    renderSettlementDetail();
    renderActivities();
  });

  document.getElementById("exportCsvBtn").addEventListener("click", () => {
    const header = ["结算单号", "博主ID", "活动", "周期", "费率版本", "单价", "有效注册数", "调账金额", "应付总额", "状态", "付款凭证号"];
    const rows = settlements.map((s) => [
      s.id,
      s.kolId,
      s.activity,
      s.period,
      s.rateVersion,
      s.unitPrice.toFixed(2),
      s.validCount,
      s.adjustAmount.toFixed(2),
      (s.validCount * s.unitPrice + s.adjustAmount).toFixed(2),
      s.status,
      s.voucherNo || ""
    ]);
    const csv = "\uFEFF" + [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "包网博主推广结算对账单.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("已导出 CSV 对账单");
  });

  // ===========================
  // 5. 审计日志渲染
  // ===========================
  function renderAuditLogs() {
    auditLogsBody.innerHTML = auditLogs
      .map(
        (l) => `
          <tr>
            <td style="white-space:nowrap;">${l.time}</td>
            <td><span class="badge badge--blue">${l.role}</span></td>
            <td>${l.module}</td>
            <td><strong>${l.action}</strong></td>
            <td>${l.detail}</td>
          </tr>
        `
      )
      .join("");
  }

  // 通用弹窗开关
  function openModal(id) {
    document.getElementById(id).hidden = false;
  }
  function closeModal(id) {
    document.getElementById(id).hidden = true;
  }

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  // 初始化路由（支持 #activities / #tickets / #channels / #settlement / #logs）
  const initHash = (window.location.hash || "").replace("#", "");
  if (TAB_TITLES[initHash]) {
    switchTab(initHash);
  }

  renderActivities();
  renderDrawPanel();
  renderTickets();
  renderChannels();
  renderSettlements();
  renderSettlementDetail();
  renderAuditLogs();
})();
