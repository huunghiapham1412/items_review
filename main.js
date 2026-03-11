
const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
const emptyMsg = document.getElementById('emptyMsg');
const storageBar = document.getElementById('storageBar');
const imgError = document.getElementById('imgError');
const mainContent = document.getElementById('mainContent');
const userIdInput = document.getElementById('userIdInput');
const userInfo = document.getElementById('userInfo');
const customAlert = document.getElementById('customAlert');

let currentUserId = "";
let orders = []; // Mảng chứa tất cả đơn hàng
let deleteTargetId = null; // Dùng ID đơn hàng để xóa chính xác hơn

window.loginUser = function () {
    const id = userIdInput.value.trim();
    if (!id) {
        alert("Vui lòng nhập ID để tiếp tục.");
        return;
    }

    currentUserId = id;
    const storedData = localStorage.getItem('orders_' + currentUserId);
    orders = storedData ? JSON.parse(storedData) : [];

    mainContent.classList.remove('opacity-40', 'pointer-events-none');
    userInfo.innerText = "Đang xem dữ liệu của: " + currentUserId;

    renderOrders();
    updateStorageIndicator();
};

function updateStorageIndicator() {
    if (!currentUserId) return;
    const used = JSON.stringify(localStorage).length;
    const limit = 5 * 1024 * 1024;
    const percent = Math.min((used / limit) * 100, 100);
    storageBar.style.width = percent + '%';
    storageBar.className = percent > 80 ? 'h-1 bg-red-500 rounded-full' : 'h-1 bg-blue-500 rounded-full';
}

function saveToStorage() {
    if (!currentUserId) return;
    try {
        localStorage.setItem('orders_' + currentUserId, JSON.stringify(orders));
        updateStorageIndicator();
        checkEmpty();
    } catch (e) {
        alert("Bộ nhớ trình duyệt đã đầy!");
    }
}

// Hàm nhóm đơn hàng theo tên Seller
function groupOrdersBySeller(orderArray) {
    return orderArray.reduce((groups, order) => {
        const seller = order.seller || "Chưa xác định";
        if (!groups[seller]) {
            groups[seller] = [];
        }
        groups[seller].push(order);
        return groups;
    }, {});
}

function renderOrders() {
    orderList.innerHTML = '';

    if (orders.length === 0) {
        checkEmpty();
        return;
    }

    const grouped = groupOrdersBySeller(orders);

    // Duyệt qua từng người bán
    Object.keys(grouped).sort().forEach(sellerName => {
        const sellerOrders = grouped[sellerName];

        // Tạo container cho nhóm
        const groupContainer = document.createElement('div');
        groupContainer.className = "seller-group mb-10";

        // Header của nhóm (Tên người bán)
        const headerHtml = `
                    <div class="seller-group-header border-b-2 border-blue-400 mb-6 flex justify-between items-end">
                        <h3 class="text-xl font-black text-blue-800 uppercase tracking-wide bg-blue-100 px-3 py-1 rounded-t-lg">
                            Seller: ${sellerName}
                        </h3>
                        <span class="text-xs font-bold text-blue-500 mb-1">${sellerOrders.length} đơn hàng</span>
                    </div>
                `;
        groupContainer.innerHTML = headerHtml;

        // Danh sách đơn hàng trong nhóm
        sellerOrders.forEach((order) => {
            const refundBadgeClass = (order.status === 'Đã Refund') ? 'bg-green-500' : 'bg-orange-400';

            let reviewBadgeClass = 'bg-gray-400';
            let reviewText = order.reviewStatus || 'Chưa Review';

            if (reviewText === 'Đã Review') {
                reviewBadgeClass = 'bg-purple-500';
                reviewText = 'Đã Viết';
            } else if (reviewText === 'Review đã được chấp nhận') {
                reviewBadgeClass = 'bg-emerald-600 font-bold';
                reviewText = 'Đã Chấp Nhận ✓';
            }

            const orderHtml = `
                        <div class="order-item group relative">
                            <div class="flex justify-between items-start">
                                <p class="text-lg font-bold text-gray-800">Order # ${order.id}</p>
                                <button onclick="confirmDelete('${order.internalId}')" class="text-gray-400 text-xs hover:text-red-600 transition-colors uppercase font-bold tracking-tighter">
                                    [Xóa]
                                </button>
                            </div>
                            <div class="mt-1 space-y-1">
                                <p class="text-sm text-gray-600">) PP: <a href="mailto:${order.email}" class="order-link font-medium">${order.email}</a></p>
                                <p class="text-sm text-gray-500">Bank: <span class="text-blue-700 font-medium">${order.bank || 'N/A'}</span></p>
                            </div>
                            <img src="${order.image}" alt="Sản phẩm" class="product-img">
                            <div class="mt-3 flex flex-wrap items-center gap-3">
                                <div class="text-sm font-bold">
                                    Refund: <span class="${refundBadgeClass} text-white px-2 py-0.5 rounded cursor-pointer btn-status-toggle shadow-sm" onclick="toggleStatus('${order.internalId}')">${order.status}</span>
                                </div>
                                <div class="text-sm font-bold">
                                    Review: <span class="${reviewBadgeClass} text-white px-2 py-0.5 rounded cursor-pointer btn-status-toggle shadow-sm" onclick="toggleReview('${order.internalId}')">${reviewText}</span>
                                </div>
                                <div class="text-sm font-bold text-gray-700">
                                    Giá: $${parseFloat(order.price).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    `;
            groupContainer.insertAdjacentHTML('beforeend', orderHtml);
        });

        orderList.appendChild(groupContainer);
    });

    checkEmpty();
}

