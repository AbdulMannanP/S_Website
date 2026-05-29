function adminDashboard() {
      return {
        leads: [],
        isLoading: true,
        isSaving: false,
        confirmDelete: false,
        modalError: '',
        searchQuery: '',
        filter: 'all',
        selectedLead: null,
        editData: { lead_status: 'new', home_visit_completed: false, assigned_to: '', sales_notes: '' },
        employees: [],
        toast: { show: false, message: '', type: 'success' },

        columns: [
          { id: 'new',       label: 'New Leads' },
          { id: 'contacted', label: 'Measurements' },
          { id: 'qualified', label: 'In Production' },
          { id: 'won',       label: 'Ready for Delivery' }
        ],

        showToast(message, type = 'success') {
          this.toast = { show: true, message, type };
          setTimeout(() => { this.toast.show = false; }, 3500);
        },

        async initDashboard() {
          let attempts = 0;
          while (Alpine.store('saeedAuth').isLoading && attempts < 30) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }
          
          const auth = Alpine.store('saeedAuth');
          if (!auth.user) {
            window.location.href = '/auth';
            return;
          }
          if (auth.role !== 'admin') {
            window.location.href = '/dashboard/client';
            return;
          }

          await Promise.all([this.fetchLeads(), this.fetchEmployees()]);
          this.isLoading = false;
        },

        async fetchEmployees() {
          try {
            const auth = Alpine.store('saeedAuth');
            if (!auth?.supabase) return;
            const { data, error } = await auth.supabase
              .from('profiles').select('id, email, role').eq('role', 'employee');
            if (!error) this.employees = data || [];
          } catch(e) { console.error('fetchEmployees:', e); }
        },

        async fetchLeads() {
          try {
            const auth = Alpine.store('saeedAuth');
            if (!auth?.supabase) return;
            const { data, error } = await auth.supabase
              .from('orders').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            this.leads = (data || []).map(row => {
              const conf = row.configuration_details || {};
              return {
                id: row.id,
                order_id: row.id,
                client_id: row.client_id,
                lead_status: (row.status === 'Lead Received' ? 'new' : row.status) || conf.status || 'new',
                created_at: row.created_at,
                name: conf.name,
                phone: conf.phone,
                visit_mode: conf.visit_preference,
                district_city: conf.city_selected,
                score: conf.score || 0,
                selected_model_id: conf.style_selected || conf.model_id,
                vision_notes: conf.vision_notes,
                home_visit_completed: row.home_visit_completed || false,
                assigned_to: row.assigned_to || '',
                sales_notes: row.sales_notes || ''
              };
            });
          } catch(e) { console.error('fetchLeads:', e); }
        },

        get filteredLeads() {
          let list = this.leads;
          if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(l =>
              String(l.order_id).toLowerCase().includes(q) ||
              (l.phone && l.phone.includes(q)) ||
              (l.name && l.name.toLowerCase().includes(q))
            );
          }
          if (this.filter === 'urgent') list = list.filter(l => l.score >= 180 && l.lead_status === 'new');
          else if (this.filter === 'vip') list = list.filter(l => l.visit_mode === 'VIP Private');
          return list;
        },

        openModal(lead) {
          this.selectedLead = lead;
          this.confirmDelete = false;
          this.modalError = '';
          this.editData = {
            lead_status: lead.lead_status || 'new',
            home_visit_completed: !!lead.home_visit_completed,
            assigned_to: lead.assigned_to || '',
            sales_notes: lead.sales_notes || ''
          };
        },

        discardModal() {
          this.selectedLead = null;
          this.confirmDelete = false;
          this.modalError = '';
        },

        async saveLead() {
          if (!this.selectedLead || this.isSaving) return;
          this.isSaving = true;
          this.modalError = '';
          try {
            const auth = Alpine.store('saeedAuth');
            const { data, error } = await auth.supabase
              .from('orders')
              .update({
                status: this.editData.lead_status,
                home_visit_completed: this.editData.home_visit_completed,
                assigned_to: this.editData.assigned_to || null,
                sales_notes: this.editData.sales_notes
              })
              .eq('id', this.selectedLead.id)
              .select().single();

            if (error) throw error;

            // Update local state
            const conf = data.configuration_details || {};
            const updated = {
              id: data.id, order_id: data.id, client_id: data.client_id,
              lead_status: (data.status === 'Lead Received' ? 'new' : data.status) || 'new',
              created_at: data.created_at,
              name: conf.name, phone: conf.phone,
              visit_mode: conf.visit_preference, district_city: conf.city_selected,
              score: conf.score || 0, selected_model_id: conf.style_selected || conf.model_id,
              vision_notes: conf.vision_notes,
              home_visit_completed: data.home_visit_completed || false,
              assigned_to: data.assigned_to || '', sales_notes: data.sales_notes || ''
            };
            const idx = this.leads.findIndex(l => l.id === updated.id);
            if (idx !== -1) this.leads[idx] = updated;

            this.discardModal();
            this.showToast('Order updated successfully.');
          } catch(e) {
            this.modalError = e.message || 'Failed to save. Please try again.';
          } finally { this.isSaving = false; }
        },

        async deleteLead() {
          if (!this.selectedLead || this.isSaving) return;
          this.isSaving = true;
          this.modalError = '';
          try {
            const auth = Alpine.store('saeedAuth');
            const { error } = await auth.supabase
              .from('orders').delete().eq('id', this.selectedLead.id);
            if (error) throw error;
            this.leads = this.leads.filter(l => l.id !== this.selectedLead.id);
            this.discardModal();
            this.showToast('Order deleted.', 'success');
          } catch(e) {
            this.modalError = e.message || 'Delete failed. Please try again.';
            this.confirmDelete = false;
          } finally { this.isSaving = false; }
        },

        formatDate(iso) {
          if (!iso) return '';
          const d = new Date(iso);
          return `${d.getDate()}/${d.getMonth()+1}`;
        },
        formatFullDate(iso) {
          if (!iso) return '';
          return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
        }
      };
    }