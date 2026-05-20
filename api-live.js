// Tháng hiện tại lấy từ API — tự động đổi theo tháng đang chạy
function formatDateDMY(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function createLiveMonthConfig(referenceDate = new Date()) {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth() + 1;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    return {
        key: monthKey(year, month),
        year,
        month,
        tuNgay: formatDateDMY(firstDay),
        denNgay: formatDateDMY(lastDay)
    };
}

const LIVE_MONTH_CONFIG = createLiveMonthConfig();

const API_CONFIG = {
    kpi: {
        baseUrl: 'https://dms.mobiwork.vn:3018/KPIReport',
        orgid: '67eb9cf392d9028035624d91',
        auth: 'Basic YWRtaW41QGFjYnQuY29tOmFjZjY4MTljNmNiZjJlMGZkNGE2Njg5MjQ5NjAzODFi'
    },
    bill: {
        baseUrl: 'https://openapi.mobiwork.vn/OpenAPI/V1/Bill',
        auth: 'Basic NjlhZTZlNmM4YTY0NjVmNDFlNTNhZmI0OjFuYzFnc3J1N2p2Ym10eTdncGV5NWk=',
        pageSize: 3000
    }
};

const NPP_KV_MAP = {
    'NPP Anh Minh HT': 'KV6', 'NPP Anh Đức (Nghỉ)': 'KV5', 'NPP Đồng Lợi': 'KV5',
    'NPP Bảo Cường': 'KV3', 'NPP Bảo Lâm': 'KV1', 'NPP Công Giang': 'KV1',
    'NPP Cường Thịnh': 'KV1', 'NPP Duy Anh': 'KV2', 'NPP Dũng Béo': 'KV4',
    'NPP Dũng Cúc': 'KV1', 'NPP Dương Minh': 'KV4', 'NPP Hikoji': 'KV3',
    'NPP Hiền Cường': 'KV5', 'NPP Hoa Việt': 'KV3', 'NPP Hoàng Minh': 'KV5',
    'NPP Hà Thanh': 'KV6', 'NPP Hùng Huệ': 'KV2', 'NPP Hưng Thịnh': 'KV4',
    'NPP Hải Hằng': 'KV5', 'NPP Hồng Đức': 'KV6', 'NPP Linh Trang': 'KV6',
    'NPP Long Châm': 'KV2', 'NPP Long Hải': 'KV3', 'NPP Long Liên': 'KV1',
    'NPP Lâm Hạ': 'KV1', 'NPP Minh Châu': 'KV6', 'NPP Minh Lộc': 'KV6',
    'NPP Mạnh Hà 1': 'KV6', 'NPP Mạnh Hà 2': 'KV6', 'NPP Nguyên Vũ': 'KV1',
    'NPP Nguyễn Đình Hân': 'KV4', 'NPP Ngọc Kiên': 'KV2', 'NPP Ngọc Phúc': 'KV4',
    'NPP Ngọc Thêu': 'KV2', 'NPP Nhung Tùng': 'KV6', 'NPP Oanh Định': 'KV5',
    'NPP Phong Hiền': 'KV2', 'NPP Phúc Thịnh': 'KV3', 'NPP Phương Hà': 'KV6',
    'NPP Phương Đông': 'KV2', 'NPP Sơn Lâm': 'KV5', 'NPP Thanh Bình': 'KV6',
    'NPP Thành Hân': 'KV3', 'NPP Thành Lụa': 'KV2', 'NPP Thành Thanh': 'KV6',
    'NPP Thái Hoà': 'KV5', 'NPP Thông Thơm': 'KV6', 'NPP Thăng Hương': 'KV4',
    'NPP Thảo Nam': 'KV1', 'NPP Thảo Thắng': 'KV4', 'NPP Thảo Xuân': 'KV5',
    'NPP Thắng Lợi': 'KV3', 'NPP Tiên Lan (Nghỉ)': 'KV5', 'NPP Duy Khoa': 'KV5',
    'NPP Tiến Thịnh': 'KV3', 'NPP Trường Hằng': 'KV6', 'NPP Tuấn Huyền': 'KV2',
    'NPP Tuấn Huê': 'KV1', 'NPP Tuấn Vân': 'KV5', 'NPP Tuấn Yến': 'KV1',
    'NPP Tân Bích An': 'KV6', 'NPP Tân Hoa': 'KV3', 'NPP Tân Thúy': 'KV4',
    'NPP Tây Đô': 'KV3', 'NPP Tùng Phương': 'KV3', 'NPP Vũ Tấm': 'KV1',
    'NPP Vũ Đức Nam': 'KV5', 'NPP Ánh Thu': 'KV4', 'NPP Đức Nam Tiến': 'KV1',
    'NPP Đức Oanh': 'KV4', 'NPP Anh Viên': 'KV5', 'NPP Dương Thiên Nhi': 'KV5',
    'NPP Hiền Thuận': 'KV5', 'NPP Hoàng Gia Bảo': 'KV5', 'NPP Minh Huy': 'KV5',
    'NPP NAKOA': 'KV5', 'NPP Thúy Diễm': 'KV5', 'NPP Trung Nam': 'KV5',
    'NPP Tâm Bảo Hân': 'KV5', 'NPP Tường Vy': 'KV5'
};

const CATEGORY_MAP_SOURCES = ['2026_04', '2026_03', '2026_02', '2025_12'];

const _kpiCache = new Map();
const _billCache = new Map();
let _categoryMap = null;

function monthKey(year, month) {
    return `${year}_${month.toString().padStart(2, '0')}`;
}

function isLiveMonth(year, month) {
    return monthKey(year, month) === LIVE_MONTH_CONFIG.key;
}

function normalizeMaSp(ma) {
    if (!ma) return ma;
    const i = ma.indexOf('_');
    return i > 0 ? ma.slice(0, i) : ma;
}

/** Bỏ dòng trả thưởng TB (mã _T3.x, tên "Trả thưởng TB", …) */
function isTraThuongTB(sp) {
    if (!sp) return false;
    const ma = (sp.ma_sp || '').toLowerCase();
    const ten = (sp.ten_sp || '').toLowerCase();
    if (/trả\s*thưởng|tra\s*thuong|thưởng\s*tb|thuong\s*tb/.test(ten)) return true;
    if (/_t\d+\.|_tb/i.test(ma)) return true;
    return false;
}

function packsPerCase(tenSp) {
    const m = tenSp?.match(/(\d+)\s*gói\/thùng/i) || tenSp?.match(/(\d+)\s*gói\/thang/i);
    return m ? parseInt(m[1], 10) : 1;
}

function inferCategory(maSp, tenSp, catMap) {
    if (catMap.has(maSp)) return catMap.get(maSp);
    const t = (tenSp || '').toLowerCase();
    if (t.includes('chân gà') || t.includes('chan ga')) return 'Chân gà';
    if (t.includes('bim') || t.includes('bánh')) return 'Bim Quẩy';
    if (t.includes('snack')) return 'Snack Đật';
    return 'Khác';
}

async function loadCategoryMap() {
    if (_categoryMap) return _categoryMap;
    _categoryMap = new Map();
    for (const key of CATEGORY_MAP_SOURCES) {
        try {
            const res = await fetch(`data/${key}.json`);
            if (!res.ok) continue;
            const json = await res.json();
            for (const row of json.data || []) {
                if (row.ma_sp && row.category) _categoryMap.set(row.ma_sp, row.category);
            }
        } catch (_) { /* bỏ qua */ }
    }
    return _categoryMap;
}

async function fetchKpiRevenueMap(year, month, fromApi = true) {
    const key = monthKey(year, month);
    const cacheKey = fromApi ? `${key}_api` : key;
    if (_kpiCache.has(cacheKey)) return _kpiCache.get(cacheKey);

    if (!fromApi) return null;

    const cfg = API_CONFIG.kpi;
    const url = `${cfg.baseUrl}?orgid=${cfg.orgid}&groupid=&projectName=&month=${month}&year=${year}&role=&doanhthu=doanh_thu`;
    const res = await fetch(url, { headers: { Authorization: cfg.auth } });
    if (!res.ok) throw new Error(`KPI API HTTP ${res.status}`);
    const json = await res.json();
    const groups = json.dataphongban?.group || [];
    const map = {};

    for (const g of groups) {
        if (!g.name?.startsWith('NPP')) continue;
        let revenue = 0;
        for (const e of g.employee || []) {
            revenue += e.TH?.doanh_thu || 0;
        }
        map[g.name] = revenue;
    }

    _kpiCache.set(cacheKey, map);
    return map;
}

function clearKpiCache(year, month) {
    const key = monthKey(year, month);
    _kpiCache.delete(key);
    _kpiCache.delete(`${key}_api`);
}

async function fetchAllBills(tuNgay, denNgay) {
    const cfg = API_CONFIG.bill;
    const all = [];
    let page = 1;

    while (true) {
        const url = `${cfg.baseUrl}?tu_ngay=${encodeURIComponent(tuNgay)}&den_ngay=${encodeURIComponent(denNgay)}&page_size=${cfg.pageSize}&page_number=${page}`;
        const res = await fetch(url, { headers: { Authorization: cfg.auth } });
        if (!res.ok) throw new Error(`Bill API HTTP ${res.status}`);
        const json = await res.json();
        if (!json.status || !json.data) throw new Error(json.message || 'Bill API thất bại');
        all.push(...json.data);
        if (json.data.length === 0 || json.data.length < cfg.pageSize) break;
        page++;
        if (page > 50) break;
    }
    return all;
}

function aggregateBills(bills, year, month, catMap) {
    const agg = new Map();

    for (const bill of bills) {
        const npp = bill.ten_nhom || bill.ma_nhom;
        if (!npp?.startsWith('NPP')) continue;

        const lineItems = [...(bill.san_pham || []), ...(bill.san_pham_km || [])];
        for (const sp of lineItems) {
            if (isTraThuongTB(sp)) continue;
            const ma = normalizeMaSp(sp.ma_sp);
            const groupKey = `${ma}|${npp}`;
            if (!agg.has(groupKey)) {
                agg.set(groupKey, {
                    ma_sp: ma,
                    ten_sp: sp.ten_sp,
                    category: inferCategory(ma, sp.ten_sp, catMap),
                    cases: 0,
                    revenue: 0,
                    npp,
                    kv: NPP_KV_MAP[npp] || '',
                    year,
                    month,
                    count: 0,
                    _bills: new Set()
                });
            }
            const row = agg.get(groupKey);
            row.cases += (sp.so_luong || 0) / packsPerCase(sp.ten_sp);
            row.revenue += sp.thanh_tien || 0;
            row._bills.add(bill.ma_phieu);
        }
    }

    const data = [];
    for (const row of agg.values()) {
        row.count = row._bills.size;
        delete row._bills;
        data.push(row);
    }
    data.sort((a, b) => b.revenue - a.revenue);
    return data;
}

async function fetchBillMonthJson(year, month, fromApi = true) {
    const key = monthKey(year, month);
    const cacheKey = fromApi ? `${key}_api` : key;
    if (_billCache.has(cacheKey)) return _billCache.get(cacheKey);

    if (!fromApi) return null;

    const catMap = await loadCategoryMap();
    const bills = await fetchAllBills(LIVE_MONTH_CONFIG.tuNgay, LIVE_MONTH_CONFIG.denNgay);
    const data = aggregateBills(bills, year, month, catMap);

    const result = {
        metadata: {
            year,
            month,
            total_records: data.reduce((s, r) => s + r.count, 0),
            total_products: new Set(data.map(r => r.ma_sp)).size,
            exported_at: new Date().toISOString(),
            source: 'api'
        },
        data
    };

    _billCache.set(cacheKey, result);
    return result;
}

function clearBillCache(year, month) {
    const key = monthKey(year, month);
    _billCache.delete(key);
    _billCache.delete(`${key}_api`);
}

function kpiMapToArray(map) {
    return Object.entries(map).map(([name, revenue]) => ({
        name,
        revenue: revenue || 0
    }));
}

if (typeof window !== 'undefined') {
    window.LIVE_MONTH_CONFIG = LIVE_MONTH_CONFIG;
    window.isLiveMonth = isLiveMonth;
    window.fetchKpiRevenueMap = fetchKpiRevenueMap;
    window.fetchBillMonthJson = fetchBillMonthJson;
    window.clearBillCache = clearBillCache;
    window.clearKpiCache = clearKpiCache;
    window.isTraThuongTB = isTraThuongTB;
    window.kpiMapToArray = kpiMapToArray;
    window.monthKey = monthKey;
}
