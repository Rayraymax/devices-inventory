let devices = JSON.parse(localStorage.getItem("devices")) || [];
let nextId = devices.length ? devices[devices.length - 1].id + 1 : 1;
let currentUpdateId = null;

// Add a new device
function addDevice() {
  let dateReceived = document.getElementById("dateReceived").value;
  let name = document.getElementById("name").value;
  let region = document.getElementById("region").value;
  let phone = document.getElementById("phone").value;
  let serial = document.getElementById("serial").value;
  let returnedDate = document.getElementById("returnedDate").value;
  let reason = document.getElementById("reason").value;
  let status = document.getElementById("status").value;

  if (!dateReceived || !name || !region || !phone || !serial) {
    alert("Please fill all required fields!");
    return;
  }

  devices.push({
    id: nextId++,
    dateReceived,
    name,
    region,
    phone,
    serial,
    status,
    returnedDate,
    reason
  });

  saveDevices();
  renderTable();

  document.querySelectorAll(".form-section input, .form-section select").forEach(el => el.value = "");
}

// Render inventory table
function renderTable(filteredDevices = devices) {
  let table = document.getElementById("inventory");
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Date Received</th>
      <th>Name</th>
      <th>Region</th>
      <th>Phone No</th>
      <th>Serial No</th>
      <th>Status</th>
      <th>Returned Date</th>
      <th>Reason</th>
      <th>Actions</th>
    </tr>
  `;

  filteredDevices.forEach(d => {
    table.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.dateReceived}</td>
        <td>${d.name}</td>
        <td>${d.region}</td>
        <td>${d.phone}</td>
        <td>${d.serial}</td>
        <td>${d.status}</td>
        <td>${d.returnedDate || ""}</td>
        <td>${d.reason || ""}</td>
        <td>
          <button class="action update-btn" onclick="openModal(${d.id})">Update</button>
          <button class="action delete-btn" onclick="deleteDevice(${d.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Delete a device
function deleteDevice(id) {
  devices = devices.filter(d => d.id !== id);
  saveDevices();
  renderTable();
}

// Modal functions
function openModal(id) {
  currentUpdateId = id;
  let device = devices.find(d => d.id === id);
  document.getElementById("updateStatus").value = device.status;
  document.getElementById("updateReason").value = device.reason;
  document.getElementById("updateModal").style.display = "block";
}

function closeModal() {
  document.getElementById("updateModal").style.display = "none";
}

function saveUpdate() {
  let device = devices.find(d => d.id === currentUpdateId);
  if (device) {
    device.status = document.getElementById("updateStatus").value;
    device.reason = document.getElementById("updateReason").value;
    saveDevices();
    renderTable();
    closeModal();
  }
}

// Search inventory
function searchInventory() {
  let query = document.getElementById("search").value.toLowerCase();
  let filtered = devices.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.serial.toLowerCase().includes(query) ||
    d.region.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

// Export to CSV
function exportCSV() {
  let csv = "ID,Date Received,Name,Region,Phone No,Serial No,Status,Returned Date,Reason\n";
  devices.forEach(d => {
    csv += `${d.id},${d.dateReceived},${d.name},${d.region},${d.phone},${d.serial},${d.status},${d.returnedDate || ""},${d.reason || ""}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "devices_inventory.csv";
  link.click();
}

// Save to localStorage
function saveDevices() {
  localStorage.setItem("devices", JSON.stringify(devices));
}

// Initial render
renderTable();
