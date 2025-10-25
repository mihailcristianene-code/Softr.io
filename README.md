<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Panou Aprobare Activități</title>

<!-- Resurse Externe Comune -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="https://npmcdn.com/flatpickr/dist/l10n/ro.js"></script>

<!-- Choices.js -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" />
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>


<!-- BIBLIOTECA PDF.JS DE LA MOZILLA -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js"></script>

<!-- Stiluri CSS (Combinate) -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  /* Ensure styles apply correctly within the Softr block */
  :root {
    /* Consider using a more specific selector if needed */
    --bg-main: #f0f0f0;
    --bg-content: #ffffff;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --border-color: #dee2e6;
    --accent-blue: #0078d4;
    --accent-green: #107c10;
    --accent-red: #dc3545;
  }

  /* Adjust body styles if needed, target a container ID if possible */
  /* html, body { ... } - Removed as it's not needed/applicable */

  /* Scoped styles to the main container */
  #TabelContent {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-main);
    /* Apply background if needed */
    display: flex;
    flex-direction: column;
    /* height: 100vh; */
    /* Avoid fixed viewport height */
    max-height: 98vh;
    /* Use max-height instead */
    padding: 16px;
    box-sizing: border-box;
    gap: 16px;
  }

  body.modal-open {
    /* This might still be needed globally */
    overflow: hidden;
  }


  .header-section,
  #main-content {
    background-color: var(--bg-content);
    border-radius: 8px;
    border: 1px solid #c0c0c0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .header-section {
    flex-shrink: 0;
    position: relative;
    /* Needed for z-index context */
    z-index: 15;
    /* Ensure header section itself is above table */
  }

  #main-content {
    /* height: 85vh; */
    /* Avoid fixed viewport height */
    flex-grow: 1;
    /* Allow main content to grow */
    display: flex;
    flex-direction: column;
    min-height: 0;
    /* Necessary for flex-grow within flex column */
    position: relative;
  }

  .table-container {
    flex-grow: 1;
    /* Allow table container to fill available space */
    overflow: auto;
    /* Enable scrolling for the table itself */
    position: relative;
  }

  #dataTable {
    width: 100%;
    border-collapse: collapse;
  }

  #dataTable th,
  #dataTable td {
    padding: 8px 12px;
    text-align: left;
    border: 1px solid var(--border-color);
    vertical-align: middle;
    font-size: 14px;
  }

  #dataTable th {
    background-color: #0D223F;
    font-weight: 600;
    color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  #dataTable tbody tr {
    transition: opacity 0.2s ease-in-out;
  }

  #dataTable tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  #dataTable tbody tr:hover {
    background-color: #e2f0f9;
  }

  .table-footer {
    flex-shrink: 0;
    padding: 10px 12px;
    border-top: 1px solid #c0c0c0;
    background-color: #f8f9fa;
    display: flex;
    justify-content: space-between;
    /* Keeps count left, group right */
    align-items: center;
    font-size: 0.9em;
    /* Consistent font size for footer */
  }

  /* Container for right-aligned footer items */
  .footer-right-group {
    display: flex;
    align-items: center;
    gap: 20px;
    /* Add space between info and sums */
  }

  /* Style for sum section */
  #footer-sums span {
    /* margin-left removed, gap used now */
    font-weight: 500;
    color: #333;
  }

  #footer-sums span:not(:first-child) {
    /* Add spacing between sums */
    margin-left: 15px;
  }

  #footer-info span {
    /* margin-left removed */
    color: #6c757d;
  }

  #footer-info span:not(:first-child) {
    margin-left: 15px;
    /* Keep margin between info items */
  }


  .spinner-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 15;
    border-radius: 8px;
  }

  /* Style adjustments for main loading spinner text */
  #content-load-spinner {
    position: absolute;
    /* Needed to overlay content */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* Center spinner and text */
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    /* Slightly more opaque */
    z-index: 20;
    /* Ensure it's above table container */
    border-radius: 8px;
    text-align: center;
    color: var(--text-primary);
    font-weight: 500;
  }

  #content-load-spinner p {
    margin-top: 10px;
    /* Space between spinner and text */
    margin-bottom: 5px;
    /* Space before progress bar */
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: var(--accent-blue);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Progress Bar Styles */
  #progressBarContainer {
    width: 80%;
    max-width: 300px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    height: 10px;
    margin-top: 15px;
    display: none;
    /* Hidden by default */
  }

  #progressBar {
    height: 100%;
    background-color: var(--accent-blue);
    border-radius: 5px;
    width: 0%;
    /* Start at 0% */
    transition: width 0.5s ease-out;
    /* Smooth transition */
  }

  #progressPercentage {
    font-size: 0.8em;
    color: var(--text-secondary);
    margin-top: 5px;
    display: none;
    /* Hidden by default */
  }


  /* Stiluri pentru filtre */
  #filter-bar-header {
    padding: 10px 16px;
    background-image: linear-gradient(45deg, #6c757d 0%, #495057 100%);
    color: white;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #filter-bar-header.open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  #filter-bar-header .filter-arrow {
    transition: transform 0.3s ease;
    stroke: white;
    width: 16px;
    height: 16px;
  }

  #filter-bar-header.open .filter-arrow {
    transform: rotate(180deg);
  }

  #filter-bar-collapsible {
    /* max-height: 0; */
    /* Removed max-height animation */
    display: none;
    /* Start hidden */
    opacity: 0;
    /* Start transparent */
    overflow: visible;
    /* Keep visible for dropdowns */
    transition: opacity 0.15s ease-out;
    /* Faster opacity transition */
    padding: 16px;
    /* Keep padding consistent */
    background-color: #f8f9fa;
    border: 1px solid #c0c0c0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    position: relative;
    /* Needed for z-index */
    z-index: 15;
    /* Keep high z-index when open state is managed by JS */
  }

  #filter-bar-collapsible.open {
    /* max-height: 500px; */
    /* Removed */
    display: block;
    /* Show */
    opacity: 1;
    /* Fade in */
    /* z-index remains 15 */
    /* overflow: visible; */
    /* Already set */
  }

  .filter-row-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    /* Increased min width slightly */
    gap: 16px;
    align-items: flex-start;
    /* Changed to flex-start for Choices.js */
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: relative;
    /* Added for stacking context */
  }

  .filter-group label {
    font-weight: 500;
    font-size: 13px;
    color: var(--text-secondary);
  }

  .filter-row-wrapper input[type="text"]:not(#dateRangeFilter),
  /* Target non-date inputs */
  .filter-row-wrapper select,
  .filter-row-wrapper button {
    /* padding: 10px 12px; */
    /* Padding handled by Choices.js or native */
    border: 1px solid #a0a0a0;
    border-radius: 4px;
    font-size: 14px;
    background: #ffffff;
    width: 100%;
    box-sizing: border-box;
    /* height: 40px; */
    /* Height handled by Choices.js or native */
    min-height: 40px;
    /* Ensure min height */
  }

  /* Specific styling for the date picker input */
  #dateRangeFilter {
    padding: 10px 12px;
    height: 40px;
  }

  /* Buttons need explicit height */
  .filter-row-wrapper button {
    height: 40px;
    padding: 10px 12px;
  }

  .filter-row-wrapper select {
    /* Styles for hiding native select removed/commented */
  }

  .filter-row-wrapper select:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    color: #6c757d;
    /* Make text look disabled */
    border-color: #ced4da;
  }

  .filter-row-wrapper button {
    background-color: #6c757d;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .filter-row-wrapper button:hover {
    background-color: #5a6268;
  }

  /* Choices.js Specific Styles */
  .choices {
    font-size: 14px;
    min-height: 40px;
    /* Match button/input height */
    margin-bottom: 0;
    /* Override default margin */
    z-index: 2;
    /* Ensure Choices container is above default content */
  }

  /* Increase z-index when open */
  .choices.is-open {
    z-index: 3;
  }

  .choices__inner {
    background-color: white;
    border: 1px solid #a0a0a0;
    border-radius: 4px;
    min-height: 40px;
    /* Match button/input height */
    padding: 4px 7.5px;
    /* Adjust padding */
    font-size: 14px;
  }

  .choices[data-type*="select-multiple"] .choices__inner {
    padding-bottom: 2px;
    /* Adjust padding for multiple items */
  }

  .choices__list--multiple .choices__item {
    background-color: var(--accent-blue);
    border-color: var(--accent-blue);
    font-size: 12px;
    margin-bottom: 2px;
    /* Adjust spacing */
  }

  .choices__input {
    font-size: 14px;
    background-color: white;
    margin-bottom: 2px;
    /* Adjust spacing */
  }

  .choices__list--dropdown .choices__item--selectable {
    font-size: 14px;
  }

  .choices__list--dropdown {
    z-index: 1200;
    /* Further increased z-index */
    font-size: 14px;
  }

  /* Rule for dropdown height */
  .choices__list--dropdown .choices__list {
    max-height: 300px;
    /* Increased max height */
    overflow-y: auto;
    /* Add scrollbar if needed */
  }

  .is-disabled .choices__inner,
  .is-disabled .choices__input {
    background-color: #e9ecef;
    cursor: not-allowed;
  }

  /* Style for loading placeholder in Choices.js */
  .choices__list--dropdown .choices__item--disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    font-style: italic;
  }


  /* Butoane iconiță */
  .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    color: #495057;
    /* Culoare default pentru iconițe */
    font-size: 24px;
    /* Mărime uniformă */
    line-height: 1;
    /* Aliniere verticală */
  }

  .icon-btn:hover {
    background-color: #e9e9e9;
  }

  .approve-btn {
    /* Stilurile pt clopotel sau bifa sunt gestionate in JS/HTML prin clase */
  }

  .approve-btn.approved {
    color: var(--accent-green);
    /* Verde pentru bifă */
  }

  .approve-btn.pending {
    color: #f0ad4e;
    /* Galben pentru clopoțel */
  }

  .approve-btn.rejected {
    color: var(--accent-red);
    /* Roșu pentru X */
  }

  .edit-btn {
    /* font-size și line-height sunt deja setate la .icon-btn */
    color: var(--accent-blue);
    /* Blue color */
  }


  /* Modaluri */
  /* Make modals fixed relative to viewport */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-overlay.visible {
    display: flex;
  }

  /* Modal secundar deasupra */
  #selectionOverlayModal {
    z-index: 1005;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .modal-content {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    width: 60vw;
    max-width: 900px;
    resize: both;
    overflow: auto;
    min-width: 500px;
    min-height: 300px;
  }

  /* Removed PDF Viewer Modal CSS */
  /* #pdfViewerModal .modal-content { ... } */

  #editRecordModal .modal-content,
  #approvalConfirmationModal .modal-content,
  #selectionOverlayModal .modal-content {
    width: 70vw;
    max-width: 1100px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }

  /* Added margin: 0 */
  .modal-close-btn {
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 5px;
    line-height: 1;
  }

  /* Adjusted padding/line-height */
  .modal-body {
    overflow-y: auto;
    flex-grow: 1;
    padding-right: 10px;
  }

  /* Add padding for scrollbar */
  .modal-footer {
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
    margin-top: 15px;
    text-align: right;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  /* Added flex-shrink: 0 */

  .offer-list-item,
  .contract-list-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.15s ease;
    line-height: 1.4;
    /* Added line-height */
  }

  .offer-list-item:hover,
  .contract-list-item:hover {
    background-color: #f0f8ff;
  }

  /* Light blue hover */
  .offer-list-item.selected,
  .contract-list-item.selected {
    background-color: #d4edda;
    font-weight: bold;
  }

  .offer-list-item small,
  .contract-list-item small {
    color: #555;
    font-size: 0.85em;
    /* Smaller font for details */
  }


  /* Removed PDF Viewer CSS */
  /* .view-pdf-btn { ... } */
  /* #pdf-viewer-container canvas { ... } */


  /* Stiluri pentru butonul de vizualizare PDF */
  .view-pdf-btn {
    padding: 4px 8px;
    background-color: #0078d4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 10px;
    transition: background-color 0.2s;
    display: inline-block;
  }

  .view-pdf-btn:hover {
    background-color: #005a9e;
  }

  .view-pdf-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  /* Modal pentru vizualizare PDF */
  .pdf-viewer-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 10000;
  }

  .pdf-viewer-content {
    position: relative;
    width: 90%;
    height: 90%;
    max-width: 1200px;
    margin: 2% auto;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .pdf-viewer-header {
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 8px 8px 0 0;
  }

  .pdf-viewer-title {
    font-size: 18px;
    font-weight: 600;
    color: #212529;
  }

  .pdf-viewer-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6c757d;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pdf-viewer-close:hover {
    color: #212529;
  }

  .pdf-viewer-body {
    flex: 1;
    padding: 20px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pdf-canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .pdf-page-canvas {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    height: auto;
  }

  .pdf-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .pdf-loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0078d4;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  .pdf-error {
    color: #dc3545;
    text-align: center;
    padding: 20px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  #editRecordModal .form-grid,
  #disapprovalFieldsGroup {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }

  /* Stiluri comune pentru inputuri/selecturi editabile și readonly */
  #editRecordModal input,
  #editRecordModal select,
  #disapprovalFieldsGroup input,
  #disapprovalFieldsGroup select,
  #disapprovalFieldsGroup textarea,
  #selectionOverlayModal input,
  #selectionOverlayModal select,
  #activitySourceSelect,
  #activitySourceSelectDisapproval {
    width: 100%;
    max-width: 450px;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    box-sizing: border-box;
  }

  /* Stil specific pt inputuri readonly */
  #editRecordModal input[readonly],
  #editRecordModal select[disabled] {
    background-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.7;
    /* Optional: make them look slightly faded */
  }

  /* Stil pt dropdown-uri dezactivate */
  #activitySourceSelect:disabled,
  #activitySourceSelectDisapproval:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }

  #selectionOverlayModal .filter-row-wrapper input,
  #selectionOverlayModal .filter-row-wrapper select {
    max-width: none;
    /* Permite filtrelor din modalul secundar sa ocupe spațiul */
  }

  #disapprovalFieldsGroup textarea {
    min-height: 80px;
    resize: vertical;
  }

  #offerSearchInApprovalInput,
  #contractSearchInApprovalInput,
  #selectionOverlaySourceSelect {
    width: 100%;
    max-width: 450px;
    padding: 10px 12px;
  }

  .modal-action-btn {
    padding: 10px 20px;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-save {
    background-color: var(--accent-green);
  }

  .btn-save:hover {
    background-color: #0d6a0d;
  }

  .btn-rejection {
    background-color: var(--accent-red);
  }

  .btn-rejection:hover {
    background-color: #c82333;
  }

  .btn-cancel {
    background-color: #6c757d;
  }

  .btn-cancel:hover {
    background-color: #5a6268;
  }

  .modal-action-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .radio-group {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  .radio-group label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
  }

  /* Stiluri pentru Notificarea de finalizare */
  /* Make notification fixed relative to viewport */
  #readyNotification {
    position: fixed;
    /* Changed from absolute */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(40, 40, 40, 0.85);
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    text-align: center;
    z-index: 1050;
    /* Ensure it's above modals */
    pointer-events: auto;
    /* Containerul ascultă click-uri pentru a se închide */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    display: none;
    /* Initially hidden */
  }

  #readyNotification p {
    margin-bottom: 15px;
    font-size: 1.1em;
    pointer-events: none;
    /* Textul nu blochează click-ul */
  }

  #readyNotification button {
    pointer-events: auto;
    /* Butonul rămâne clickabil */
    padding: 8px 25px;
    border: none;
    border-radius: 5px;
    background-color: var(--accent-blue);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  #readyNotification button:hover {
    background-color: #005a9e;
  }

  #offerListInApprovalContainer,
  #contractListInApprovalContainer,
  #selectionOverlayOfferListContainer,
  #selectionOverlayContractListContainer {
    max-height: 400px;
    /* Consistent height */
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
  }

  /* Specific styles for selection overlay */
  #selectionOverlayModal .modal-body {
    display: flex;
    flex-direction: column;
  }

  #selectionOverlayOfferSection,
  #selectionOverlayContractSection {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    /* Make the list section take available space */
    min-height: 0;
    /* Necessary for flex-grow in flex column */
  }

  #selectionOverlayOfferListContainer,
  #selectionOverlayContractListContainer {
    flex-grow: 1;
    /* Make the list container itself grow */
  }

  /* Container filtre modal contract secundar - reordonat */
  #selectionOverlayContractFilterContainer {
    grid-template-columns: 1fr 1fr;
    /* Doua coloane */
    margin-top: 0;
    padding-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
  }
