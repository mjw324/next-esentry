interface CreateMonitorDto {
    keywords: string[];
    excludedKeywords?: string[];
    minPrice?: number;
    maxPrice?: number;
    conditions?: string[];
    sellers?: string[];
    email?: string;
    monitorInterval?: number;
  }
  
  interface Monitor {
    id: string;
    keywords: string[];
    isActive: boolean;
    excludedKeywords: string[];
    sellers: string[];
    minPrice?: number;
    maxPrice?: number;
    condition: string[];
    email?: string;
    monitorInterval?: number;
  }
  
  class MonitorService {
    private apiEndpoint = '/api/monitors';
  
    /**
     * Create a new monitor
     * @param data Monitor creation data
     * @returns The newly created monitor
     */
    async create(data: CreateMonitorDto): Promise<Monitor> {
      // Validate required fields
      if (!data.keywords || data.keywords.length === 0) {
        throw new Error('Keywords are required');
      }
  
      const backendData = {
        keywords: data.keywords,
        excludedKeywords: data.excludedKeywords || [],
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        conditions: data.conditions || [],
        sellers: data.sellers || [],
        useLoginEmail: true,
        email: data.email,
        interval: data.monitorInterval
      };
  
      try {
        const response = await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to create monitor');
        }
  
        const responseData = await response.json();
        const monitor = responseData.monitor;
  
        // Transform the response to match the Monitor interface
        return {
          id: monitor.id,
          keywords: monitor.keywords,
          isActive: monitor.status === 'active',
          excludedKeywords: monitor.excludedKeywords || [],
          sellers: monitor.sellers || [],
          minPrice: monitor.minPrice,
          maxPrice: monitor.maxPrice,
          condition: monitor.conditions || [],
          email: responseData.emailStatus === 'verification_required'
            ? 'Verification required'
            : undefined,
          monitorInterval: monitor.interval,
        };
      } catch (error) {
        console.error('Error creating monitor:', error);
        throw error;
      }
    }
  
    /**
     * Get all monitors for the current user
     * @returns List of monitors and hasActiveEmail status
     */
    async getAll(): Promise<{monitors: Monitor[], hasActiveEmail: boolean}> {
      try {
        console.log('Fetching monitors from API endpoint');
        const response = await fetch(this.apiEndpoint);
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || 'Failed to fetch monitors');
        }
  
        const data = await response.json();
        console.log('Received monitors data:', data);
  
        if (data && typeof data === 'object' && 'monitors' in data) {
          return {
            monitors: (data.monitors || []).map((monitor: any) => ({
              id: monitor.id,
              keywords: monitor.keywords || [],
              isActive: monitor.status === 'active',
              excludedKeywords: monitor.excludedKeywords || [],
              sellers: monitor.sellers || [],
              minPrice: monitor.minPrice,
              maxPrice: monitor.maxPrice,
              condition: monitor.conditions || [],
              monitorInterval: monitor.interval,
            })),
            hasActiveEmail: !!data.hasActiveEmail
          };
        } else {
          const monitorsArray = Array.isArray(data) ? data : [];

          return {
            monitors: monitorsArray.map((monitor: any) => ({
              id: monitor.id,
              keywords: monitor.keywords || [],
              isActive: monitor.status === 'active',
              excludedKeywords: monitor.excludedKeywords || [],
              sellers: monitor.sellers || [],
              minPrice: monitor.minPrice,
              maxPrice: monitor.maxPrice,
              condition: monitor.conditions || [],
              monitorInterval: monitor.interval,
            })),
            hasActiveEmail: true
          };
        }
      } catch (error) {
        console.error('Error fetching monitors:', error);
        throw error;
      }
    }
  
    /**
     * Update an existing monitor
     * @param id Monitor ID
     * @param updates Partial monitor data to update
     * @returns The updated monitor
     */
    async update(id: string, updates: Partial<Monitor>): Promise<Monitor> {
      try {
        // Transform the updates to match the backend schema
        const backendUpdates = {
          ...updates,
          status: updates.isActive !== undefined 
            ? (updates.isActive ? 'active' : 'inactive') 
            : undefined,
          conditions: updates.condition, // Map condition to conditions
          interval: updates.monitorInterval, // Map monitorInterval to interval
        };
  
        if (backendUpdates.isActive !== undefined) {
          delete backendUpdates.isActive;
        }
        if (backendUpdates.condition !== undefined) {
          delete backendUpdates.condition;
        }
        if (backendUpdates.monitorInterval !== undefined) {
          delete backendUpdates.monitorInterval;
        }
  
        const response = await fetch(`${this.apiEndpoint}/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendUpdates),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to update monitor');
        }
  
        const monitor = await response.json();
  
        return {
          id: monitor.id,
          keywords: monitor.keywords,
          isActive: monitor.status === 'active',
          excludedKeywords: monitor.excludedKeywords || [],
          sellers: monitor.sellers || [],
          minPrice: monitor.minPrice,
          maxPrice: monitor.maxPrice,
          condition: monitor.conditions || [],
          monitorInterval: monitor.interval,
        };
      } catch (error) {
        console.error('Error updating monitor:', error);
        throw error;
      }
    }
  
    /**
     * Delete a monitor
     * @param id Monitor ID
     */
    async delete(id: string): Promise<void> {
      try {
        const response = await fetch(`${this.apiEndpoint}/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Failed to delete monitor');
        }
      } catch (error) {
        console.error('Error deleting monitor:', error);
        throw error;
      }
    }
  
    /**
     * Toggle a monitor's active status
     * @param id Monitor ID
     * @param isActive New active status
     * @returns The updated monitor
     */
    async toggle(id: string, isActive: boolean): Promise<Monitor> {
      return this.update(id, { isActive });
    }
  }
  
  const monitorService = new MonitorService();
  export default monitorService;
  