window.toggleStatus = function (internalId) {
    const idx = orders.findIndex(o => o.internalId === internalId);
    if (idx !== -1) {
        orders[idx].status = (orders[idx].status === 'Chưa Refund') ? 'Đã Refund' : 'Chưa Refund';
        saveToStorage();
        renderOrders();
    }
};

window.toggleReview = function (internalId) {
    const idx = orders.findIndex(o => o.internalId === internalId);
    if (idx !== -1) {
        const current = orders[idx].reviewStatus;
        if (current === 'Chưa Review') {
            orders[idx].reviewStatus = 'Đã Review';
        } else if (current === 'Đã Review') {
            orders[idx].reviewStatus = 'Review đã được chấp nhận';
        } else {
            orders[idx].reviewStatus = 'Chưa Review';
        }
        saveToStorage();
        renderOrders();
    }
};

window.confirmDelete = function (internalId) {
    deleteTargetId = internalId;
    customAlert.classList.add('active-modal');
};

function closeAlert() {
    customAlert.classList.remove('active-modal');
    deleteTargetId = null;
}

document.getElementById('alertClose').onclick = closeAlert;

document.getElementById('alertConfirm').onclick = () => {
    if (deleteTargetId !== null) {
        orders = orders.filter(o => o.internalId !== deleteTargetId);
        saveToStorage();
        renderOrders();
    }
    closeAlert();
};

document.getElementById('orderImage').onchange = function () {
    const file = this.files[0];
    if (file && file.size > 500 * 1024) {
        imgError.classList.remove('hidden');
    } else {
        imgError.classList.add('hidden');
    }
};

orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!currentUserId) return;

    const id = document.getElementById('orderId').value;
    const email = document.getElementById('orderEmail').value;
    const seller = document.getElementById('orderSeller').value;
    const price = document.getElementById('orderPrice').value;
    const bank = document.getElementById('orderBank').value;
    const status = document.querySelector('input[name="refundStatus"]:checked').value;
    const reviewStatus = document.querySelector('input[name="reviewStatus"]:checked').value;
    const imageFile = document.getElementById('orderImage').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const newOrder = {
                internalId: Date.now().toString(), // Tạo ID nội bộ để quản lý chính xác khi đã nhóm
                id,
                email,
                seller,
                price,
                bank,
                status,
                reviewStatus,
                image: event.target.result
            };

            orders.unshift(newOrder);
            saveToStorage();
            renderOrders();
            orderForm.reset();
            imgError.classList.add('hidden');
        };
        reader.readAsDataURL(imageFile);
    }
});

function checkEmpty() {
    if (orders.length === 0) {
        emptyMsg.classList.remove('hidden');
    } else {
        emptyMsg.classList.add('hidden');
    }
}