</style>

<div id="TabelContent">
  <div id="main-content">
    <!-- Spinner initial vizibil -->
    <div id="content-load-spinner">
      <div class="spinner"></div>
      <p>Se încarcă datele...</p> <!-- Generic loading message -->
      <!-- Progress Bar Container -->
      <div id="progressBarContainer">
        <div id="progressBar"></div>
      </div>
      <!-- Percentage Display -->
      <span id="progressPercentage">0%</span>
    </div>

    <div class="header-section" style="margin-bottom: 16px;">
      <div id="filter-bar-header">
        <span id="filter-bar-title">Filtre</span>
        <svg class="filter-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div id="filter-bar-collapsible">
        <div class="filter-row-wrapper">
          <div class="filter-group"><label for="dateRangeFilter">Perioadă</label><input type="text" id="dateRangeFilter" placeholder="Selectează un interval">
          </div>
          <div class="filter-group">
            <label for="yearFilter">An</label><select id="yearFilter"><option value="">Toți anii</option></select>
          </div>
          <!-- Quarter Filter (Single Select) -->
          <div class="filter-group"><label for="quarterFilter">Trimestru</label>
            <select id="quarterFilter">
                                 <option value="">Toate</option>
                                 <option value="1">T1 (Ian-Mar)</option>
                                 <option value="2">T2 (Apr-Iun)</option>
                                 <option value="3">T3 (Iul-Sep)</option>
                                 <option value="4">T4 (Oct-Dec)</option>
                             </select>
          </div>
          <!-- *** NEW: Month Filter *** -->
          <div class="filter-group"><label for="monthFilter">Lună</label>
            <select id="monthFilter">
                                 <option value="">Toate</option>
                                 <option value="0">Ianuarie</option>
                                 <option value="1">Februarie</option>
                                 <option value="2">Martie</option>
                                 <option value="3">Aprilie</option>
                                 <option value="4">Mai</option>
                                 <option value="5">Iunie</option>
                                 <option value="6">Iulie</option>
                                 <option value="7">August</option>
                                 <option value="8">Septembrie</option>
                                 <option value="9">Octombrie</option>
                                 <option value="10">Noiembrie</option>
                                 <option value="11">Decembrie</option>
                             </select>
          </div>
          <!-- Multi-select Filters -->
          <div class="filter-group">
            <label for="projectFilter">Proiect</label><select id="projectFilter" multiple><option value="">Toate</option></select>
          </div>
          <div class="filter-group">
            <label for="nameFilter">Nume Prenume</label><select id="nameFilter" multiple><option value="">Toate</option></select>
          </div>
          <div class="filter-group">
            <label for="contractProjectFilter">Contract Proiect</label><select id="contractProjectFilter" multiple><option value="">Toate</option></select>
          </div>
          <div class="filter-group">
            <label for="contractActivityFilter">Contract Activitate</label><select id="contractActivityFilter" multiple><option value="">Toate</option></select>
          </div>
          <div class="filter-group">
            <label for="contractMonthYearFilter">Contract Luna si An</label><select id="contractMonthYearFilter" multiple><option value="">Toate</option></select>
          </div>

          <div class="filter-group">
            <label>&nbsp;</label><button id="toggleHolidaysBtn" title="Arată/Ascunde înregistrările de concediu">Arata concedii</button>
          </div>
          <div class="filter-group">
            <label>&nbsp;</label><button id="refreshDataBtn" title="Reîncarcă toate datele de la server">Refresh date</button>
          </div>
          <div class="filter-group"><label>&nbsp;</label><button id="resetFiltersBtn">Resetează</button></div>
        </div>
      </div>
    </div>

    <!-- Container tabel initial ascuns -->
    <div class="table-container" style="display: none;">
      <table id="dataTable">
        <thead>
          <tr>
            <th style="width: 70px;" title="Aprobat?">Status Aprobare</th>
            <th style="width: 70px;" title="Editează">Editare</th>
            <th style="width: 200px;">Nume Prenume</th>
            <th style="width: 200px;">Proiect</th>
            <th style="width: 150px;">Activitate</th>
            <th style="width: 180px;">Data Start</th>
            <th style="width: 180px;">Data Stop</th>
            <th style="width: 180px;">Creat la</th>
            <th style="width: 120px;">Ore Efectuate</th>
            <th style="width: 100px;">KM</th>
            <!-- *** NEW COLUMN *** -->
            <th style="width: 250px;">Descriere activitate</th>
          </tr>
        </thead>
        <tbody id="dataTableBody"></tbody>
      </table>
    </div>
    <!-- Updated Footer Structure -->
    <div class="table-footer">
      <span id="records-count-info"></span>
      <div class="footer-right-group">
        <div id="footer-info">
          <span id="background-load-info"></span> <!-- Renamed from background-load-info -->
          <span id="total-records-info"></span>
        </div>
        <div id="footer-sums">
          <span id="total-ore-sum">Total Ore: 0</span>
          <span id="total-km-sum">Total KM: 0</span>
        </div>
      </div>
    </div>
    <div id="readyNotification">
      <p>Toate datele sunt încărcate. Filtrarea este completă.</p>
      <button id="readyNotificationOkBtn">OK</button>
    </div>
  </div>
</div>

<!-- Modalele rămân neschimbate -->
<!-- Modals -->
<!-- Removed offerDetailsModal and offerSelectionModal -->

<!-- Modal Editare Adaptat (folosit și pentru post-aprobare/vizualizare) -->
<div id="editRecordModal" class="modal-overlay" style="z-index: 1002;">
  <div class="modal-content">
    <div class="modal-header">
      <h2 id="editModalTitle">Editează Activitate</h2>
      <button class="modal-close-btn">&times;</button>
    </div>
    <form id="editForm" class="modal-body">
      <h4>Date Curente (<span id="editFieldsStatus">Editabile</span>)</h4>
      <div class="form-grid">
        <div class="filter-group"><label for="editNume">Nume Prenume</label><input type="text" id="editNume"></div>
        <div class="filter-group"><label for="editProiect">Proiect</label><select id="editProiect"></select></div>
        <div class="filter-group"><label for="editActivitate">Activitate</label><input type="text" id="editActivitate">
        </div>
        <div class="filter-group"><label for="editStart">Data Start</label><input type="datetime-local" id="editStart">
        </div>
        <div class="filter-group"><label for="editStop">Data Stop</label><input type="datetime-local" id="editStop">
        </div>
        <!-- *** NEW FIELD ADDED *** -->
        <div class="filter-group">
          <label for="editActivitySource">De unde provine activitatea?</label>
          <select id="editActivitySource">
                            <option value="" selected disabled>Alege o sursă...</option>
                            <option value="Oferta">Ofertă</option>
                            <option value="Contract">Contract</option>
                            <option value="Proces ofertare">Proces ofertare</option>
                        </select>
        </div>
      </div>
      <hr style="margin: 20px 0;">
      <h4>Date Inițiale (Înainte de Aprobare/Refuz)</h4>
      <div class="form-grid">
        <div class="filter-group"><label>Nume Prenume Inițial</label><input type="text" id="initialNume" readonly></div>
        <div class="filter-group"><label>Proiect Inițial</label><input type="text" id="initialProiect" readonly></div>
        <div class="filter-group"><label>Activitate Inițială</label><input type="text" id="initialActivitate" readonly>
        </div>
        <div class="filter-group"><label>Data Start Inițială</label><input type="text" id="initialStart" readonly></div>
        <div class="filter-group"><label>Data Stop Inițială</label><input type="text" id="initialStop" readonly></div>
      </div>
    </form>
    <div class="modal-footer">
      <button id="cancelEditBtn" class="modal-action-btn btn-cancel">Renunță</button>
      <button id="saveEditBtn" class="modal-action-btn btn-save">Salvează</button>
    </div>
  </div>
</div>

<!-- Modal principal pentru confirmare aprobare/refuz -->
<div id="approvalConfirmationModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Confirmare Aprobare</h2>
      <button class="modal-close-btn">&times;</button>
    </div>
    <div class="modal-body">
      <h4>Aprobați acest raport?</h4>
      <div class="radio-group">
        <label><input type="radio" name="approvalDecision" value="yes"> Da</label>
        <label><input type="radio" name="approvalDecision" value="no"> Nu</label>
      </div>

      <!-- Secțiunea pentru aprobare (DA) -->
      <div id="approvalActionGroup" style="display: none;">
        <div class="filter-group" style="margin-top: 15px;">
          <label for="activitySourceSelect">De unde provine activitatea?</label>
          <select id="activitySourceSelect">
                            <option value="" selected disabled>Alege o sursă...</option>
                            <option value="Oferta">Ofertă</option>
                            <option value="Contract">Contract</option>
                            <option value="Proces ofertare">Proces ofertare</option>
                        </select>
        </div>
        <!-- Container pentru selecția de oferte, integrat în modalul principal -->
        <div id="offerSelectionInApproval"
          style="display: none; margin-top: 15px; border-top: 1px solid #dee2e6; padding-top: 15px;">
          <label for="offerSearchInApprovalInput">Alege Ofertă(e):</label> <!-- Modified label -->
          <input type="text" id="offerSearchInApprovalInput" placeholder="Caută oferta..." style="width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #ccc; margin-top: 5px;">
          <div id="offerListInApprovalContainer"></div>
        </div>
        <!-- Container pentru selecția de contracte, integrat în modalul principal -->
        <div id="contractSelectionInApproval"
          style="display: none; margin-top: 15px; border-top: 1px solid #dee2e6; padding-top: 15px;">
          <div id="contractModalFilterContainer" class="filter-row-wrapper"
            style="grid-template-columns: 1fr 1fr; margin-top: 0; padding-bottom: 15px; border-bottom: 1px solid #dee2e6;">
            <div class="filter-group">
              <label for="contractSearchInApprovalInput">Căutare</label>
              <input type="text" id="contractSearchInApprovalInput" placeholder="Caută contractul...">
            </div>
            <div class="filter-group">
              <label for="contractModalProjectFilter">Proiect</label>
              <select id="contractModalProjectFilter"></select>
            </div>
            <div class="filter-group">
              <label for="contractModalPrestatorFilter">Prestator</label>
              <select id="contractModalPrestatorFilter"></select>
            </div>
            <div class="filter-group">
              <label for="contractModalMonthYearFilter">Luna si An</label>
              <select id="contractModalMonthYearFilter"></select>
            </div>
          </div>
          <div id="contractListInApprovalContainer"></div>
        </div>
        <!-- Zona unde se va afișa un mesaj despre selecție -->
        <div id="selectionInfo" style="margin-top: 10px; font-style: italic; color: var(--text-secondary);"></div>
      </div>

      <!-- Secțiunea pentru refuz (NU) -->
      <div id="disapprovalFieldsGroup" style="display: none;">
        <p>Completați detaliile necesare pentru ajustare:</p>
        <div class="filter-group"><label for="disapprovalNume">Nume Prenume</label><input type="text" id="disapprovalNume">
        </div>
        <div class="filter-group">
          <label for="disapprovalProiect">Proiect</label><select id="disapprovalProiect"></select>
        </div>
        <div class="filter-group"><label for="disapprovalActivitate">Activitate</label><input type="text" id="disapprovalActivitate">
        </div>
        <div class="filter-group"><label for="disapprovalStart">Data Start</label><input type="datetime-local" id="disapprovalStart">
        </div>
        <div class="filter-group"><label for="disapprovalStop">Data Stop</label><input type="datetime-local" id="disapprovalStop">
        </div>
        <div class="filter-group">
          <label for="disapprovalReason">Motiv refuz</label><textarea id="disapprovalReason"></textarea>
        </div>
        <div class="filter-group" style="margin-top: 15px;">
          <label for="activitySourceSelectDisapproval">De unde provine activitatea?</label>
          <select id="activitySourceSelectDisapproval">
                            <option value="" selected disabled>Alege o sursă...</option>
                            <option value="Oferta">Ofertă</option>
                            <option value="Contract">Contract</option>
                            <option value="Proces ofertare">Proces ofertare</option>
                        </select>
        </div>
        <!-- Zona unde se va afișa un mesaj despre selecție pentru refuz -->
        <div id="disapprovalSelectionInfo" style="margin-top: 10px; font-style: italic; color: var(--text-secondary);">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button id="cancelApprovalBtn" class="modal-action-btn btn-cancel">Anulează</button>
      <button id="confirmApprovalBtn" class="modal-action-btn btn-save" disabled>Confirmă</button>
    </div>
  </div>
</div>

<!-- Modal Secundar pentru Selectie Oferta/Contract (folosit doar la Refuz) -->
<div id="selectionOverlayModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2 id="selectionOverlayTitle">Selectează</h2>
      <button class="modal-close-btn" data-target-modal="selectionOverlayModal">&times;</button>
    </div>
    <div class="modal-body">
      <div class="filter-group" style="margin-bottom: 15px;">
        <label for="selectionOverlaySourceSelect">De unde provine activitatea?</label>
        <!-- Am eliminat 'disabled' și stilul gri -->
        <select id="selectionOverlaySourceSelect" style="padding: 10px 12px; border: 1px solid #ccc; border-radius: 4px;">
                         <option value="Oferta">Ofertă</option>
                         <option value="Contract">Contract</option>
                     </select>
      </div>

      <!-- Secțiune Ofertă -->
      <div id="selectionOverlayOfferSection" style="display: none;">
        <label for="selectionOverlayOfferSearch">Caută Ofertă:</label>
        <input type="text" id="selectionOverlayOfferSearch" placeholder="Caută..." style="width: 100%; margin-top: 5px; margin-bottom: 10px;">
        <div id="selectionOverlayOfferListContainer"></div>
      </div>

      <!-- Secțiune Contract - Reordonată -->
      <div id="selectionOverlayContractSection" style="display: none;">
        <div id="selectionOverlayContractFilterContainer" class="filter-row-wrapper"
          style="grid-template-columns: 1fr 1fr; margin-top: 0; padding-bottom: 15px; border-bottom: 1px solid #dee2e6;">
          <!-- Rand 1 -->
          <div class="filter-group">
            <label for="selectionOverlayContractSearch">Căutare</label>
            <input type="text" id="selectionOverlayContractSearch" placeholder="Caută contractul...">
          </div>
          <div class="filter-group">
            <label for="selectionOverlayContractProjectFilter">Proiect</label>
            <select id="selectionOverlayContractProjectFilter"></select>
          </div>
          <!-- Rand 2 -->
          <div class="filter-group">
            <label for="selectionOverlayContractPrestatorFilter">Prestator</label>
            <select id="selectionOverlayContractPrestatorFilter"></select>
          </div>
          <div class="filter-group">
            <label for="selectionOverlayContractMonthYearFilter">Luna si An</label>
            <select id="selectionOverlayContractMonthYearFilter"></select>
          </div>
        </div>
        <div id="selectionOverlayContractListContainer"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button id="cancelSelectionOverlayBtn" class="modal-action-btn btn-cancel">Anulează</button>
      <button id="confirmSelectionOverlayBtn" class="modal-action-btn btn-save">Selectează</button>
    </div>
  </div>
</div>


<!-- Modal pentru vizualizare PDF -->
<div id="pdfViewerModal" class="pdf-viewer-modal">
  <div class="pdf-viewer-content">
    <div class="pdf-viewer-header">
      <h3 class="pdf-viewer-title">Vizualizare Document PDF</h3>
      <button class="pdf-viewer-close" onclick="closePdfViewer()">&times;</button>
    </div>
    <div class="pdf-viewer-body" id="pdfViewerBody">
      <div class="pdf-loading">
        <div class="pdf-loading-spinner"></div>
        <p style="margin-top: 15px;">Se încarcă documentul...</p>
      </div>
    </div>
  </div>
