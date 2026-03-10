
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
let orders = [];
let deleteTargetIndex = null;

window.loginUser = function () {
    const id = userIdInput.value.trim();
    if (!id) {
        // Sử dụng hàm alert của trình duyệt cho trường hợp nhập ID để tránh hiện Modal xóa
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

function renderOrders() {
    orderList.innerHTML = '';
    orders.forEach((order, index) => {
        const statusColorClass = 'text-black';
        const badgeBgClass = (order.status === 'Đã Refund') ? 'bg-green-500' : 'bg-orange-400';

        const orderHtml = `
                    <div class="order-item group relative">
                        <p class="text-lg font-bold text-gray-800">Order # ${order.id}</p>
                        <div class="mt-1 space-y-1">
                            <p class="text-sm text-gray-600">) PP: <a href="mailto:${order.email}" class="order-link font-medium">${order.email}</a></p>
                            <p class="text-sm text-gray-500 italic">Seller: <span class="text-gray-800 font-semibold">${order.seller}</span></p>
                        </div>
                        <img src="${order.image}" alt="Sản phẩm" class="product-img">
                        <div class="mt-3 flex items-center justify-between">
                            <p class="text-sm font-bold status-text ${statusColorClass}">
                                Trạng thái: <span class="status-badge ${badgeBgClass} text-white px-2 py-0.5 rounded cursor-pointer btn-status-toggle shadow-sm" onclick="toggleStatus(${index})">${order.status}</span> • Giá: $${parseFloat(order.price).toFixed(2)}
                            </p>
                            <button onclick="confirmDelete(${index})" class="text-gray-400 text-xs hover:text-red-600 transition-colors uppercase font-bold tracking-tighter">
                                [Xóa]
                            </button>
                        </div>
                    </div>
                `;
        orderList.insertAdjacentHTML('beforeend', orderHtml);
    });
    checkEmpty();
}

window.toggleStatus = function (index) {
    orders[index].status = (orders[index].status === 'Chưa Refund') ? 'Đã Refund' : 'Chưa Refund';
    saveToStorage();
    renderOrders();
};

// Hàm này sẽ hiện Modal xác nhận khi nhấn nút Xóa
window.confirmDelete = function (index) {
    deleteTargetIndex = index;
    customAlert.classList.add('active-modal');
};

// Đóng modal
function closeAlert() {
    customAlert.classList.remove('active-modal');
    deleteTargetIndex = null;
}

document.getElementById('alertClose').onclick = closeAlert;

document.getElementById('alertConfirm').onclick = () => {
    if (deleteTargetIndex !== null) {
        orders.splice(deleteTargetIndex, 1);
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
    const status = document.querySelector('input[name="refundStatus"]:checked').value;
    const imageFile = document.getElementById('orderImage').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const newOrder = {
                id,
                email,
                seller,
                price,
                status,
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
