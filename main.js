const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
const emptyMsg = document.getElementById('emptyMsg');
const storageBar = document.getElementById('storageBar');
const imgError = document.getElementById('imgError');

let orders = JSON.parse(localStorage.getItem('myOrders')) || [];
let deleteTargetIndex = null;

window.onload = () => {
    renderOrders();
    updateStorageIndicator();
};

function updateStorageIndicator() {
    const used = JSON.stringify(localStorage).length;
    const limit = 5 * 1024 * 1024;
    const percent = Math.min((used / limit) * 100, 100);
    storageBar.style.width = percent + '%';
    storageBar.className = percent > 80 ? 'h-1 bg-red-500 rounded-full' : 'h-1 bg-blue-500 rounded-full';
}

function saveToStorage() {
    try {
        localStorage.setItem('myOrders', JSON.stringify(orders));
        updateStorageIndicator();
        checkEmpty();
    } catch (e) {
        showAlert("Bộ nhớ trình duyệt đã đầy! Hãy xóa bớt đơn hàng cũ hoặc sử dụng ảnh nhỏ hơn.", false);
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

window.confirmDelete = function (index) {
    deleteTargetIndex = index;
    showAlert("Bạn có chắc chắn muốn xóa đơn hàng này vĩnh viễn không?", true);
};

function showAlert(msg, isConfirm) {
    document.getElementById('alertMsg').innerText = msg;
    document.getElementById('customAlert').classList.remove('hidden');
    document.getElementById('alertConfirm').style.display = isConfirm ? 'block' : 'none';
}

document.getElementById('alertClose').onclick = () => {
    document.getElementById('customAlert').classList.add('hidden');
};

document.getElementById('alertConfirm').onclick = () => {
    if (deleteTargetIndex !== null) {
        orders.splice(deleteTargetIndex, 1);
        saveToStorage();
        renderOrders();
        deleteTargetIndex = null;
    }
    document.getElementById('customAlert').classList.add('hidden');
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