</div>

<script>
  function runApp() {
        // Log function for debugging in browser console
        function logToConsole(message, type = 'INFO') {
           console.log(`[${type}] ${message}`); // Keep logs enabled for debugging
        }

        logToConsole('DOM gata. Se pornește aplicația.');

        // --- Airtable Config & Fields (Unchanged) ---
        const AIRTABLE_CONFIG = { personalAccessToken: 'pat4EgJxQ8YOSdwlE.97b2dabd7b0b83c8653c85bf6fe8afe3e4ee70ade966fe59cd5672d2b076a21d', baseId: 'apphjAFjuAuPbEfiz' };
        const ID_TABEL_ACTIVITATI = 'tblv6Q8bAB2qvSRXh';
        const ID_TABEL_OFERTE = 'tbltPi62MZyHCqt9P';
        const ID_TABEL_CONTRACTE = 'tblV67RGVR6TZrZq0';
        // *** NEW: View IDs ***
        const VIEW_ID_FARA_CO = 'viwCSuRTJRuqMLod0';
        const VIEW_ID_TOATE = 'viwwTmD86020ydCdB';

        const FIELDS = { /* ... fields definition ... */
            START: 'DATA SI ORA START', 
            STOP: 'DATA SI ORA STOP', 
            ORE: 'ORE EFECTUATE', 
            PROIECT: 'PROIECT', 
            NUME: 'NUME SI PRENUME', 
            ACTIVITATE: 'TIP ACTIVITATE PROIECT', 
            // *** NEW FIELD ***
            DESCRIERE_ACTIVITATE: 'DESCRIERE ACTIVITATE PROIECT',
            APROBAT: 'Aproba', 
            OFERTA_LINK: 'Oferta', 
            CONTRACT_LINK: 'Contract', 
            CREAT_LA: 'Creat la', 
            KM: 'KM', 
            MOTIV_REFUZ: 'Motiv refuz', 
            START_INIT: 'Data start initiala', 
            STOP_INIT: 'Data stop initiala', 
            PROIECT_INIT: 'Proiect initial', 
            ACTIVITATE_INIT: 'Activitatea initial', 
            NUME_INIT: 'Nume si prenume initial', 
            OFERTA_NUME_PRIMAR: "OFERTA", 
            OFERTA_PDF: 'OFERTA PDF', 
            OFERTA_ESENTIALE: ["DATA INTOCMIRE OFERTA", "BENEFICIAR (from BENEFICIAR)", "Va rugam sa gasiti concatenate", "Total oferta cu adaos"], 
            CONTRACT_NUME_PRIMAR: "Activitatea", 
            CONTRACT_ESENTIALE: ["Proiect", "Prestator", "Luna si an", "Buget", "Moneda", "Status"]
         };


        let showHolidays = false;
        let areActivityFiltersReady = false;
        let areLinkedDataReady = false;

        // --- DOM Element References ---
        const loadingDiv = document.getElementById('content-load-spinner');
        const progressBarContainer = document.getElementById('progressBarContainer');
        const progressBar = document.getElementById('progressBar');
        const progressPercentageSpan = document.getElementById('progressPercentage'); // Percentage Span
        const tableContainer = document.querySelector('.table-container');
        const tableBody = document.getElementById('dataTableBody');
        const modals = { /* ... modal references ... */
             // *** REMOVED: details, selection ***
             edit: document.getElementById('editRecordModal'), 
             approval: document.getElementById('approvalConfirmationModal'), 
             selectionOverlay: document.getElementById('selectionOverlayModal')
        };
        const filters = { /* ... filter references ... */
             dateRange: document.getElementById('dateRangeFilter'), 
             year: document.getElementById('yearFilter'), 
             quarter: document.getElementById('quarterFilter'), 
             month: document.getElementById('monthFilter'), // *** ADDED MONTH FILTER ***
             project: document.getElementById('projectFilter'), 
             name: document.getElementById('nameFilter'), 
             resetBtn: document.getElementById('resetFiltersBtn'), 
             toggleHolidaysBtn: document.getElementById('toggleHolidaysBtn'), 
             refreshDataBtn: document.getElementById('refreshDataBtn'), 
             header: document.getElementById('filter-bar-header'), 
             collapsible: document.getElementById('filter-bar-collapsible'), 
             contractProject: document.getElementById('contractProjectFilter'), 
             contractActivity: document.getElementById('contractActivityFilter'), 
             contractMonthYear: document.getElementById('contractMonthYearFilter')
        };
        // Footer elements
         const totalRecordsInfo = document.getElementById('total-records-info'); const totalOreSumSpan = document.getElementById('total-ore-sum'); const totalKMSumSpan = document.getElementById('total-km-sum'); const readyNotification = document.getElementById('readyNotification'); const backgroundLoadInfo = document.getElementById('background-load-info');
         // Approval Modal Elements
         const approvalSourceSelect = document.getElementById('activitySourceSelect'); const confirmApprovalBtn = document.getElementById('confirmApprovalBtn'); const cancelApprovalBtn = document.getElementById('cancelApprovalBtn'); const approvalDecisionRadios = document.querySelectorAll('input[name="approvalDecision"]'); const approvalActionGroup = document.getElementById('approvalActionGroup'); const disapprovalFieldsGroup = document.getElementById('disapprovalFieldsGroup'); const disapprovalReasonInput = document.getElementById('disapprovalReason'); const activitySourceSelectDisapproval = document.getElementById('activitySourceSelectDisapproval'); const selectionInfoDiv = document.getElementById('selectionInfo'); const disapprovalSelectionInfoDiv = document.getElementById('disapprovalSelectionInfo');
         // Selection elements within the main modal
         const offerSelectionInApproval = document.getElementById('offerSelectionInApproval'); const offerSearchInApprovalInput = document.getElementById('offerSearchInApprovalInput'); const offerListInApprovalContainer = document.getElementById('offerListInApprovalContainer'); const contractSelectionInApproval = document.getElementById('contractSelectionInApproval'); const contractSearchInApprovalInput = document.getElementById('contractSearchInApprovalInput'); const contractModalProjectFilter = document.getElementById('contractModalProjectFilter'); const contractModalPrestatorFilter = document.getElementById('contractModalPrestatorFilter'); const contractModalMonthYearFilter = document.getElementById('contractModalMonthYearFilter'); const contractListInApprovalContainer = document.getElementById('contractListInApprovalContainer');
         // Secondary Selection Modal Elements
         const selectionOverlayTitle = document.getElementById('selectionOverlayTitle'); const selectionOverlaySourceSelect = document.getElementById('selectionOverlaySourceSelect'); const selectionOverlayOfferSection = document.getElementById('selectionOverlayOfferSection'); const selectionOverlayOfferSearch = document.getElementById('selectionOverlayOfferSearch'); const selectionOverlayOfferListContainer = document.getElementById('selectionOverlayOfferListContainer'); const selectionOverlayContractSection = document.getElementById('selectionOverlayContractSection'); const selectionOverlayContractSearch = document.getElementById('selectionOverlayContractSearch'); const selectionOverlayContractProjectFilter = document.getElementById('selectionOverlayContractProjectFilter'); const selectionOverlayContractPrestatorFilter = document.getElementById('selectionOverlayContractPrestatorFilter'); const selectionOverlayContractMonthYearFilter = document.getElementById('selectionOverlayContractMonthYearFilter'); const selectionOverlayContractListContainer = document.getElementById('selectionOverlayContractListContainer'); const cancelSelectionOverlayBtn = document.getElementById('cancelSelectionOverlayBtn'); const confirmSelectionOverlayBtn = document.getElementById('confirmSelectionOverlayBtn');


        // --- State Variables ---
        let allOffersData = new Map();
        let allContractsData = new Map();
        let allActivities = [];
        let dateRangePicker = null;
        let choicesInstances = {}; // Store Choices.js instances
        let progressInterval = null; // Variable for the progress interval

        // --- NEW: Infinite Scroll State ---
        let currentFilteredActivities = []; // Holds ALL filtered activities
        let currentDisplayedActivities = []; // Holds ONLY displayed activities
        let currentPage = 1;
        const RECORDS_PER_PAGE = 100;
        let isLoadingMore = false; // Lock to prevent multiple scroll loads

        // --- API Call Functions (MODIFIED - Added Timeout) ---
        async function apiCall(url, method = 'GET', body = null, timeout = 15000) { // Added 15s timeout
            logToConsole(`apiCall: ${method} ${url}`, 'DEBUG');

            const controller = new AbortController();
            const signal = controller.signal;
            let timeoutId = setTimeout(() => {
                logToConsole(`API call timed out for: ${url}`, 'WARN');
                controller.abort();
            }, timeout);

            try {
                const h = { 'Authorization': `Bearer ${AIRTABLE_CONFIG.personalAccessToken}`, 'Content-Type': 'application/json' };
                const opt = { method, headers: h, body: body ? JSON.stringify(body) : null, signal }; // Pass signal to fetch
                const res = await fetch(url, opt);
                
                clearTimeout(timeoutId); // Clear timeout if fetch succeeds

                if (!res.ok) {
                    let errorMsg = `HTTP status ${res.status}: ${res.statusText}`;
                    try { const d = await res.json(); if (d?.error?.message) errorMsg = d.error.message; } catch (e) { }
                    try { if (!errorMsg.includes(res.statusText)) errorMsg = await res.text(); } catch (e) { }
                    const tableId = new URL(url).pathname.split('/')[3];
                    const finalError = `Tabel "${tableId}": ${errorMsg}`;
                    logToConsole(`API Error: ${finalError}`, 'ERROR');
                    throw new Error(finalError);
                }
                return res.json();
            } catch (error) {
                clearTimeout(timeoutId); // Clear timeout if fetch fails
                if (error.name === 'AbortError') {
                    logToConsole(`API call aborted (timeout) for: ${url}`, 'ERROR');
                    throw new Error(`Request timed out after ${timeout / 1000}s`);
                }
                logToConsole(`Eroare în apiCall: ${error.message}`, 'ERROR');
                throw error;
            }
        }
        
        // *** MODIFIED fetchRecords to accept 'view' ***
        async function fetchRecords(tableId, { sortBy = null, filterByFormula = null, view = null } = {}) {
            let records = [], offset = null, url = new URL(`https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}`);
            
            // *** MODIFIED: View logic ***
            if (view) {
                logToConsole(`Fetching records using View: ${view}`, 'DEBUG');
                url.searchParams.set('view', view);
                // Airtable API: sort and filterByFormula cannot be used with view
                // We assume the view is pre-sorted in Airtable
            } else {
                // Keep sort/filter logic for non-view fetches (Offers, Contracts)
                logToConsole(`Fetching records using Sort/Filter. Sort: ${sortBy}, Filter: ${filterByFormula}`, 'DEBUG');
                if (sortBy) {
                    url.searchParams.set('sort[0][field]', sortBy.field);
                    url.searchParams.set('sort[0][direction]', sortBy.direction || 'desc');
                }
                if (filterByFormula) {
                    url.searchParams.set('filterByFormula', filterByFormula);
                }
            }

            let pageCount = 0;
            logToConsole(`fetchRecords starting for ${tableId}, page ${pageCount + 1}`); // Added log
            do {
                if (offset) url.searchParams.set('offset', offset);
                try {
                    logToConsole(`Fetching page ${pageCount + 1} for ${tableId}...`, 'DEBUG'); // Added log
                    const data = await apiCall(url.toString()); // This will now use the timeout
                    if (!data) {
                        logToConsole(`No data returned for ${tableId}, page ${pageCount + 1}`, 'WARN');
                        return records; // Return what we have if data is null
                    }
                    records.push(...data.records);
                    offset = data.offset;
                    pageCount++;
                    logToConsole(`Fetched page ${pageCount} for ${tableId}. Records now: ${records.length}. Offset: ${offset}`, 'DEBUG'); // Added log
                    // *** MODIFIED: Increased delay ***
                    if (offset) await new Promise(resolve => setTimeout(resolve, 250)); // 250ms delay
                } catch (error) {
                   logToConsole(`Eroare la fetchRecords pentru ${tableId}, pagina ${pageCount}: ${error.message}`, 'ERROR'); // Corrected pageCount
                   return records; // Return fetched so far on error
                }
            } while (offset);
            logToConsole(`fetchRecords: Finalizat pentru ${tableId}. Total ${records.length} înregistrări.`)
            return records;
        }
        async function fetchSingleRecord(tableId, recordId) { /* ... */
            try { return await apiCall(`https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}/${recordId}`); } catch (error) { logToConsole(`Eroare fetchSingleRecord ${tableId}/${recordId}: ${error.message}`, 'ERROR'); throw error; }
        }
        async function updateRecord(tableId, recordId, fields) { /* ... */
            try { return await apiCall(`https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${tableId}/${recordId}`, 'PATCH', { fields }); } catch (error) { logToConsole(`Eroare updateRecord ${tableId}/${recordId}: ${error.message}`, 'ERROR'); throw error; }
        }

        // --- Utility Functions ---
        // *** REMOVED getActivitiesFilterFormula() ***
        const formatISODate = (dateString) => dateString ? new Date(new Date(dateString).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
        const formatDisplayDate = (dateString) => dateString ? new Date(dateString).toLocaleString('ro-RO') : 'N/A';
        function openModal(modal) { if (modal) modal.classList.add('visible'); }
        function closeModal(modal) { if (modal) modal.classList.remove('visible'); }


        // --- Data Loading and Initialization (MODIFIED FOR Parallel Load) ---
        async function reloadData(fullReload = false) {
             logToConsole(`reloadData: Start (fullReload: ${fullReload})`);
             // --- Progress Bar Simulation ---
             let simulatedProgress = 0;
             if (progressInterval) clearInterval(progressInterval); // Clear any previous interval
             progressBar.style.width = '0%';
             progressPercentageSpan.textContent = '0%';
             progressBarContainer.style.display = 'block';
             progressPercentageSpan.style.display = 'block';

             progressInterval = setInterval(() => {
                 simulatedProgress += 4; // *** MODIFIED: Increment by 4% to reach 100% in 25 seconds ***
                 if (simulatedProgress > 100) simulatedProgress = 100;
                 progressBar.style.width = `${simulatedProgress}%`;
                 progressPercentageSpan.textContent = `${Math.round(simulatedProgress)}%`;
                 if (simulatedProgress >= 100) { // Use >= 100
                     clearInterval(progressInterval);
                     progressInterval = null;
                     logToConsole('Simulated progress reached 100%');
                 }
             }, 1000); // Update every 1 second (1000ms)


            // Reset state
            allActivities = [];
            currentFilteredActivities = [];
            currentDisplayedActivities = [];
            currentPage = 1;
            isLoadingMore = false;
            
            if (fullReload) { // Only clear linked data on full reload
                logToConsole('Full reload: Clearing Offers and Contracts.');
                allOffersData.clear();
                allContractsData.clear();
                areLinkedDataReady = false; // Reset linked data status
            }
            
            areActivityFiltersReady = false; // Always reset activities status
            Object.values(choicesInstances).forEach(instance => { try { instance?.destroy(); } catch(e){ console.warn("Error destroying choice instance:", e)} });
            choicesInstances = {};

            // Reset UI (keep spinner elements, text updated)
            tableBody.innerHTML = '';
            loadingDiv.style.display = 'flex';
            const loadingTextElement = loadingDiv.querySelector('p') || document.createElement('p');
            loadingTextElement.textContent = 'Se încarcă datele...'; // Static loading text
             if (!loadingDiv.querySelector('p')) loadingDiv.appendChild(loadingTextElement);
             if(!loadingDiv.querySelector('.spinner')) { const spinner = document.createElement('div'); spinner.className = 'spinner'; loadingDiv.prepend(spinner); }


            tableContainer.style.display = 'none';
            backgroundLoadInfo.textContent = '';
            totalRecordsInfo.textContent = '';
            totalOreSumSpan.textContent = 'Total Ore: 0';
            totalKMSumSpan.textContent = 'Total KM: 0';
            readyNotification.style.display = 'none';

            // Disable all filters initially
            setFilterLoadingState(true);
            approvalSourceSelect.disabled = true;
            activitySourceSelectDisapproval.disabled = true;

            // --- Added outer try...finally to ensure progress interval is always cleared ---
            try {
                // *** MODIFIED: Determine which view to use ***
                const activityView = showHolidays ? VIEW_ID_TOATE : VIEW_ID_FARA_CO;
                logToConsole(`Using Activity View: ${activityView} (showHolidays: ${showHolidays})`);

                let fetchPromises = [
                    // Always fetch activities
                    fetchRecords(ID_TABEL_ACTIVITATI, { view: activityView }).catch(e => { logToConsole(`Eroare încărcare activități: ${e.message}`, 'ERROR'); return []; })
                ];

                // *** MODIFIED: Only fetch Offers/Contracts on fullReload ***
                if (fullReload) {
                    logToConsole('Full reload: Fetching Offers and Contracts in parallel.');
                    fetchPromises.push(
                        fetchRecords(ID_TABEL_OFERTE).catch(e => { logToConsole(`Eroare încărcare oferte: ${e.message}`, 'ERROR'); return []; }),
                        fetchRecords(ID_TABEL_CONTRACTE).catch(e => { logToConsole(`Eroare încărcare contracte: ${e.message}`, 'ERROR'); return []; })
                    );
                } else {
                    logToConsole('Toggle reload: Skipping Offers and Contracts.');
                }

                logToConsole('Starting Promise.all to fetch data...');
                const results = await Promise.all(fetchPromises);
                logToConsole('Promise.all finished.');


                // --- Stop Progress Bar ---
                 if (progressInterval) clearInterval(progressInterval);
                 progressInterval = null;
                 // Set to 100% visually even if interval was cleared early by fast loading
                 progressBar.style.width = '100%';
                 progressPercentageSpan.textContent = '100%';
                 // Hide progress shortly after completion
                setTimeout(() => {
                    progressBarContainer.style.display = 'none';
                    progressPercentageSpan.style.display = 'none';
                }, 500);


                // Process Activities (always at index 0)
                logToConsole('Processing activities...');
                allActivities = results[0]; // Activities are always the first promise
                logToConsole(`reloadData: Loaded ${allActivities.length} activities.`);
                areActivityFiltersReady = true;

                // Process Offers and Contracts (only if fullReload was true)
                if (fullReload) {
                    logToConsole('Processing offers...');
                    const oferteResult = results[1];
                    allOffersData.clear(); // Ensure map is clear before populating
                    oferteResult.forEach(o => allOffersData.set(o.id, o.fields));
                    logToConsole(`reloadData: Loaded ${allOffersData.size} offers.`);

                    logToConsole('Processing contracts...');
                    const contracteResult = results[2];
                    allContractsData.clear(); // Ensure map is clear before populating
                    contracteResult.forEach(c => allContractsData.set(c.id, c.fields));
                    logToConsole(`reloadData: Loaded ${allContractsData.size} contracts.`);
                    
                    areLinkedDataReady = true;
                }

                 // --- Populate ALL Filters ---
                 logToConsole('Populating filters...');
                populateFilters(allActivities); // Populates Activity filters
                if (areLinkedDataReady) { // If linked data is ready (from this load or previous)
                    populateContractFilters(allContractsData); // Populates Contract filters
                }
                logToConsole('Finished populating filters.');

                // Preselect year
                 logToConsole('Preselecting year...');
                const currentYear = new Date().getFullYear().toString();
                if (choicesInstances.yearFilter && filters.year && Array.from(filters.year.options).some(opt => opt.value === currentYear)) {
                    choicesInstances.yearFilter.setValue([currentYear]); // Use Choices API
                    logToConsole(`Preselected current year: ${currentYear}`);
                } else if(filters.year && Array.from(filters.year.options).some(opt => opt.value === currentYear)) {
                     // Fallback if Choices instance not ready (shouldn't happen often)
                     filters.year.value = currentYear;
                     logToConsole(`Preselected current year (fallback): ${currentYear}`);
                 } else {
                     logToConsole(`Current year ${currentYear} not found in filter options.`);
                 }

                // --- Enable ALL Filters ---
                 logToConsole('Enabling filters...');
                // Enable initial filters
                setFilterLoadingState(false, ['projectFilter', 'nameFilter', 'yearFilter', 'quarterFilter', 'monthFilter', 'dateRangeFilter']);
                if (areLinkedDataReady) { // Enable contract filters if data is ready
                    setFilterLoadingState(false, ['contractProjectFilter', 'contractActivityFilter', 'contractMonthYearFilter']);
                    approvalSourceSelect.disabled = false;
                    activitySourceSelectDisapproval.disabled = false;
                }
                logToConsole('reloadData: Filters enabled.');

                // --- Render Table ---
                 logToConsole('Applying filters and rendering table...');
                 applyFilters(); // Apply filters immediately after loading and enabling
                 logToConsole('Finished applying filters and rendering table.');


                // --- Show Table, Hide Spinner ---
                logToConsole('Hiding loading indicators and showing table...');
                loadingDiv.style.display = 'none';
                tableContainer.style.display = 'block';
                backgroundLoadInfo.textContent = areLinkedDataReady ? 'Toate datele sunt încărcate.' : 'Activități încărcate.';
                logToConsole('Table shown.');

                // Show ready notification (only if all data is ready)
                if(areLinkedDataReady) {
                    readyNotification.querySelector('p').textContent = 'Toate datele sunt încărcate. Filtrarea este completă.';
                    readyNotification.style.display = 'block';
                    setTimeout(() => { window.addEventListener('click', hideNotificationOnClick, { once: true, capture: true }); }, 0);
                }

            } catch(error) { // Catch errors from Promise.all or subsequent processing
                 logToConsole(`reloadData: Critical data loading error inside main try block: ${error.message}\n${error.stack}`, 'ERROR');
                 loadingTextElement.textContent = `EROARE LA ÎNCĂRCAREA DATELOR: ${error.message}`;
                 loadingDiv.querySelector('.spinner')?.remove();
                 tableContainer.style.display = 'none';
                 backgroundLoadInfo.textContent = 'Eroare critică.';
                 setFilterLoadingState(true); // Keep filters disabled
                 approvalSourceSelect.disabled = true;
                 activitySourceSelectDisapproval.disabled = true;
            } finally {
                // --- Ensure Progress Bar Stops ---
                logToConsole('Finally block reached, clearing progress interval if active.');
                if (progressInterval) {
                    clearInterval(progressInterval);
                    progressInterval = null;
                }
                 // Ensure spinner/progress bar is hidden if loading succeeded but maybe an error happened later
                 if(areActivityFiltersReady) { // Only hide if activity data (at least) loaded
                    loadingDiv.style.display = 'none';
                    progressBarContainer.style.display = 'none';
                    progressPercentageSpan.style.display = 'none';
                 }
            }
        }


        async function initializeApp() {
            logToConsole('initializeApp: Start');
            setupFilterEventListeners();
            setFilterLoadingState(true); // Disable all filters initially
            await reloadData(true); // Load all data (parallel)
            logToConsole('initializeApp: Finished.');
        }

        function hideNotificationOnClick(event) { /* ... unchanged ... */
             if (readyNotification.style.display === 'block') { readyNotification.style.display = 'none'; window.removeEventListener('click', hideNotificationOnClick, true); }
        }

        // --- Background Data Loading function (REMOVED) ---

        // --- Table Rendering (MODIFIED - for infinite scroll) ---
        function renderTable(activities, isFreshRender = false) {
             logToConsole(`renderTable: Rendering ${activities.length} records. Fresh render: ${isFreshRender}`);
             // Clear table body only if it's a fresh render (e.g., after filtering)
             if (isFreshRender) {
                 tableBody.innerHTML = '';
             }

             if (activities.length === 0 && isFreshRender) {
                 tableBody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 20px;">Nicio activitate găsită.</td></tr>'; // *** MODIFIED: Colspan 11 ***
             } else if (activities.length === 0 && !isFreshRender) {
                  logToConsole('renderTable: No more records to append.');
             } else {
                 // Append new rows
                 activities.forEach(record => {
                     const f = record.fields;
                     const tr = document.createElement('tr');
                     tr.dataset.recordId = record.id;
                     const tdAprobat = tr.insertCell();
                     tdAprobat.style.textAlign = 'center';
                     const approveBtn = document.createElement('button');
                     approveBtn.className = 'icon-btn approve-btn';
                     const isApproved = f[FIELDS.APROBAT] === true;
                     const hasRejectionReason = f[FIELDS.MOTIV_REFUZ] && f[FIELDS.MOTIV_REFUZ].trim() !== '';
                     let status = 'pending';
                     if (isApproved) { approveBtn.classList.add('approved'); approveBtn.innerHTML = '✔'; approveBtn.title = 'Aprobat'; status = 'approved'; }
                     else if (hasRejectionReason || f[FIELDS.APROBAT] === false) { approveBtn.classList.add('rejected'); approveBtn.innerHTML = '❌'; approveBtn.title = `Refuzat: ${f[FIELDS.MOTIV_REFUZ] || 'Nespecificat'}`; status = 'rejected'; }
                     else { approveBtn.classList.add('pending'); approveBtn.innerHTML = '🔔'; approveBtn.title = 'Așteaptă aprobare'; }
                     approveBtn.dataset.status = status;
                     tdAprobat.appendChild(approveBtn);
                     const tdEdit = tr.insertCell();
                     tdEdit.style.textAlign = 'center';
                     const editBtn = document.createElement('button');
                     editBtn.className = 'icon-btn edit-btn'; editBtn.innerHTML = '✎'; editBtn.title = 'Editează';
                     tdEdit.appendChild(editBtn);
                     tr.insertCell().textContent = f[FIELDS.NUME] || 'N/A';
                     tr.insertCell().textContent = f[FIELDS.PROIECT] || 'N/A';
                     tr.insertCell().textContent = f[FIELDS.ACTIVITATE] || 'N/A';
                     tr.insertCell().textContent = f[FIELDS.START] ? new Date(f[FIELDS.START]).toLocaleString('ro-RO') : 'N/A';
                     tr.insertCell().textContent = f[FIELDS.STOP] ? new Date(f[FIELDS.STOP]).toLocaleString('ro-RO') : 'N/A';
                     tr.insertCell().textContent = f[FIELDS.CREAT_LA] ? new Date(f[FIELDS.CREAT_LA]).toLocaleString('ro-RO') : 'N/A';
                     const oreValue = parseFloat(f[FIELDS.ORE]) || 0;
                     tr.insertCell().textContent = oreValue;
                     // Do not sum here, sum in updateFooterCalculations
                     const kmValue = parseFloat(f[FIELDS.KM]) || 0;
                     tr.insertCell().textContent = kmValue;
                     // *** NEW CELL ***
                     tr.insertCell().textContent = f[FIELDS.DESCRIERE_ACTIVITATE] || '';
                     // Do not sum here, sum in updateFooterCalculations

                     // *** Added Logs to Event Listeners ***
                     approveBtn.addEventListener('click', async () => { 
                         logToConsole(`Approve button clicked for record: ${record.id}`); 
                         const currentStatus = approveBtn.dataset.status; 
                         const recordId = record.id; 
                         const currentRecordData = allActivities.find(r => r.id === recordId)?.fields; 
                         if (currentStatus === 'pending') { 
                             logToConsole(`Status is pending, calling openApprovalModal...`); 
                             openApprovalModal(recordId); 
                         } else if (currentRecordData) { 
                             // *** MODIFIED: Call openPostApprovalEditModal instead of read-only ***
                             logToConsole(`Record data found locally, calling openPostApprovalEditModal...`); 
                             await openPostApprovalEditModal(recordId, currentRecordData, currentRecordData, false); // false = editable
                         } else { 
                             logToConsole(`Fallback: Fetching single record ${recordId} for edit view.`, 'WARN'); 
                             try { 
                                 const fetchedRecord = await fetchSingleRecord(ID_TABEL_ACTIVITATI, recordId); 
                                 if (fetchedRecord && fetchedRecord.fields) { 
                                     await openPostApprovalEditModal(recordId, fetchedRecord.fields, fetchedRecord.fields, false); // false = editable
                                 } else { 
                                     alert(`Eroare: Nu s-au putut încărca detaliile pentru ${recordId}`); 
                                 } 
                             } catch (error) { 
                                 alert(`Eroare la încărcarea detaliilor: ${error.message}`); 
                             } 
                         } 
                     });
                     editBtn.addEventListener('click', async () => { 
                         logToConsole(`Edit button clicked for record: ${record.id}`); 
                         const recordId = record.id; 
                         const currentRecordData = allActivities.find(r => r.id === recordId)?.fields; 
                         if (currentRecordData) { 
                             logToConsole(`Record data found locally, calling openPostApprovalEditModal...`); 
                             await openPostApprovalEditModal(recordId, currentRecordData, currentRecordData, false); // false = editable
                         } else { 
                             logToConsole(`Fallback: Fetching single record ${recordId} for editing.`, 'WARN'); 
                             try { 
                                 const fetchedRecord = await fetchSingleRecord(ID_TABEL_ACTIVITATI, recordId); 
                                 if (fetchedRecord && fetchedRecord.fields) { 
                                     await openPostApprovalEditModal(recordId, fetchedRecord.fields, fetchedRecord.fields, false); // false = editable
                                 } else { 
                                     alert(`Eroare: Nu s-au putut încărca detaliile pentru editare ${recordId}`); 
                                 } 
                             } catch (error) { 
                                 alert(`Eroare la încărcarea detaliilor pentru editare: ${error.message}`); 
                             } 
                         } 
                     });
                     tableBody.appendChild(tr);
                 });
             }
             // *** MOVED footer calculation to a separate function ***
             updateFooterCalculations();
         }

        // --- NEW Function: Update Footer Calculations ---
        function updateFooterCalculations() {
            logToConsole('Updating footer calculations based on displayed records.');
            let currentTotalOre = 0;
            let currentTotalKM = 0;

            // Calculate sums based on ALL *displayed* activities
            currentDisplayedActivities.forEach(record => {
                const f = record.fields;
                currentTotalOre += (parseFloat(f[FIELDS.ORE]) || 0);
                currentTotalKM += (parseFloat(f[FIELDS.KM]) || 0);
            });

            // Update footer text
            // Show displayed count vs filtered count
            document.getElementById('records-count-info').textContent = `Afișare: ${currentDisplayedActivities.length} din ${currentFilteredActivities.length} înregistrări`;
            totalRecordsInfo.textContent = `| Total: ${allActivities.length} disponibile`;
            totalOreSumSpan.textContent = `Total Ore: ${currentTotalOre.toFixed(2)}`;
            totalKMSumSpan.textContent = `Total KM: ${currentTotalKM.toFixed(2)}`;
        }


        // --- Update/Save Handlers (MODIFIED: Add new source field logic) ---
        async function handleAutoSave(recordId, tr, fieldsToUpdate) { /* ... unchanged ... */ }
        
        async function handleSaveFromModal() {
            logToConsole(`handleSaveFromModal: Saving changes for record ${modals.edit.dataset.recordId}`);
            const recordId = modals.edit.dataset.recordId;
            if (!recordId) {
                logToConsole('Save failed: No recordId found on modal.', 'ERROR');
                return;
            }
            
            const originalRecord = allActivities.find(r => r.id === recordId)?.fields || {};
            const selectedSource = document.getElementById('editActivitySource').value;

            const fieldsToUpdate = {
                [FIELDS.NUME]: document.getElementById('editNume').value,
                [FIELDS.PROIECT]: document.getElementById('editProiect').value,
                [FIELDS.ACTIVITATE]: document.getElementById('editActivitate').value,
                [FIELDS.START]: document.getElementById('editStart').value ? new Date(document.getElementById('editStart').value).toISOString() : null,
                [FIELDS.STOP]: document.getElementById('editStop').value ? new Date(document.getElementById('editStop').value).toISOString() : null,
                // [FIELDS.KM]: document.getElementById('editKM').value, // Add KM field if/when it's added to modal
            };

            // Handle the new source logic
            if (selectedSource === 'Proces ofertare') {
                fieldsToUpdate[FIELDS.OFERTA_LINK] = [];
                fieldsToUpdate[FIELDS.CONTRACT_LINK] = [];
            } else if (selectedSource === 'Oferta') {
                // Keep existing offer links (if any), clear contract links
                fieldsToUpdate[FIELDS.OFERTA_LINK] = originalRecord[FIELDS.OFERTA_LINK] || []; // Preserve
                fieldsToUpdate[FIELDS.CONTRACT_LINK] = []; // Clear
            } else if (selectedSource === 'Contract') {
                // Keep existing contract links (if any), clear offer links
                fieldsToUpdate[FIELDS.OFERTA_LINK] = []; // Clear
                fieldsToUpdate[FIELDS.CONTRACT_LINK] = originalRecord[FIELDS.CONTRACT_LINK] || []; // Preserve
            }
            // If source is empty, don't change the links

            logToConsole('Fields to update:', 'DEBUG');
            logToConsole(JSON.stringify(fieldsToUpdate), 'DEBUG');

             try {
                 const result = await updateRecord(ID_TABEL_ACTIVITATI, recordId, fieldsToUpdate);
                 closeModal(modals.edit);
                
                // --- UPDATE LOCAL DATA (allActivities) ---
                const activityIndexAll = allActivities.findIndex(a => a.id === recordId);
                if (activityIndexAll > -1) {
                    allActivities[activityIndexAll].fields = { ...allActivities[activityIndexAll].fields, ...result.fields };
                    logToConsole('Local data updated.');
                }
                 // --- RE-RENDER & REPOPULATE ---
                 applyFilters(); // Re-apply filters (re-renders and recalculates sums)
                 // No need to repopulate filters unless the edited values are new
                 // populateFilters(allActivities); 
                 // if(areLinkedDataReady) populateContractFilters(allContractsData);

             } catch (error) {
                  logToConsole(`handleSaveFromModal: ${error.message}`, 'ERROR');
                  alert('Eroare la salvarea modificărilor.');
             }
         }

        // --- NEW Function: Handle Table Scroll ---
        function handleTableScroll(event) {
            const target = event.target;
            // Check if near bottom (e.g., within 100px)
            const isNearBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

            if (isNearBottom && !isLoadingMore && currentDisplayedActivities.length < currentFilteredActivities.length) {
                logToConsole('Scroll near bottom, loading more records...');
                isLoadingMore = true; // Set lock
                // Use setTimeout to allow UI to update before loading
                setTimeout(loadMoreActivities, 50);
            }
        }

        // --- NEW Function: Load More Activities ---
        function loadMoreActivities() {
            logToConsole(`Loading page ${currentPage + 1}...`);
            currentPage++;
            const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
            const endIndex = currentPage * RECORDS_PER_PAGE;

            const nextRecords = currentFilteredActivities.slice(startIndex, endIndex);

            if (nextRecords.length > 0) {
                logToConsole(`Appending ${nextRecords.length} new records.`);
                currentDisplayedActivities = [...currentDisplayedActivities, ...nextRecords];
                renderTable(nextRecords, false); // false = append
            } else {
                 logToConsole('No more records to load.');
            }

            isLoadingMore = false; // Release lock
        }


        // --- Event Listeners and Setup (MODIFIED FOR SCROLL) ---
        function setupFilterEventListeners() {
            logToConsole('setupFilterEventListeners: Configuring filter events.');
            dateRangePicker = flatpickr(filters.dateRange, { mode: 'range', dateFormat: 'd.m.Y', onChange: applyFilters, locale: 'ro' });

            // Attach change listeners for Choices.js instances (and native selects)
            [
                filters.year, filters.quarter, filters.month, // *** ADDED MONTH ***
                filters.project, filters.name,
                filters.contractProject, filters.contractActivity, filters.contractMonthYear
            ].forEach(el => {
                if (el) el.addEventListener('change', applyFilters); // Add safety check
            });


            filters.resetBtn.addEventListener('click', () => {
                logToConsole('Reset button clicked.');
                // Clear native selects and date picker
                if (filters.quarter) filters.quarter.value = '';
                if (filters.month) filters.month.value = ''; // *** ADDED MONTH ***
                if (dateRangePicker) dateRangePicker.clear();

                // Clear Choices.js instances
                Object.keys(choicesInstances).forEach(key => {
                    const instance = choicesInstances[key];
                    if (instance) {
                        try {
                            instance.clearStore().clearInput().setValue([]); // Clear selection and search input
                            logToConsole(`Choices instance cleared for: ${key}`);
                         } catch (error) {
                            logToConsole(`Error clearing Choices instance for ${key}: ${error}`, 'ERROR');
                        }
                    }
                });

                 // Re-select current year
                const currentYear = new Date().getFullYear().toString();
                 if (choicesInstances.yearFilter && filters.year && Array.from(filters.year.options).some(opt => opt.value === currentYear)) {
                     choicesInstances.yearFilter.setValue([currentYear]);
                     logToConsole(`Re-selected current year in Choices: ${currentYear}`);
                 } else if (filters.year && Array.from(filters.year.options).some(opt => opt.value === currentYear)){
                    filters.year.value = currentYear; // Fallback
                    logToConsole(`Re-selected current year (fallback): ${currentYear}`);
                 }


                applyFilters(); // Apply reset filters
            });

            filters.toggleHolidaysBtn.addEventListener('click', () => { 
                showHolidays = !showHolidays; 
                filters.toggleHolidaysBtn.textContent = showHolidays ? 'Ascunde concedii' : 'Arata concedii'; 
                reloadData(false); // *** MODIFIED: false = only reload activities, keep contracts/offers ***
            });
            filters.refreshDataBtn.addEventListener('click', () => { reloadData(true); }); // true = full reload
            filters.header.addEventListener('click', () => { filters.collapsible.classList.toggle('open'); filters.header.classList.toggle('open'); });

             // --- Add Scroll Listener ---
             if (tableContainer) {
                 tableContainer.addEventListener('scroll', handleTableScroll);
                 logToConsole('Scroll event listener added to table container.');
             } else {
                 logToConsole('Error: Table container not found for scroll listener.', 'ERROR');
             }

             // Notification OK button (unchanged)
             document.getElementById('readyNotificationOkBtn').addEventListener('click', () => { readyNotification.style.display = 'none'; });
        
             // *** RE-ADDED ALL MODAL EVENT LISTENERS ***

             // --- Approval Modal: Radio Buttons ---
             approvalDecisionRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    logToConsole(`Approval decision changed to: ${radio.value}`);
                    const decision = radio.value;
                    let isButtonDisabled = true; // Start as disabled

                    if (decision === 'yes') {
                        approvalActionGroup.style.display = 'block';
                        disapprovalFieldsGroup.style.display = 'none';
                        
                        const selectedSource = approvalSourceSelect.value;
                        // *** MODIFIED: Check length of selected IDs ***
                        const offerSelected = (modals.approval.dataset.selectedOfferIds || "").split(',').filter(Boolean).length > 0;
                        const contractSelected = (modals.approval.dataset.selectedContractIds || "").split(',').filter(Boolean).length > 0;

                        if (selectedSource === "Proces ofertare" || (selectedSource === "Oferta" && offerSelected) || (selectedSource === "Contract" && contractSelected)) {
                             isButtonDisabled = false;
                        }
                        
                        confirmApprovalBtn.textContent = 'Confirmă Aprobare';
                        confirmApprovalBtn.classList.remove('btn-rejection');
                        confirmApprovalBtn.classList.add('btn-save');

                    } else if (decision === 'no') {
                        approvalActionGroup.style.display = 'none';
                        disapprovalFieldsGroup.style.display = 'block';
                        isButtonDisabled = false; // Enable for rejection (reason is optional)
                        confirmApprovalBtn.textContent = 'Confirmă Refuz';
                        confirmApprovalBtn.classList.add('btn-rejection');
                        confirmApprovalBtn.classList.remove('btn-save');
                    }
                    confirmApprovalBtn.disabled = isButtonDisabled;
                });
            });
            
            // --- Approval Modal: Source Select (Case: YES) ---
            approvalSourceSelect.addEventListener('change', () => {
                const source = approvalSourceSelect.value;
                logToConsole(`Approval source changed to: ${source}`);
                offerSelectionInApproval.style.display = 'none';
                contractSelectionInApproval.style.display = 'none';
                // selectionInfoDiv.textContent = ''; // Don't clear text if we are re-rendering
                // modals.approval.dataset.selectedOfferIds = ''; // Don't clear selection on source change? Or do? Resetting.
                // modals.approval.dataset.selectedContractIds = '';
                
                // *** Retrieve current selections ***
                let currentOfferIds = (modals.approval.dataset.selectedOfferIds || "").split(',').filter(Boolean);
                let currentContractIds = (modals.approval.dataset.selectedContractIds || "").split(',').filter(Boolean);


                if (source === 'Oferta') {
                    offerSelectionInApproval.style.display = 'block';
                    renderOfferList(offerListInApprovalContainer, allOffersData, currentOfferIds, offerSearchInApprovalInput.value);
                } else if (source === 'Contract') {
                    contractSelectionInApproval.style.display = 'block';
                    // Populate contract modal filters if not already done (should be ready)
                    if(contractModalProjectFilter.options.length <= 1 && areLinkedDataReady) {
                        const contracts = Array.from(allContractsData.values());
                        const projects = [...new Set(contracts.map(c => c['Proiect']).filter(Boolean))].sort();
                        const prestatori = [...new Set(contracts.map(c => c['Prestator']).filter(Boolean))].sort();
                        const monthYears = [...new Set(contracts.map(c => c['Luna si an']).filter(Boolean))].sort();
                        populateSelect(contractModalProjectFilter, projects, "Toate Proiectele");
                        populateSelect(contractModalPrestatorFilter, prestatori, "Toți Prestatorii");
                        populateSelect(contractModalMonthYearFilter, monthYears, "Toate Perioadele");
                    }
                    renderContractList(contractListInApprovalContainer, allContractsData, currentContractIds, contractSearchInApprovalInput.value, contractModalProjectFilter.value, contractModalPrestatorFilter.value, contractModalMonthYearFilter.value);
                }
                
                // *** Re-check button state based on source and existing selection ***
                const offerSelected = currentOfferIds.length > 0;
                const contractSelected = currentContractIds.length > 0;
                if (source === 'Proces ofertare' || (source === "Oferta" && offerSelected) || (source === "Contract" && contractSelected)) {
                    confirmApprovalBtn.disabled = false;
                } else {
                    confirmApprovalBtn.disabled = true;
                }
                 // *** Update selection info text ***
                 if (source === 'Oferta') {
                    selectionInfoDiv.textContent = `${currentOfferIds.length} ofertă(e) selectată(e).`;
                 } else if (source === 'Contract') {
                    selectionInfoDiv.textContent = `${currentContractIds.length} contract(e) selectat(e).`;
                 } else {
                     selectionInfoDiv.textContent = '';
                 }

            });
            
            // --- Approval Modal: Source Select (Case: NO) ---
             activitySourceSelectDisapproval.addEventListener('change', () => {
                const source = activitySourceSelectDisapproval.value;
                logToConsole(`Disapproval source changed to: ${source}`);
                modals.approval.dataset.selectedOfferIdsDisapproval = '';
                modals.approval.dataset.selectedContractIdsDisapproval = '';

                if (source === 'Oferta' || source === 'Contract') {
                    openSelectionOverlay(source); // Open secondary modal for selection
                } else {
                    disapprovalSelectionInfoDiv.textContent = 'Sursa a fost setată ca "Proces ofertare" (sau goală).';
                }
             });


            // --- Approval Modal: Search & Filters (Case: YES) ---
             offerSearchInApprovalInput.addEventListener('input', () => {
                renderOfferList(offerListInApprovalContainer, allOffersData, (modals.approval.dataset.selectedOfferIds || "").split(','), offerSearchInApprovalInput.value);
             });
             [contractSearchInApprovalInput, contractModalProjectFilter, contractModalPrestatorFilter, contractModalMonthYearFilter].forEach(el => {
                el.addEventListener('input', () => { // Use 'input' for text, 'change' for select - 'input' works for both in this context
                     renderContractList(contractListInApprovalContainer, allContractsData, (modals.approval.dataset.selectedContractIds || "").split(','), contractSearchInApprovalInput.value, contractModalProjectFilter.value, contractModalPrestatorFilter.value, contractModalMonthYearFilter.value);
                });
             });

            // --- Approval Modal: List Clicks (Case: YES) ---
            // *** MODIFIED FOR MULTI-SELECT ***
            offerListInApprovalContainer.addEventListener('click', e => {
                const item = e.target.closest('.offer-list-item');
                if (!item) return;
                const recordId = item.dataset.recordId;
                
                let currentIds = (modals.approval.dataset.selectedOfferIds || "").split(',').filter(Boolean);
                const index = currentIds.indexOf(recordId);
                if (index > -1) {
                    currentIds.splice(index, 1); // Remove if exists
                } else {
                    currentIds.push(recordId); // Add if not exists
                }
                modals.approval.dataset.selectedOfferIds = currentIds.join(',');

                renderOfferList(offerListInApprovalContainer, allOffersData, currentIds, offerSearchInApprovalInput.value); // Re-render to show selection
                
                if (currentIds.length > 0) {
                    selectionInfoDiv.textContent = `${currentIds.length} ofertă(e) selectată(e).`;
                    confirmApprovalBtn.disabled = false;
                } else {
                    selectionInfoDiv.textContent = 'Nicio ofertă selectată.';
                    confirmApprovalBtn.disabled = true;
                }
            });
            // *** MODIFIED FOR MULTI-SELECT ***
            contractListInApprovalContainer.addEventListener('click', e => {
                 const item = e.target.closest('.contract-list-item');
                 if (!item) return;
                 const recordId = item.dataset.recordId;

                let currentIds = (modals.approval.dataset.selectedContractIds || "").split(',').filter(Boolean);
                const index = currentIds.indexOf(recordId);
                if (index > -1) {
                    currentIds.splice(index, 1); // Remove if exists
                } else {
                    currentIds.push(recordId); // Add if not exists
                }
                modals.approval.dataset.selectedContractIds = currentIds.join(',');

                 renderContractList(contractListInApprovalContainer, allContractsData, currentIds, contractSearchInApprovalInput.value, contractModalProjectFilter.value, contractModalPrestatorFilter.value, contractModalMonthYearFilter.value);
                 
                if (currentIds.length > 0) {
                    selectionInfoDiv.textContent = `${currentIds.length} contract(e) selectat(e).`;
                    confirmApprovalBtn.disabled = false;
                } else {
                    selectionInfoDiv.textContent = 'Niciun contract selectat.';
                    confirmApprovalBtn.disabled = true;
                }
            });


            // --- Secondary Selection Modal (Case: NO) ---
            selectionOverlaySourceSelect.addEventListener('change', () => {
                 const source = selectionOverlaySourceSelect.value;
                 logToConsole(`Selection overlay source changed to: ${source}`);
                 temporarySelectedIds = []; // Clear temporary selection
                 if(source === 'Oferta') {
                     selectionOverlayOfferSection.style.display = 'flex';
                     selectionOverlayContractSection.style.display = 'none';
                     renderSelectionOverlayOfferList();
                 } else {
                     selectionOverlayOfferSection.style.display = 'none';
                     selectionOverlayContractSection.style.display = 'flex';
                     renderSelectionOverlayContractList();
                 }
            });
            
            // Search/Filter listeners for secondary modal
            selectionOverlayOfferSearch.addEventListener('input', renderSelectionOverlayOfferList);
            [selectionOverlayContractSearch, selectionOverlayContractProjectFilter, selectionOverlayContractPrestatorFilter, selectionOverlayContractMonthYearFilter].forEach(el => {
                el.addEventListener('input', renderSelectionOverlayContractList);
            });

            // Click listeners for secondary modal lists (multi-select)
             selectionOverlayOfferListContainer.addEventListener('click', e => {
                const item = e.target.closest('.offer-list-item');
                if (!item) return;
                toggleSelectionOverlayItem(item.dataset.recordId);
                renderSelectionOverlayOfferList();
             });
             selectionOverlayContractListContainer.addEventListener('click', e => {
                 const item = e.target.closest('.contract-list-item');
                 if (!item) return;
                 toggleSelectionOverlayItem(item.dataset.recordId);
                 renderSelectionOverlayContractList();
             });
             
            // Confirm/Cancel for secondary modal
            confirmSelectionOverlayBtn.addEventListener('click', () => {
                 logToConsole('Confirming selection from overlay...');
                 const source = selectionOverlaySourceSelect.value;
                 if (source === 'Oferta') {
                    modals.approval.dataset.selectedOfferIdsDisapproval = temporarySelectedIds.join(',');
                    modals.approval.dataset.selectedContractIdsDisapproval = '';
                    disapprovalSelectionInfoDiv.textContent = `${temporarySelectedIds.length} ofertă(e) selectată(e).`;
                 } else {
                    modals.approval.dataset.selectedOfferIdsDisapproval = '';
                    modals.approval.dataset.selectedContractIdsDisapproval = temporarySelectedIds.join(',');
                    disapprovalSelectionInfoDiv.textContent = `${temporarySelectedIds.length} contract(e) selectat(e).`;
                 }
                 temporarySelectedIds = [];
                 closeModal(modals.selectionOverlay);
            });
            
            if(cancelSelectionOverlayBtn) {
                cancelSelectionOverlayBtn.addEventListener('click', () => {
                    logToConsole('Cancel Selection Overlay button clicked.');
                    temporarySelectedIds = []; // Discard temporary selection
                    closeModal(modals.selectionOverlay);
                });
            } else {
                logToConsole('Error: cancelSelectionOverlayBtn not found.', 'ERROR');
            }


             // --- Main Modal Buttons (Confirm, Cancel, Save, etc.) ---
             // Listener for Approval Modal ("Confirmă")
            confirmApprovalBtn.addEventListener('click', async () => {
                logToConsole('Confirm Approval button clicked.');
                const recordId = modals.approval.dataset.recordId;
                const originalRecordData = allActivities.find(r => r.id === recordId)?.fields || null;
                let updatedRecordFields = null;
                let recordIdToEdit = recordId;
                let savedOriginalData = originalRecordData;

                if (!recordId) { logToConsole('Eroare: recordId lipsește în confirmApprovalBtn.', 'ERROR'); return; }
                if (!savedOriginalData) {
                    logToConsole(`Datele originale pentru ${recordId} nu au fost găsite! Se încearcă re-fetch...`, 'WARN');
                    try {
                        const fetchedRecord = await fetchSingleRecord(ID_TABEL_ACTIVITATI, recordId);
                        if (fetchedRecord && fetchedRecord.fields) { savedOriginalData = fetchedRecord.fields; }
                        else { alert('Eroare critică: Nu s-au putut regăsi datele originale.'); closeModal(modals.approval); applyFilters(); return; }
                    } catch (error) { alert(`Eroare critică: ${error.message}`); closeModal(modals.approval); applyFilters(); return; }
                }

                try {
                    const decisionRadio = document.querySelector('input[name="approvalDecision"]:checked');
                    if (!decisionRadio) return;
                    const decision = decisionRadio.value;
                    const fieldsToUpdate = {};

                    if (decision === 'no') {
                        logToConsole('Decision: No (Reject)');
                        fieldsToUpdate[FIELDS.APROBAT] = false;
                        fieldsToUpdate[FIELDS.MOTIV_REFUZ] = document.getElementById('disapprovalReason').value || 'Nespecificat';
                        fieldsToUpdate[FIELDS.NUME] = document.getElementById('disapprovalNume').value;
                        fieldsToUpdate[FIELDS.PROIECT] = document.getElementById('disapprovalProiect').value;
                        fieldsToUpdate[FIELDS.ACTIVITATE] = document.getElementById('disapprovalActivitate').value;
                        fieldsToUpdate[FIELDS.START] = document.getElementById('disapprovalStart').value ? new Date(document.getElementById('disapprovalStart').value).toISOString() : null;
                        fieldsToUpdate[FIELDS.STOP] = document.getElementById('disapprovalStop').value ? new Date(document.getElementById('disapprovalStop').value).toISOString() : null;

                        const disapprovalSource = activitySourceSelectDisapproval.value;
                        if (disapprovalSource === 'Oferta') {
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = (modals.approval.dataset.selectedOfferIdsDisapproval || "").split(',').filter(Boolean);
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = [];
                        } else if (disapprovalSource === 'Contract') {
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = [];
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = (modals.approval.dataset.selectedContractIdsDisapproval || "").split(',').filter(Boolean);
                        } else {
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = [];
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = [];
                        }
                    } else { // 'yes'
                        logToConsole('Decision: Yes (Approve)');
                        const selectedSource = approvalSourceSelect.value;
                        if (!selectedSource) { alert('Vă rugăm selectați sursa activității.'); return; }
                        fieldsToUpdate[FIELDS.APROBAT] = true;
                        fieldsToUpdate[FIELDS.MOTIV_REFUZ] = null;
                        if (selectedSource === 'Oferta') {
                            const selectedIds = (modals.approval.dataset.selectedOfferIds || "").split(',').filter(Boolean);
                            if (selectedIds.length === 0) { alert('Vă rugăm selectați o ofertă.'); return; }
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = selectedIds;
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = [];
                        } else if (selectedSource === 'Contract') {
                            const selectedIds = (modals.approval.dataset.selectedContractIds || "").split(',').filter(Boolean);
                            if (selectedIds.length === 0) { alert('Vă rugăm selectați un contract.'); return; }
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = [];
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = selectedIds;
                        } else {
                            fieldsToUpdate[FIELDS.OFERTA_LINK] = [];
                            fieldsToUpdate[FIELDS.CONTRACT_LINK] = [];
                        }
                    }

                    fieldsToUpdate[FIELDS.NUME_INIT] = savedOriginalData[FIELDS.NUME];
                    fieldsToUpdate[FIELDS.PROIECT_INIT] = savedOriginalData[FIELDS.PROIECT];
                    fieldsToUpdate[FIELDS.ACTIVITATE_INIT] = savedOriginalData[FIELDS.ACTIVITATE];
                    fieldsToUpdate[FIELDS.START_INIT] = savedOriginalData[FIELDS.START];
                    fieldsToUpdate[FIELDS.STOP_INIT] = savedOriginalData[FIELDS.STOP];

                    const result = await updateRecord(ID_TABEL_ACTIVITATI, recordId, fieldsToUpdate);
                    updatedRecordFields = result.fields;
                    closeModal(modals.approval);
                } catch (error) {
                    logToConsole(`Error in confirmApprovalBtn: ${error.message}`, 'ERROR');
                    alert(`Eroare la confirmare: ${error.message}`);
                    closeModal(modals.approval);
                    applyFilters();
                }

                if (updatedRecordFields) {
                    const activityIndexAll = allActivities.findIndex(a => a.id === recordId);
                    if (activityIndexAll > -1) { allActivities[activityIndexAll].fields = updatedRecordFields; }
                }

                if (recordIdToEdit && savedOriginalData && updatedRecordFields) {
                    await openPostApprovalEditModal(recordIdToEdit, savedOriginalData, updatedRecordFields);
                } else {
                    logToConsole("Lipsesc date pentru modal post-aprobare. Se reîmprospătează tabelul.", "WARN");
                    applyFilters();
                }
            });

            // Listener for Approval Modal ("Anulează")
            cancelApprovalBtn.addEventListener('click', () => {
                logToConsole('Cancel Approval button clicked.');
                closeModal(modals.approval);
                // applyFilters(); // Refresh table to ensure no stale data
            });

            // Listener for Edit Modal ("Salvează")
            document.getElementById('saveEditBtn').addEventListener('click', () => {
                logToConsole('Save Edit button clicked.');
                handleSaveFromModal().catch(err => {
                    logToConsole(`Error in saveEditBtn click handler: ${err.message}`, 'ERROR');
                });
            });

            // Listener for Edit Modal ("Renunță")
            document.getElementById('cancelEditBtn').addEventListener('click', async () => {
                logToConsole('Cancel Edit button clicked.');
                closeModal(modals.edit);
                // if (document.getElementById('saveEditBtn').style.display !== 'none') {
                //     applyFilters();
                // }
            });
            
             // *** ADDED: Listener for Selection Overlay Modal ("Anulează") ***
            if(cancelSelectionOverlayBtn) {
                cancelSelectionOverlayBtn.addEventListener('click', () => {
                    logToConsole('Cancel Selection Overlay button clicked.');
                    temporarySelectedIds = []; // Discard temporary selection
                    closeModal(modals.selectionOverlay);
                });
            } else {
                logToConsole('Error: cancelSelectionOverlayBtn not found.', 'ERROR');
            }


            // Listener for Overlay and 'x' buttons (MODIFIED to only accept 'x' clicks)
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.addEventListener('click', async e => {
                    // *** MODIFIED: Removed 'e.target === modal' condition ***
                    if (e.target.closest('.modal-close-btn')) {
                        logToConsole(`Modal close clicked ('x') for: ${modal.id}`);
                        
                        // Check if we are closing a modal that might be stacked
                        if (modal.id === 'selectionOverlayModal') {
                             closeModal(modals.selectionOverlay);
                        } else if (modal.id === 'pdfViewerModal') {
                             // closeModal(modals.pdf); // PDF Modal removed
                        } else if (modal.id === 'editRecordModal') {
                             closeModal(modals.edit);
                        } else if (modal.id === 'approvalConfirmationModal') {
                             closeModal(modals.approval);
                        } else {
                            closeModal(modal); // Default case
                        }
                    }
                });
            });
        
        }

        // --- Filter UI State (MODIFIED FOR CHOICES.JS) ---
        function setFilterLoadingState(isLoading, filterIds = []) { // Keep filterIds parameter
             logToConsole(`Setting filter loading state: ${isLoading}. Filters: ${filterIds.length > 0 ? filterIds.join(', ') : 'ALL'}`);
             let elementsToUpdate = [];
             const allPossibleFilterIds = ['dateRangeFilter', 'yearFilter', 'quarterFilter', 'monthFilter', 'projectFilter', 'nameFilter', 'contractProjectFilter', 'contractActivityFilter', 'contractMonthYearFilter']; // *** ADDED MONTH ***

             if (filterIds.length === 0) { // If no specific IDs, update all
                 elementsToUpdate = allPossibleFilterIds.map(id => document.getElementById(id)).filter(el => el);
             } else { // Update only specified IDs
                 elementsToUpdate = filterIds.map(id => document.getElementById(id)).filter(el => el);
             }

             elementsToUpdate.forEach(element => {
                 if (!element) return;
                  if (element.id === 'dateRangeFilter' && dateRangePicker) {
                     if (isLoading) { dateRangePicker.input.setAttribute('disabled', 'disabled'); dateRangePicker.input.style.backgroundColor = '#e9ecef'; dateRangePicker.input.style.cursor = 'not-allowed'; }
                     else { dateRangePicker.input.removeAttribute('disabled'); dateRangePicker.input.style.backgroundColor = ''; dateRangePicker.input.style.cursor = ''; }
                  } else if (element.tagName === 'SELECT') {
                     // Handle Choices.js instance if exists for this select
                     const choicesInstance = choicesInstances[element.id];
                     if (choicesInstance) {
                         try {
                             if (isLoading) {
                                 choicesInstance.clearStore().clearInput(); // Clear input/selection
                                 choicesInstance.setChoices([{ value: '', label: 'Se încarcă...', disabled: true }], 'value', 'label', true); // Show loading placeholder
                                 choicesInstance.disable();
                             } else {
                                 choicesInstance.enable();
                                 // Options will be repopulated by populateSelect, removing the loading placeholder
                             }
                         } catch (error) {
                             logToConsole(`Error setting loading state for Choices instance ${element.id}: ${error}`, 'ERROR');
                         }
                     } else { // Handle native select (like Quarter or if Choices failed)
                         element.disabled = isLoading;
                         if (isLoading && element.id !== 'quarterFilter' && element.id !== 'monthFilter') { // Don't overwrite static Quarter/Month options
                             if (!element.querySelector('option[value="loading"]')) {
                                 element.innerHTML = '<option value="loading" selected disabled>Se încarcă...</option>';
                             }
                         } else if (!isLoading && element.id !== 'quarterFilter' && element.id !== 'monthFilter' && element.querySelector('option[value="loading"]')) {
                              element.innerHTML = ''; // Clear loading state if it exists
                              // populateSelect will add the default "Toate/Toti anii" later
                         }
                     }
                  }
             });
        }


        // --- Populate Select Options (MODIFIED FOR CHOICES.JS) ---
        function populateFilters(activities) {
            if (!areActivityFiltersReady) return;
            logToConsole('Populating activity filters...'); // Added log
            populateSelect(filters.project, [...new Set(activities.map(a => a.fields[FIELDS.PROIECT]).filter(Boolean))].sort(), "Toate Proiectele");
            populateSelect(filters.name, [...new Set(activities.map(a => a.fields[FIELDS.NUME]).filter(Boolean))].sort(), "Toate Numele");
            const years = [...new Set(activities.map(a => a.fields[FIELDS.START] ? new Date(a.fields[FIELDS.START]).getFullYear() : null).filter(Boolean))].sort((a,b) => b - a);
            populateSelect(filters.year, years, "Toți anii");
             // Quarter and Month are static, no need to populate from data
        }
        function populateContractFilters(contractsMap) {
            if (!areLinkedDataReady) return;
            logToConsole('Populating contract filters...'); // Added log
            const contracts = Array.from(contractsMap.values());
            const projects = [...new Set(contracts.map(c => c['Proiect']).filter(Boolean))].sort();
            const contractActivities = [...new Set(contracts.map(c => c['Activitatea']).filter(Boolean))].sort();
            const monthYears = [...new Set(contracts.map(c => c['Luna si an']).filter(Boolean))].sort();
            populateSelect(filters.contractProject, projects, "Toate Contractele Proiect");
            populateSelect(filters.contractActivity, contractActivities, "Toate Contractele Activitate");
            populateSelect(filters.contractMonthYear, monthYears, "Toate Contractele Luna/An");
        }
        function populateSelect(select, options, placeholderText = "Selectează...") {
            if (!select) return;

            const isMultiSelect = select.hasAttribute('multiple');
            const selectId = select.id;
            logToConsole(`Populating select: ${selectId}`); // Added log

            // Destroy previous Choices instance if it exists
             if (choicesInstances[selectId]) {
                 try {
                     choicesInstances[selectId].destroy();
                 } catch (error) {
                     logToConsole(`Error destroying previous Choices instance for ${selectId}: ${error}`, 'WARN');
                 }
                 choicesInstances[selectId] = null;
             }

            // Clear native select options (except for static Quarter/Month)
             if (selectId !== 'quarterFilter' && selectId !== 'monthFilter') {
                select.innerHTML = ''; // Clear everything before adding new options
            }

            // Prepare options for Choices.js (or native select)
            let choicesOptions = options.map(opt => ({ value: opt, label: opt, selected: false, disabled: false })); // Ensure selected is false initially

            // Add a placeholder/default option structure for Choices.js
             let defaultChoiceAdded = false;
             if (!isMultiSelect && (selectId === 'yearFilter' || selectId === 'monthFilter')) { // *** ADDED MONTH ***
                 choicesOptions.unshift({ value: '', label: (selectId === 'yearFilter' ? 'Toți anii' : 'Toate lunile'), selected: true, disabled: false }); // Select by default
                 defaultChoiceAdded = true;
             } else if (isMultiSelect) {
                 // Multi-selects use placeholderValue, no need for an empty option unless desired
             } else if (selectId !== 'quarterFilter' && selectId !== 'monthFilter') { // Generic single select (exclude Quarter/Month)
                 choicesOptions.unshift({ value: '', label: placeholderText, selected: true, disabled: false });
                 defaultChoiceAdded = true;
             }


             // Initialize Choices.js for relevant filters
            if (selectId !== 'quarterFilter' && selectId !== 'monthFilter' && selectId !== 'editProiect' && selectId !== 'disapprovalProiect') { // Exclude static Quarter/Month and modal selects
                 try {
                     const choicesConfig = {
                         removeItemButton: isMultiSelect,
                         searchEnabled: true,
                         placeholder: true,
                         placeholderValue: isMultiSelect ? placeholderText : (defaultChoiceAdded ? null : placeholderText), // Placeholder logic
                         allowHTML: false,
                         itemSelectText: 'Apasă', //'Apasă pentru a selecta',
                         noResultsText: 'Niciun rezultat', // 'Niciun rezultat găsit',
                         noChoicesText: 'Nicio opțiune', // 'Nicio opțiune de ales',
                         searchPlaceholderValue: 'Caută...',
                         shouldSort: false,
                         // searchResultLimit: 10,
                     };
                     const instance = new Choices(select, choicesConfig);
                     instance.setChoices(choicesOptions, 'value', 'label', true); // Set options, replace existing
                     choicesInstances[selectId] = instance; // Store instance
                     logToConsole(`Choices.js initialized for ${selectId}`);

                 } catch (error) {
                     logToConsole(`Error initializing Choices.js for ${selectId}: ${error}`, 'ERROR');
                     // Fallback to native select population if Choices fails
                     if (selectId !== 'quarterFilter' && selectId !== 'monthFilter') {
                         select.innerHTML = `<option value="">${placeholderText}</option>`; // Add default
                          options.forEach(opt => select.add(new Option(opt, opt)));
                     }
                 }
            } else if (selectId !== 'quarterFilter' && selectId !== 'monthFilter') {
                 // Populate native selects for modals (editProiect, disapprovalProiect)
                 select.innerHTML = `<option value="">${placeholderText}</option>`; // Add default
                 options.forEach(opt => select.add(new Option(opt, opt)));
                 select.value = ''; // Set default for modal selects
            }
             // Ensure native quarter/month select is enabled if not loading
            if(selectId === 'quarterFilter' || selectId === 'monthFilter') { // Keep Quarter/Month native
                select.disabled = false; // Ensure it's enabled after loading
                select.value = ''; // Reset to 'Toate'
            }
        }


        // --- Apply Filters (MODIFIED FOR Infinite Scroll) ---
        function applyFilters() {
             logToConsole('applyFilters: Applying selected filters.');
             if (!areActivityFiltersReady) { logToConsole('applyFilters: Skip - Activity data not ready.'); return; }

             // Get values from Choices.js or native selects
             const getSelectedValues = (filterId) => {
                 const instance = choicesInstances[filterId];
const element = filters[filterId] || filters[filterId.replace('Filter', '')];
                 if (instance) {
                     const value = instance.getValue(true);
                     if (filterId === 'yearFilter' && value === '') return [];
                     return Array.isArray(value) ? value : (value ? [value] : []);
                 } else if (element) {
                     return element.value ? [element.value] : [];
                 }
                 return [];
             };

             const dates = dateRangePicker.selectedDates;
             const selectedYears = getSelectedValues('yearFilter');
const selectedQuarters = filters.quarter ? (filters.quarter.value ? [filters.quarter.value] : []) : [];
const selectedMonths = filters.month ? (filters.month.value ? [filters.month.value] : []) : [];

             const selectedProjects = getSelectedValues('projectFilter');
             const selectedNames = getSelectedValues('nameFilter');
             const selectedContractProjects = getSelectedValues('contractProjectFilter');
             const selectedContractActivities = getSelectedValues('contractActivityFilter');
             const selectedContractMonthYears = getSelectedValues('contractMonthYearFilter');

             // *** MODIFIED: Use singleQuarter for the check, not selectedQuarters.length ***
             const singleQuarter = selectedQuarters.length === 1 && selectedQuarters[0] !== "" ? parseInt(selectedQuarters[0], 10) : null; // *** CORRECTED PARSE ***
             const singleMonth = selectedMonths.length === 1 && selectedMonths[0] !== "" ? parseInt(selectedMonths[0], 10) : null; // *** ADDED MONTH + PARSE ***

             const isAnyFilterActive = dates.length > 0 || selectedYears.length > 0 || selectedQuarters.length > 0 || selectedMonths.length > 0 || selectedProjects.length > 0 || selectedNames.length > 0 || selectedContractProjects.length > 0 || selectedContractActivities.length > 0 || selectedContractMonthYears.length > 0; // *** ADDED MONTH ***
             const contractFiltersActive = selectedContractProjects.length > 0 || selectedContractActivities.length > 0 || selectedContractMonthYears.length > 0;

            let filteredActivities = [...allActivities];

            if (isAnyFilterActive) {
                logToConsole('applyFilters: Active filters found. Filtering...');
                // Apply filters (adjust logic for arrays)
                if (selectedYears.length > 0) {
                     filteredActivities = filteredActivities.filter(a => a.fields[FIELDS.START] && selectedYears.includes(new Date(a.fields[FIELDS.START]).getFullYear().toString()));
                     logToConsole(`After Year filter (${selectedYears.join(', ')}): ${filteredActivities.length} records.`);
                 }
                 if (dates.length === 2) {
                     const [start, end] = [dates[0], new Date(dates[1]).setHours(23, 59, 59, 999)];
                     filteredActivities = filteredActivities.filter(a => a.fields[FIELDS.START] && new Date(a.fields[FIELDS.START]) >= start && new Date(a.fields[FIELDS.START]) <= end);
                     logToConsole(`After Date Range filter: ${filteredActivities.length} records.`);
                 }
                // *** MODIFIED: Quarter filter logic (Independent of Year) ***
                if (singleQuarter !== null && singleQuarter >= 1 && singleQuarter <= 4) {
                     logToConsole(`Applying Quarter filter (Q${singleQuarter})...`);
                     const startMonth = (singleQuarter - 1) * 3; // Q1=0, Q2=3, Q3=6, Q4=9
                     const endMonth = startMonth + 2; // Q1=2, Q2=5, Q3=8, Q4=11
                     
                     filteredActivities = filteredActivities.filter(a => {
                         if (!a.fields[FIELDS.START]) return false;
                         const activityMonth = new Date(a.fields[FIELDS.START]).getMonth(); // 0-11
                         return activityMonth >= startMonth && activityMonth <= endMonth;
                     });
                     logToConsole(`After Quarter filter (Q${singleQuarter}): ${filteredActivities.length} records.`);
                }
                 // *** ADDED: Month filter logic (Independent of Year) ***
                 if (singleMonth !== null && singleMonth >= 0 && singleMonth <= 11) {
                    logToConsole(`Applying Month filter (Month: ${singleMonth})...`);
                     filteredActivities = filteredActivities.filter(a => {
                         if (!a.fields[FIELDS.START]) return false;
                         const activityMonth = new Date(a.fields[FIELDS.START]).getMonth(); // 0-11
                         return activityMonth === singleMonth;
                     });
                     logToConsole(`After Month filter (Month: ${singleMonth}): ${filteredActivities.length} records.`);
                 }

                if (selectedProjects.length > 0) {
                     filteredActivities = filteredActivities.filter(a => a.fields[FIELDS.PROIECT] && selectedProjects.includes(a.fields[FIELDS.PROIECT]));
                     logToConsole(`After Project filter: ${filteredActivities.length} records.`);
                 }
                 if (selectedNames.length > 0) {
                     filteredActivities = filteredActivities.filter(a => a.fields[FIELDS.NUME] && selectedNames.includes(a.fields[FIELDS.NUME]));
                      logToConsole(`After Name filter: ${filteredActivities.length} records.`);
                 }
                 // Contract filtering logic
                 // *** MODIFIED: Check readiness before attempting to filter ***
                if (contractFiltersActive && areLinkedDataReady) {
                     filteredActivities = filteredActivities.filter(activity => {
                         const contractIds = activity.fields[FIELDS.CONTRACT_LINK]; if (!contractIds || contractIds.length === 0) return false;
                         return contractIds.some(contractId => {
                             const contract = allContractsData.get(contractId); if (!contract) return false;
                             const projectMatch = selectedContractProjects.length === 0 || selectedContractProjects.includes(contract['Proiect']);
                             const activityMatch = selectedContractActivities.length === 0 || selectedContractActivities.includes(contract['Activitatea']);
                             const monthYearMatch = selectedContractMonthYears.length === 0 || selectedContractMonthYears.includes(contract['Luna si an']);
                             return projectMatch && activityMatch && monthYearMatch;
                         });
                     });
                     logToConsole(`After Contract filters: ${filteredActivities.length} records.`);
                 } else if (contractFiltersActive && !areLinkedDataReady) {
                     logToConsole('applyFilters: Contract filters selected, but data not ready. Ignoring contract filters.', 'WARN');
                 }
            } else {
                logToConsole('applyFilters: No active filters. Showing all activities.');
            }

            // --- NEW Infinite Scroll Logic ---
            logToConsole(`applyFilters: Total filtered records: ${filteredActivities.length}`);
            currentFilteredActivities = filteredActivities; // Store the full filtered list
            currentPage = 1; // Reset page
            currentDisplayedActivities = currentFilteredActivities.slice(0, RECORDS_PER_PAGE); // Get first page
            isLoadingMore = false; // Reset lock
            if (tableContainer) tableContainer.scrollTop = 0; // Scroll to top on fresh filter

            renderTable(currentDisplayedActivities, true); // true = fresh render (clear table)
        }

        // --- Modal Logic (Callbacks mostly unchanged) ---
        // *** MODIFIED: openApprovalModal to support multi-select ***
        function openApprovalModal(recordId) { 
            logToConsole(`Inside openApprovalModal for record: ${recordId}`); 
            originalRecordData = allActivities.find(r => r.id === recordId)?.fields || null; 
            if (!originalRecordData) { logToConsole(`Datele originale pentru record ${recordId} NU au fost găsite local!`, 'WARN'); } 
            const modal = modals.approval; 
            modal.dataset.recordId = recordId; 
            // *** MODIFIED: Initialize with existing links if they exist (for multi-select) ***
            modal.dataset.selectedOfferIds = (originalRecordData[FIELDS.OFERTA_LINK] || []).join(',');
            modal.dataset.selectedContractIds = (originalRecordData[FIELDS.CONTRACT_LINK] || []).join(',');
            modal.dataset.selectedOfferIdsDisapproval = ''; 
            modal.dataset.selectedContractIdsDisapproval = ''; 
            
            approvalDecisionRadios.forEach(radio => radio.checked = false); 
            approvalActionGroup.style.display = 'none'; 
            disapprovalFieldsGroup.style.display = 'none'; 
            offerSelectionInApproval.style.display = 'none'; 
            contractSelectionInApproval.style.display = 'none'; 
            approvalSourceSelect.value = ''; 
            selectionInfoDiv.textContent = ''; 
            disapprovalSelectionInfoDiv.textContent = ''; 
            confirmApprovalBtn.disabled = true; 
            confirmApprovalBtn.textContent = 'Confirmă'; 
            confirmApprovalBtn.classList.remove('btn-rejection'); 
            confirmApprovalBtn.classList.add('btn-save'); 
            
            // Pre-fill disapproval fields with current data
            document.getElementById('disapprovalNume').value = originalRecordData[FIELDS.NUME] || '';
            document.getElementById('disapprovalProiect').value = originalRecordData[FIELDS.PROIECT] || ''; // This will be native, populateSelect in handler
            document.getElementById('disapprovalActivitate').value = originalRecordData[FIELDS.ACTIVITATE] || '';
            document.getElementById('disapprovalStart').value = formatISODate(originalRecordData[FIELDS.START]);
            document.getElementById('disapprovalStop').value = formatISODate(originalRecordData[FIELDS.STOP]);
            document.getElementById('disapprovalReason').value = originalRecordData[FIELDS.MOTIV_REFUZ] || '';
            activitySourceSelectDisapproval.value = ''; // Reset source for disapproval
            
            // Populate disapproval project select (native)
            populateSelect(document.getElementById('disapprovalProiect'), [...new Set(allActivities.map(a => a.fields[FIELDS.PROIECT]).filter(Boolean))].sort(), 'Selectează Proiect');
            document.getElementById('disapprovalProiect').value = originalRecordData[FIELDS.PROIECT] || ''; // Re-select current project


            approvalSourceSelect.disabled = !areLinkedDataReady; 
            activitySourceSelectDisapproval.disabled = !areLinkedDataReady; 
            const loadingText = 'Se încarcă datele...'; 
            const defaultText = 'Alege o sursă...'; 
            approvalSourceSelect.querySelector('option[value=""]').textContent = areLinkedDataReady ? defaultText : loadingText; 
            activitySourceSelectDisapproval.querySelector('option[value=""]').textContent = areLinkedDataReady ? defaultText : loadingText; 
            
            // *** MODIFIED: Auto-select source if links exist ***
            if (originalRecordData[FIELDS.OFERTA_LINK] && originalRecordData[FIELDS.OFERTA_LINK].length > 0) {
                approvalSourceSelect.value = 'Oferta';
                approvalSourceSelect.dispatchEvent(new Event('change')); // Trigger change to show list
            } else if (originalRecordData[FIELDS.CONTRACT_LINK] && originalRecordData[FIELDS.CONTRACT_LINK].length > 0) {
                approvalSourceSelect.value = 'Contract';
                 approvalSourceSelect.dispatchEvent(new Event('change')); // Trigger change to show list
            } else if (originalRecordData[FIELDS.APROBAT] === true) { // Check if approved but no links
                 approvalSourceSelect.value = 'Proces ofertare';
                 approvalSourceSelect.dispatchEvent(new Event('change')); // Trigger change
            }

            openModal(modal); 
        }
        // --- REMOVED showPdfViewer ---
        async function openPostApprovalEditModal(recordId, originalFieldsData, latestFieldsData, isReadOnly = false) { 
            logToConsole(`Inside openPostApprovalEditModal for record: ${recordId}, isReadOnly: ${isReadOnly}`); 
            const modal = modals.edit; 
            const editNume = document.getElementById('editNume'); 
            const editActivitate = document.getElementById('editActivitate'); 
            const editStart = document.getElementById('editStart'); 
            const editStop = document.getElementById('editStop'); 
            const editProiect = document.getElementById('editProiect'); 
            // *** NEW: Get editSource element ***
            const editSource = document.getElementById('editActivitySource');
            const saveButton = document.getElementById('saveEditBtn'); 
            const cancelButton = document.getElementById('cancelEditBtn'); 
            const editFieldsStatusSpan = document.getElementById('editFieldsStatus'); 
            
            editNume.value = latestFieldsData[FIELDS.NUME] || ''; 
            editActivitate.value = latestFieldsData[FIELDS.ACTIVITATE] || ''; 
            editStart.value = formatISODate(latestFieldsData[FIELDS.START]); 
            editStop.value = formatISODate(latestFieldsData[FIELDS.STOP]); 
            
            // *** NEW: Populate editSource dropdown ***
            let currentSource = 'Proces ofertare'; // Default
            if (latestFieldsData[FIELDS.OFERTA_LINK] && latestFieldsData[FIELDS.OFERTA_LINK].length > 0) {
                currentSource = 'Oferta';
            } else if (latestFieldsData[FIELDS.CONTRACT_LINK] && latestFieldsData[FIELDS.CONTRACT_LINK].length > 0) {
                currentSource = 'Contract';
            }
            editSource.value = currentSource;
            
            // Populate project select (native)
            if (!isReadOnly && areActivityFiltersReady) { 
                populateSelect(editProiect, [...new Set(allActivities.map(a => a.fields[FIELDS.PROIECT]).filter(Boolean))].sort(), 'Selectează Proiect'); 
            } else { 
                editProiect.innerHTML = `<option value="${latestFieldsData[FIELDS.PROIECT] || ''}">${latestFieldsData[FIELDS.PROIECT] || 'N/A'}</option>`; 
            } 
            editProiect.value = latestFieldsData[FIELDS.PROIECT] || ''; 
            
            // Set readonly/disabled state
            editNume.readOnly = isReadOnly; 
            editActivitate.readOnly = isReadOnly; 
            editStart.readOnly = isReadOnly; 
            editStop.readOnly = isReadOnly; 
            editProiect.disabled = isReadOnly || !areActivityFiltersReady; 
            editSource.disabled = isReadOnly; // *** NEW: Set disabled state ***
            
            const initialNume = latestFieldsData[FIELDS.NUME_INIT] !== undefined && latestFieldsData[FIELDS.NUME_INIT] !== null ? latestFieldsData[FIELDS.NUME_INIT] : originalFieldsData[FIELDS.NUME]; 
            const initialProiect = latestFieldsData[FIELDS.PROIECT_INIT] !== undefined && latestFieldsData[FIELDS.PROIECT_INIT] !== null ? latestFieldsData[FIELDS.PROIECT_INIT] : originalFieldsData[FIELDS.PROIECT]; 
            const initialActivitate = latestFieldsData[FIELDS.ACTIVITATE_INIT] !== undefined && latestFieldsData[FIELDS.ACTIVITATE_INIT] !== null ? latestFieldsData[FIELDS.ACTIVITATE_INIT] : originalFieldsData[FIELDS.ACTIVITATE]; 
            const initialStart = latestFieldsData[FIELDS.START_INIT] !== undefined && latestFieldsData[FIELDS.START_INIT] !== null ? latestFieldsData[FIELDS.START_INIT] : originalFieldsData[FIELDS.START]; 
            const initialStop = latestFieldsData[FIELDS.STOP_INIT] !== undefined && latestFieldsData[FIELDS.STOP_INIT] !== null ? latestFieldsData[FIELDS.STOP_INIT] : originalFieldsData[FIELDS.STOP]; 
            
            document.getElementById('initialNume').value = initialNume || 'N/A'; 
            document.getElementById('initialProiect').value = initialProiect || 'N/A'; 
            document.getElementById('initialActivitate').value = initialActivitate || 'N/A'; 
            document.getElementById('initialStart').value = formatDisplayDate(initialStart); 
            document.getElementById('initialStop').value = formatDisplayDate(initialStop); 
            
            modal.dataset.recordId = recordId; 
            document.getElementById('editModalTitle').textContent = isReadOnly ? "Vizualizare Detalii" : "Editare Activitate"; // Modified title
            editFieldsStatusSpan.textContent = isReadOnly ? "Doar Vizualizare" : "Editabile"; 
            saveButton.style.display = isReadOnly ? 'none' : 'inline-block'; 
            cancelButton.textContent = isReadOnly ? 'Închide' : 'Renunță'; 
            
            openModal(modal); 
        }
        async function openReadOnlyViewModal(recordId, originalFieldsData, latestFieldsData) { 
            logToConsole(`Inside openReadOnlyViewModal for record: ${recordId}`); 
            // *** MODIFIED: Set isReadOnly to false to make it editable ***
            await openPostApprovalEditModal(recordId, originalFieldsData, latestFieldsData, false); 
        }
        
        // *** RE-ADDED Secondary Modal Functions ***
        function openSelectionOverlay(source) {
            logToConsole(`Opening selection overlay for source: ${source}`);
            const modal = modals.selectionOverlay;
            selectionOverlaySourceSelect.value = source;
            temporarySelectedIds = []; // Reset temp storage
            
            // Populate filters if this is the first time
            if (selectionOverlayContractProjectFilter.options.length <= 1 && areLinkedDataReady) {
                 const contracts = Array.from(allContractsData.values());
                 const projects = [...new Set(contracts.map(c => c['Proiect']).filter(Boolean))].sort();
                 const prestatori = [...new Set(contracts.map(c => c['Prestator']).filter(Boolean))].sort();
                 const monthYears = [...new Set(contracts.map(c => c['Luna si an']).filter(Boolean))].sort();
                 populateSelect(selectionOverlayContractProjectFilter, projects, "Toate Proiectele");
                 populateSelect(selectionOverlayContractPrestatorFilter, prestatori, "Toți Prestatorii");
                 populateSelect(selectionOverlayContractMonthYearFilter, monthYears, "Toate Perioadele");
            }
            
            if (source === 'Oferta') {
                selectionOverlayTitle.textContent = 'Selectează Ofertă(e)';
                selectionOverlayOfferSection.style.display = 'flex';
                selectionOverlayContractSection.style.display = 'none';
                renderSelectionOverlayOfferList();
            } else { // Contract
                selectionOverlayTitle.textContent = 'Selectează Contract(e)';
                selectionOverlayOfferSection.style.display = 'none';
                selectionOverlayContractSection.style.display = 'flex';
                renderSelectionOverlayContractList();
            }
            openModal(modal);
        }

        function renderSelectionOverlayOfferList() {
            const searchTerm = selectionOverlayOfferSearch.value.toLowerCase();
            renderOfferList(selectionOverlayOfferListContainer, allOffersData, temporarySelectedIds, searchTerm);
        }
        
        function renderSelectionOverlayContractList() {
             const searchTerm = selectionOverlayContractSearch.value.toLowerCase();
             const project = selectionOverlayContractProjectFilter.value;
             const prestator = selectionOverlayContractPrestatorFilter.value;
             const monthYear = selectionOverlayContractMonthYearFilter.value;
             renderContractList(selectionOverlayContractListContainer, allContractsData, temporarySelectedIds, searchTerm, project, prestator, monthYear);
        }
        
        function toggleSelectionOverlayItem(recordId) {
            const index = temporarySelectedIds.indexOf(recordId);
            if (index > -1) {
                temporarySelectedIds.splice(index, 1); // Remove if exists
            } else {
                temporarySelectedIds.push(recordId); // Add if not exists
            }
            logToConsole(`Temporary selection: ${temporarySelectedIds.join(',')}`, 'DEBUG');
        }

        // *** RE-ADDED List Rendering Functions (Generic) ***
        function renderOfferList(container, data, selectedIds = [], searchTerm = "") {
            if (!container) return;
            container.innerHTML = '';
            let count = 0;
            const searchTermLower = searchTerm.toLowerCase();

            data.forEach((fields, id) => {
                const name = fields[FIELDS.OFERTA_NUME_PRIMAR] || 'Ofertă Fără Nume';
                
                // *** MODIFIED: Build detailed description ***
                let details = FIELDS.OFERTA_ESENTIALE
                    .map(fieldKey => {
                        const value = fields[fieldKey] || 'N/A';
                        // Shorten field key for display
                        let cleanKey = fieldKey.split(' ')[0].replace('(from', '').trim();
                        if (cleanKey === 'BENEFICIAR') cleanKey = 'Beneficiar';
                        if (cleanKey === 'DATA') cleanKey = 'Data';
                        if (cleanKey === 'Total') cleanKey = 'Total';
                        if (cleanKey === 'Va') cleanKey = 'Descriere'; // Shorten "Va rugam sa gasiti concatenate"
                        
                        return `${cleanKey}: ${value}`;
                    })
                    .join(' | ');

                const fullText = `${name} | ${details}`.toLowerCase(); // Use full text for search

                if (searchTerm && !fullText.includes(searchTermLower)) {
                    return; // Skip if search term doesn't match
                }
                
                const item = document.createElement('div');
                item.className = 'offer-list-item';
                item.dataset.recordId = id;
                if (selectedIds.includes(id)) {
                    item.classList.add('selected');
                }
                item.innerHTML = `
                    <span>
                        <strong>${name}</strong>
                        <button class="view-pdf-btn" onclick="viewOfferPdf('${id}');">📄 Vezi PDF</button>
                        <br>
                        <small>${details}</small>
                    </span>`; 
                container.appendChild(item);
                count++;
            });
            if (count === 0) {
                 container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-secondary);">Nicio ofertă găsită.</div>';
            }
        }

        function renderContractList(container, data, selectedIds = [], searchTerm = "", project = "", prestator = "", monthYear = "") {
             if (!container) return;
             container.innerHTML = '';
             let count = 0;
             const searchTermLower = searchTerm.toLowerCase();

             data.forEach((fields, id) => {
                 const name = fields[FIELDS.CONTRACT_NUME_PRIMAR] || 'Contract Fără Nume';

                 // Filtering (already correct)
                 if (project && fields['Proiect'] !== project) return;
                 if (prestator && fields['Prestator'] !== prestator) return;
                 if (monthYear && fields['Luna si an'] !== monthYear) return;

                 // *** MODIFIED: Build detailed description from _ESENTIALE ***
                 let details = FIELDS.CONTRACT_ESENTIALE
                     .map(fieldKey => {
                         const value = fields[fieldKey] || 'N/A';
                         return `${fieldKey}: ${value}`;
                     })
                     .join(' | ');

                 const fullText = `${name} | ${details}`.toLowerCase(); // Use full text for search

                 if (searchTerm && !fullText.includes(searchTermLower)) {
                    return; // Skip if search term doesn't match
                 }
                
                 const item = document.createElement('div');
                 item.className = 'contract-list-item';
                 item.dataset.recordId = id;
                 if (selectedIds.includes(id)) {
                     item.classList.add('selected');
                 }
                 item.innerHTML = `<span><strong>${name}</strong><br><small>${details}</small></span>`;
                 container.appendChild(item);
                 count++;
             });
              if (count === 0) {
                 container.innerHTML = '<div style="padding: 15px; text-align: center; color: var(--text-secondary);">Niciun contract găsit.</div>';
             }
        }
        



        // --- Funcții pentru vizualizare PDF ---
        let currentPdfDoc = null;

        window.viewOfferPdf = async function(offerId) {
            logToConsole(`Attempting to view PDF for offer: ${offerId}`, 'INFO');
            
            const offerData = allOffersData.get(offerId);
            if (!offerData) {
                alert('Nu s-au găsit date pentru această ofertă.');
                return;
            }
            
            const pdfField = offerData['OFERTA PDF'];
            if (!pdfField || !Array.isArray(pdfField) || pdfField.length === 0) {
                alert('Această ofertă nu are un document PDF atașat.');
                return;
            }
            
            const pdfUrl = pdfField[0].url;
            if (!pdfUrl) {
                alert('URL-ul documentului PDF nu este disponibil.');
                return;
            }
            
            // Deschide modalul
            const modal = document.getElementById('pdfViewerModal');
            const bodyElement = document.getElementById('pdfViewerBody');
            modal.style.display = 'block';
            document.body.classList.add('modal-open');
            
            // Resetează conținutul
            bodyElement.innerHTML = `
                <div class="pdf-loading">
                    <div class="pdf-loading-spinner"></div>
                    <p style="margin-top: 15px;">Se încarcă documentul...</p>
                </div>
            `;
            
            try {
                // Configurează worker pentru PDF.js
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
                
                // Încarcă documentul PDF
                const loadingTask = pdfjsLib.getDocument({
                    url: pdfUrl,
                    withCredentials: false
                });
                
                const pdf = await loadingTask.promise;
                currentPdfDoc = pdf;
                
                logToConsole(`PDF loaded successfully. Total pages: ${pdf.numPages}`, 'INFO');
                
                // Creează container pentru toate paginile
                bodyElement.innerHTML = '<div class="pdf-canvas-container"></div>';
                const container = bodyElement.querySelector('.pdf-canvas-container');
                
                // Renderizează toate paginile
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    
                    // Calculează scala pentru a se potrivi în container
                    const viewport = page.getViewport({ scale: 1.5 });
                    
                    // Creează canvas pentru pagină
                    const canvas = document.createElement('canvas');
                    canvas.className = 'pdf-page-canvas';
                    const context = canvas.getContext('2d');
                    
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    // Adaugă pagina în container
                    const pageContainer = document.createElement('div');
                    pageContainer.style.marginBottom = '20px';
                    pageContainer.appendChild(canvas);
                    container.appendChild(pageContainer);
                    
                    // Renderizează pagina
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    
                    await page.render(renderContext).promise;
                    
                    // Adaugă număr pagină
                    const pageNumber = document.createElement('div');
                    pageNumber.style.textAlign = 'center';
                    pageNumber.style.marginTop = '10px';
                    pageNumber.style.color = '#6c757d';
                    pageNumber.textContent = `Pagina ${pageNum} din ${pdf.numPages}`;
                    pageContainer.appendChild(pageNumber);
                }
                
            } catch (error) {
                logToConsole(`Error loading PDF: ${error.message}`, 'ERROR');
                bodyElement.innerHTML = `
                    <div class="pdf-error">
                        <h4>Eroare la încărcarea documentului</h4>
                        <p>${error.message}</p>
                        <p>Vă rugăm să încercați din nou sau să descărcați documentul direct din Airtable.</p>
                    </div>
                `;
            }
        }

        window.closePdfViewer = function() {
            const modal = document.getElementById('pdfViewerModal');
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            // Cleanup PDF resources
            if (currentPdfDoc) {
                currentPdfDoc.destroy();
                currentPdfDoc = null;
            }
            
            // Clear modal content
            const bodyElement = document.getElementById('pdfViewerBody');
            bodyElement.innerHTML = '';
        }

        // Închide modalul când se apasă ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const pdfModal = document.getElementById('pdfViewerModal');
                if (pdfModal && pdfModal.style.display === 'block') {
                    closePdfViewer();
                }
            }
        });

        // Închide modalul când se dă click în afara lui
        document.addEventListener('click', function(event) {
            const pdfModal = document.getElementById('pdfViewerModal');
            if (event.target === pdfModal) {
                closePdfViewer();
            }
        });
       // --- Initialization ---
       try {
            initializeApp().catch(error => {
                logToConsole(`Async Init Error: ${error.message}\n${error.stack}`, 'ERROR'); // Added stack trace
                if (loadingDiv) { loadingDiv.innerHTML = `<p style="color: red; font-weight: bold;">CRITICAL INIT ERROR</p><p>${error.message}</p>`; progressBarContainer.style.display = 'none'; }
                 // Ensure progress interval is cleared on init error
                 if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
            });
       } catch (error) {
            logToConsole(`Sync Startup Error: ${error.message}\n${error.stack}`, 'ERROR'); // Added stack trace
            if (loadingDiv) { loadingDiv.innerHTML = `<p style="color: red; font-weight: bold;">CRITICAL STARTUP ERROR</p><p>${error.message}</p>`; progressBarContainer.style.display = 'none'; }
             // Ensure progress interval is cleared on init error
             if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
       }
    } // End runApp

    // --- Library Check and Global Error Handling (Unchanged) ---
    function checkLibrariesAndRun() {
        // Added Choices check
        if (typeof flatpickr !== 'undefined' && typeof Choices !== 'undefined' && typeof pdfjsLib !== 'undefined') { // Added pdfjsLib check
            try { runApp(); } catch (error) { console.error(`[ERROR] Sync Error in runApp: ${error.message}\n${error.stack}`); const ld = document.getElementById('content-load-spinner'); const pb = document.getElementById('progressBarContainer'); if (ld) { ld.innerHTML = `<p style="color: red; font-weight: bold;">CRITICAL EXECUTION ERROR</p><p>${error.message}</p>`; } if(pb) { pb.style.display = 'none';} }
        } else {
             // Log missing libraries
             if (typeof Choices === 'undefined') console.warn("Waiting for Choices.js...");
             if (typeof flatpickr === 'undefined') console.warn("Waiting for flatpickr...");
             if (typeof pdfjsLib === 'undefined') console.warn("Waiting for PDF.js...");
             setTimeout(checkLibrariesAndRun, 150); // Increased timeout slightly
         }
    }
    window.addEventListener('unhandledrejection', function(event) {
        let reasonMessage = event.reason instanceof Error ? event.reason.stack : JSON.stringify(event.reason);
        console.error(`[ERROR] Unhandled Promise Rejection: ${reasonMessage}`);
        const ld = document.getElementById('content-load-spinner');
        const pb = document.getElementById('progressBarContainer');
        if (ld && ld.style.display !== 'none') {
            ld.innerHTML = `<p style="color: red; font-weight: bold;">ASYNC ERROR OCCURRED</p><p>Check browser console.</p>`;
        }
        if(pb) { pb.style.display = 'none'; }
         // Ensure progress interval is cleared on unhandled rejection
         if (progressInterval) {
            logToConsole('Clearing progress interval due to unhandled rejection.', 'WARN');
            clearInterval(progressInterval);
            progressInterval = null;
         }
    });


    // Start the application
    checkLibrariesAndRun();
</script>
