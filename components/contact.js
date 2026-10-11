const fileInput = document.getElementById('blueprints');
const dropZone = document.getElementById('dropZone');
const uploadList = document.getElementById('uploadList');
const intakeForm = document.getElementById('projectIntakeForm');
const intakeMessage = document.getElementById('intakeMessage');
const blueprintNames = document.getElementById('blueprintNames');
const intakeSubmitButton = intakeForm && intakeForm.querySelector('button[type="submit"]');
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
  if (blueprintNames) blueprintNames.value = validFiles.map((file) => file.name).join(', ');
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
  intakeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!intakeForm.reportValidity()) return;
    intakeMessage.classList.remove('is-success', 'is-error');
    intakeMessage.textContent = '';
    intakeSubmitButton.disabled = true;
    const originalLabel = intakeSubmitButton.textContent;
    intakeSubmitButton.textContent = 'Sending enquiry...';
    try {
      await window.devagyaForms.submit(intakeForm);
      intakeForm.reset();
      if (uploadList) uploadList.replaceChildren();
      if (blueprintNames) blueprintNames.value = '';
      intakeMessage.classList.add('is-success');
      intakeMessage.textContent = 'Your enquiry was received. We will be in touch; please attach any plans when you reply.';
    } catch (error) {
      intakeMessage.classList.add('is-error');
      intakeMessage.textContent = 'We could not confirm delivery. Please try again or contact us directly by email or WhatsApp.';
    } finally {
      intakeSubmitButton.disabled = false;
      intakeSubmitButton.textContent = originalLabel;
    }
  });
}
