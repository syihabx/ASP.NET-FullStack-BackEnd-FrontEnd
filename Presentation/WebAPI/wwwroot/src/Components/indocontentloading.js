/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { defineComponent } from 'vue'

export default defineComponent({
    template: `
    <!-- Content Loading Panel with Bootstrap Spinner -->
    <div id="contentLoadingPanel" class="loading-panel">
        <div class="d-flex flex-column align-items-center">
            <div class="spinner-border text-primary mb-2" style="width: 3rem; height: 3rem;" role="status">
            </div>
            <div class="mt-2 text-primary fw-bold">Memuat konten...</div>
        </div>
    </div>
    `
}) 