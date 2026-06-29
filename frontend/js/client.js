function clientDashboard() {
      return {
        lang: localStorage.getItem('lang') || 'en',
        isLoading: true,
        orders: [],

        stages: [
          { key: 'new',           label: 'Lead\nReceived' },
          { key: 'contacted',     label: 'Measure\nments' },
          { key: 'qualified',     label: 'Manufact\nuring' },
          { key: 'qc',            label: 'Quality\nCheck' },
          { key: 'won',           label: 'Ready for\nDelivery' },
        ],

        async initDashboard() {
          // Wait for auth store to be ready
          let attempts = 0;
          while (Alpine.store('saeedAuth').isLoading && attempts < 20) {
            await new Promise(r => setTimeout(r, 100));
            attempts++;
          }

          const auth = Alpine.store('saeedAuth');
          if (!auth.user) {
            window.location.href = '/auth';
            return;
          }
          if (auth.role !== 'client' && auth.role !== null && auth.role !== undefined) {
            // Non-client: redirect to appropriate dashboard
            if (auth.role === 'admin') window.location.href = '/dashboard/admin';
            else window.location.href = '/dashboard/production';
            return;
          }

          await this.fetchOrders();
          this.isLoading = false;
        },

        async fetchOrders() {
          try {
            const auth = Alpine.store('saeedAuth');
            if (!auth || !auth.user || !auth.supabase) return;

            const { data, error } = await auth.supabase
              .from('orders')
              .select('*')
              .eq('client_id', auth.user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;

            this.orders = (data || []).map(row => {
              const conf = row.configuration_details || {};
              return {
                order_id: row.id,
                lead_status: row.status || conf.status || 'new',
                created_at: row.created_at,
                selected_model_id: conf.style_selected || conf.model_id,
                visit_mode: conf.visit_preference,
                district_city: conf.city_selected,
                phone: conf.phone
              };
            });
          } catch (e) {
            console.error("Fetch orders error:", e);
            this.orders = [];
          }
        },

        getStageIdx(status) {
          const map = { new: 0, contacted: 1, qualified: 2, qc: 3, won: 4 };
          return map[status] ?? 0;
        },

        getProgress(status) {
          const map = { new: 10, contacted: 32, qualified: 60, qc: 82, won: 100 };
          return map[status] ?? 10;
        },

        getStatusLabel(status) {
          const map = {
            new:       'Lead Received',
            contacted: 'Measurement Scheduled',
            qualified: 'In Manufacturing',
            qc:        'Quality Check',
            won:       'Ready for Delivery',
            lost:      'On Hold',
          };
          return map[status] || 'In Progress';
        },

        getStatusStyle(status) {
          const map = {
            new:       'border-blue-500/40 text-blue-400',
            contacted: 'border-yellow-500/40 text-yellow-400',
            qualified: 'border-orange-500/40 text-orange-400',
            qc:        'border-purple-500/40 text-purple-400',
            won:       'border-green-500/40 text-green-400',
            lost:      'border-red-500/40 text-red-400',
          };
          return map[status] || 'border-white/20 text-white/50';
        },

        formatDate(iso) {
          if (!iso) return '';
          return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      }
    }