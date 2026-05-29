function workshopDashboard() {
      return {
        tasks: [],
        isLoading: true,

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
          if (auth.role !== 'employee' && auth.role !== 'admin') {
            window.location.href = '/dashboard/client';
            return;
          }

          await this.fetchTasks();
          this.isLoading = false;
        },

        async fetchTasks() {
          try {
            const auth = Alpine.store('saeedAuth');
            if (!auth || !auth.supabase) return;

            // Restricted: Only fetch orders assigned to THIS employee's UUID
            const { data, error } = await auth.supabase
              .from('orders')
              .select('*')
              .eq('assigned_to', auth.user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;

            this.tasks = (data || []).map(row => ({
              ...row,
              model: (row.configuration_details?.style_selected || row.configuration_details?.selected_model_id) || null,
              conf: row.configuration_details || {},
              _saving: false
            }));
          } catch (e) {
            console.error('Fetch tasks failed:', e);
            this.tasks = [];
          }
        },

        async updateStatus(task, newStatus) {
          task._saving = true;
          try {
            const auth = Alpine.store('saeedAuth');
            const { error } = await auth.supabase
              .from('orders')
              .update({ status: newStatus })
              .eq('id', task.id);

            if (error) throw error;
            task.status = newStatus;
          } catch (e) {
            console.error('Status update failed:', e);
          } finally {
            task._saving = false;
          }
        },

        getNextActions(status) {
          const flow = {
            'Lead Received':      [{ value: 'Measurement Scheduled', label: 'Schedule Measurement', style: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10' }],
            'Measurement Scheduled': [{ value: 'In Manufacturing',   label: 'Start Manufacturing', style: 'border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e]/10' }],
            'In Manufacturing':   [{ value: 'Quality Check',         label: 'Send to QC',          style: 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10' }],
            'Quality Check':      [{ value: 'Ready for Delivery',    label: 'Mark Ready',          style: 'border-green-500/40 text-green-400 hover:bg-green-500/10' }],
            'Ready for Delivery': []
          };
          return flow[status] || [];
        },

        getStatusProgress(status) {
          const map = {
            'Lead Received': 10,
            'Measurement Scheduled': 30,
            'In Manufacturing': 58,
            'Quality Check': 80,
            'Ready for Delivery': 100
          };
          return map[status] ?? 10;
        },

        getStatusStyle(status) {
          const map = {
            'Lead Received':         'border-white/10 text-white/40',
            'Measurement Scheduled': 'border-blue-500/30 text-blue-400',
            'In Manufacturing':      'border-[#c9a96e]/30 text-[#c9a96e]',
            'Quality Check':         'border-purple-500/30 text-purple-400',
            'Ready for Delivery':    'border-green-500/30 text-green-400'
          };
          return map[status] || 'border-white/10 text-white/40';
        },

        formatDate(iso) {
          if (!iso) return '';
          return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      };
    }