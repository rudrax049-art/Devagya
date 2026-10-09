const fileInput = document.getElementById('blueprints');
const dropZone = document.getElementById('dropZone');
const uploadList = document.getElementById('uploadList');
const intakeForm = document.getElementById('projectIntakeForm');
const intakeMessage = document.getElementById('intakeMessage');
const maximumFileSize = 10 * 1024 * 1024;
const acceptedFileTypes = ['application/pdf', 'image/png', 'image/jpeg'];

function validateFiles(fileList) {
  const validFiles = [];
  const rejectedFiles = [];
  Array.from(fileList).forEach((file) => {
    if (!acceptedFileTypes.includes(file.type) || file.size > maximumFileSize) {
      rejectedFiles.push(file.name);
    } else {
      validFiles.push(file);
    }
  });
  if (fileInput) {
    const transfer = new DataTransfer();
    validFiles.forEach((file) => transfer.items.add(file));
    fileInput.files = transfer.files;
  }
  renderFileNames(validFiles, rejectedFiles);
}

function renderFileNames(validFiles, rejectedFiles) {
  if (!uploadList) return;
  uploadList.replaceChildren();
  validFiles.forEach((file) => {
    const item = document.createElement('li');
    item.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
    uploadList.appendChild(item);
  });
  rejectedFiles.forEach((fileName) => {
    const item = document.createElement('li');
    item.textContent = `${fileName} was not added. Use a PDF, PNG or JPG under 10 MB.`;
    item.style.color = '#bd3c3c';
    uploadList.appendChild(item);
  });
}

if (fileInput) {
  fileInput.addEventListener('change', () => validateFiles(fileInput.files));
}
if (dropZone) {
  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.style.borderColor = '#b45309';
      dropZone.style.background = '#f4eee7';
    });
  });
  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background = '';
    });
  });
  dropZone.addEventListener('drop', (event) => {
    if (event.dataTransfer) validateFiles(event.dataTransfer.files);
  });
}

if (intakeForm) {
  intakeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!intakeForm.reportValidity()) return;
    const formData = new FormData(intakeForm);
    const selectedNames = Array.from(fileInput.files).map((file) => file.name);
    const bodyLines = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Phone / WhatsApp: ${formData.get('phone')}`,
      `Project location: ${formData.get('location')}`,
      `Project scope: ${formData.get('scope')}`,
      `Site status: ${formData.get('site_status')}`,
      `Functional frustrations:\n${formData.get('frustrations')}`,
      `Marketing updates opt-in: ${formData.get('updates_opt_in') === 'yes' ? 'Yes' : 'No'}`,
      `Selected plan files (attach manually): ${selectedNames.length ? selectedNames.join(', ') : 'None'}`
    ];
    const subject = encodeURIComponent(`Project enquiry — ${formData.get('scope')}`);
    const body = encodeURIComponent(bodyLines.join('\n\n'));
    intakeMessage.textContent = 'Your email application should open with the enquiry details. Attach the selected plans before sending; this website does not upload files.';
    window.location.href = `mailto:devagyavastu@gmail.com?subject=${subject}&body=${body}`;
  });
}
