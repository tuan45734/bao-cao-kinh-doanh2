// data-loader.js - Xử lý dữ liệu từ file JSON với phân tích sản phẩm và danh mục

const dataCache = new Map();

// Danh sách các tháng có dữ liệu
const AVAILABLE_MONTHS = [
    '2025_10', '2025_11', '2025_12',
    '2026_01', '2026_02', '2026_03', '2026_04'
];

/**
 * Load raw data từ file JSON
 */
async function loadRawData(year, month) {
    const key = `${year}_${month.toString().padStart(2, '0')}`;
    
    if (dataCache.has(key)) {
        return dataCache.get(key);
    }
    
    if (!AVAILABLE_MONTHS.includes(key)) {
        console.warn(`Không có dữ liệu cho ${key}`);
        return null;
    }
    
    try {
        const response = await fetch(`data/${key}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const jsonData = await response.json();
        dataCache.set(key, jsonData);
        return jsonData;
    } catch (error) {
        console.error(`Lỗi khi load dữ liệu ${key}:`, error);
        return null;
    }
}

/**
 * Lấy dữ liệu doanh số theo NPP
 */
async function loadDataByMonth(year, month) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const revenueMap = new Map();
    rawData.data.forEach(item => {
        const nppName = item.npp;
        const revenue = item.revenue || 0;
        revenueMap.set(nppName, (revenueMap.get(nppName) || 0) + revenue);
    });
    
    return Array.from(revenueMap.entries()).map(([name, revenue]) => ({
        name: name,
        revenue: revenue
    }));
}

/**
 * Lấy dữ liệu doanh số theo danh mục sản phẩm (Category)
 */
async function loadDataByCategory(year, month) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const categoryMap = new Map();
    rawData.data.forEach(item => {
        const category = item.category || 'Khác';
        const revenue = item.revenue || 0;
        categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
    });
    
    return Array.from(categoryMap.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Lấy dữ liệu doanh số theo sản phẩm (Product)
 */
async function loadDataByProduct(year, month) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const productMap = new Map();
    rawData.data.forEach(item => {
        const productName = item.ten_sp;
        const revenue = item.revenue || 0;
        const cases = item.cases || 0;
        productMap.set(productName, {
            revenue: (productMap.get(productName)?.revenue || 0) + revenue,
            cases: (productMap.get(productName)?.cases || 0) + cases
        });
    });
    
    return Array.from(productMap.entries())
        .map(([name, data]) => ({
            name: name,
            revenue: data.revenue,
            cases: data.cases
        }))
        .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Lấy dữ liệu doanh số theo sản phẩm trong một danh mục cụ thể
 */
async function loadDataByProductInCategory(year, month, category) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const productMap = new Map();
    rawData.data
        .filter(item => item.category === category)
        .forEach(item => {
            const productName = item.ten_sp;
            const revenue = item.revenue || 0;
            productMap.set(productName, (productMap.get(productName) || 0) + revenue);
        });
    
    return Array.from(productMap.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Lấy dữ liệu chi tiết cho biểu đồ so sánh sản phẩm
 */
async function loadProductComparison(currentYear, currentMonth, compareYear, compareMonth, selectedProduct = null) {
    const currentRaw = await loadRawData(currentYear, currentMonth);
    const compareRaw = await loadRawData(compareYear, compareMonth);
    
    if (!currentRaw || !compareRaw) return { current: [], compare: [] };
    
    // Nếu có sản phẩm được chọn, lọc theo sản phẩm đó
    let currentData = currentRaw.data;
    let compareData = compareRaw.data;
    
    if (selectedProduct) {
        currentData = currentRaw.data.filter(item => item.ten_sp === selectedProduct);
        compareData = compareRaw.data.filter(item => item.ten_sp === selectedProduct);
    }
    
    // Tính tổng doanh số theo NPP cho sản phẩm được chọn
    const currentMap = new Map();
    const compareMap = new Map();
    
    currentData.forEach(item => {
        const npp = item.npp;
        const revenue = item.revenue || 0;
        currentMap.set(npp, (currentMap.get(npp) || 0) + revenue);
    });
    
    compareData.forEach(item => {
        const npp = item.npp;
        const revenue = item.revenue || 0;
        compareMap.set(npp, (compareMap.get(npp) || 0) + revenue);
    });
    
    const allNPPs = new Set([...currentMap.keys(), ...compareMap.keys()]);
    const result = Array.from(allNPPs).map(npp => ({
        npp: npp,
        currentRevenue: currentMap.get(npp) || 0,
        compareRevenue: compareMap.get(npp) || 0
    })).sort((a, b) => b.currentRevenue - a.currentRevenue);
    
    return {
        current: result,
        compare: result,
        totalCurrent: currentData.reduce((sum, item) => sum + (item.revenue || 0), 0),
        totalCompare: compareData.reduce((sum, item) => sum + (item.revenue || 0), 0)
    };
}

/**
 * Lấy danh sách danh mục (categories) từ dữ liệu
 */
async function getCategories(year, month) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const categories = new Set();
    rawData.data.forEach(item => {
        if (item.category) categories.add(item.category);
    });
    return Array.from(categories).sort();
}

/**
 * Lấy danh sách sản phẩm theo danh mục
 */
async function getProductsByCategory(year, month, category) {
    const rawData = await loadRawData(year, month);
    if (!rawData || !rawData.data) return [];
    
    const products = new Set();
    rawData.data
        .filter(item => item.category === category)
        .forEach(item => {
            if (item.ten_sp) products.add(item.ten_sp);
        });
    return Array.from(products).sort();
}

/**
 * Lấy danh sách tất cả sản phẩm (top 50 theo doanh số)
 */
async function getTopProducts(year, month, limit = 50) {
    const products = await loadDataByProduct(year, month);
    return products.slice(0, limit).map(p => p.name);
}

/**
 * Lấy dữ liệu theo quý
 */
async function loadDataByQuarter(year, quarter) {
    const months = {
        1: ['01', '02', '03'],
        2: ['04', '05', '06'],
        3: ['07', '08', '09'],
        4: ['10', '11', '12']
    };
    
    const revenueMap = new Map();
    
    for (const month of months[quarter]) {
        const data = await loadDataByMonth(year, parseInt(month));
        data.forEach(item => {
            revenueMap.set(item.name, (revenueMap.get(item.name) || 0) + item.revenue);
        });
    }
    
    return Array.from(revenueMap.entries()).map(([name, revenue]) => ({
        name: name,
        revenue: revenue
    }));
}

/**
 * Lấy dữ liệu theo năm
 */
async function loadDataByYear(year) {
    const revenueMap = new Map();
    
    for (let month = 1; month <= 12; month++) {
        const monthKey = `${year}_${month.toString().padStart(2, '0')}`;
        if (AVAILABLE_MONTHS.includes(monthKey)) {
            const data = await loadDataByMonth(year, month);
            data.forEach(item => {
                revenueMap.set(item.name, (revenueMap.get(item.name) || 0) + item.revenue);
            });
        }
    }
    
    return Array.from(revenueMap.entries()).map(([name, revenue]) => ({
        name: name,
        revenue: revenue
    }));
}

// Export cho browser
if (typeof window !== 'undefined') {
    window.loadDataByMonth = loadDataByMonth;
    window.loadDataByCategory = loadDataByCategory;
    window.loadDataByProduct = loadDataByProduct;
    window.loadDataByProductInCategory = loadDataByProductInCategory;
    window.loadProductComparison = loadProductComparison;
    window.loadDataByQuarter = loadDataByQuarter;
    window.loadDataByYear = loadDataByYear;
    window.getCategories = getCategories;
    window.getProductsByCategory = getProductsByCategory;
    window.getTopProducts = getTopProducts;
}