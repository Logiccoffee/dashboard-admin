import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";

// URL API
const API_URL = "https://asia-southeast2-awangga.cloudfunctions.net/logiccoffee/data/orders";

// Ambil token dari cookie dengan nama 'login'
const token = getCookie('login');
if (!token) {
    alert('Token tidak ditemukan, harap login terlebih dahulu!');
    throw new Error("Token tidak ditemukan. Harap login ulang.");
}

// Panggil API untuk mengambil data pesanan menggunakan fetch()
fetch(API_URL, {
    method: 'GET',
    headers: {
        'login': token,
        'Content-Type': 'application/json',
    }
})
    .then(response => response.json()) // Parse JSON dari respons
    .then(response => {
        // Periksa status 'success' pada response
        if (response.status === "success") {
            const orders = response.data || []; // Pastikan data diakses dengan benar
            displayOrders(orders); // Tampilkan data pesanan
        } else {
            console.error(`Error: ${response.status}`);
            alert("Gagal memuat data pesanan. Silakan coba lagi.");
        }
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Terjadi kesalahan saat memuat data pesanan.");
    });

// Fungsi untuk menampilkan data pesanan di tabel
function displayOrders(orders) {
    const container = document.querySelector('.table tbody');  // Pilih tbody dalam tabel

    // Pastikan elemen container ditemukan
    if (!container) {
        console.error("Elemen dengan class 'table' tidak ditemukan.");
        return;
    }

    // Hapus data lama jika ada
    container.innerHTML = '';

    // Variabel untuk menyimpan total keuangan
    let totalKeuangan = 0;

    // Tampilkan data pesanan
    orders.forEach((order) => {
        const row = document.createElement('tr');

        // Kolom Tanggal Pesanan
        const orderDateCell = document.createElement('td');
        orderDateCell.textContent = order.orderDate || '-'; // Menampilkan tanggal pesanan
        row.appendChild(orderDateCell);

        // Kolom Metode Pembayaran
        const paymentMethodCell = document.createElement('td');
        paymentMethodCell.textContent = order.paymentMethod || order.payment_method || '-';
        row.appendChild(paymentMethodCell);

        // Kolom Total
        const totalPriceCell = document.createElement('td');

        // Ambil nilai total dari API
        let total = typeof order.total === 'string'
            ? parseInt(order.total.replace(/[^\d,]/g, '').replace(',', '.')) // Hapus simbol selain angka dan ganti koma dengan titik
            : order.total || 0;  // Jika bukan string, langsung ambil nilainya

        // Debug: Cek nilai yang diterima
        console.log("Nilai total yang diterima:", order.total);  // Memastikan format data yang diterima

        // Format angka dengan dua angka desimal (Rp xx.xxx,xx)
        let formattedTotal = total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Menampilkan total dalam format Rp xx.xxx,xx
        totalPriceCell.textContent = total > 0
            ? `Rp ${formattedTotal}`  // Format angka dengan dua angka desimal
            : '-';

        row.appendChild(totalPriceCell);




        // Menambahkan total keuangan
        totalKeuangan += total;


        // let total = order.total ? order.total : 0; // Jika order.total tidak ada, set ke 0
        // console.log("Nilai order.total sebelum format:", order.total); // Debugging untuk nilai awal
        // totalPriceCell.textContent = total !== 0 ? `Rp ${total.toLocaleString('id-ID')}` : '-'; // Menampilkan total harga
        // console.log("TextContent setelah format:", totalPriceCell.textContent); // Debugging untuk hasil akhir
        // row.appendChild(totalPriceCell);


        // Kolom Jumlah (Jumlah produk)
        const quantityCell = document.createElement('td');
        const quantity = order.orders.reduce((acc, item) => acc + item.quantity, 0);  // Menjumlahkan kuantitas produk
        quantityCell.textContent = quantity || '-'; // Menampilkan jumlah produk
        row.appendChild(quantityCell);

        container.appendChild(row);
    });

    // Format total keuangan dan masukkan ke dalam elemen
    const totalKeuanganFormatted = totalKeuangan.toLocaleString('id-ID', { minimumFractionDigits: 0 });
    document.getElementById('totalKeuangan').textContent = `Rp ${totalKeuanganFormatted}`;
}